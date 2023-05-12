const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');
const ProductType = require('../models/productTypeModel');
const { Product } = require('../models/productModel');

const IMAGE_SIZE = 224;
const EPOCHS = 12;

const getProductTypes = async () => {
    const productTypes = await ProductType.find();
    return productTypes.map(pt => pt.product_type_name);
};

const loadImage = async (pathToImage) => {
    const basePath = path.resolve(__dirname, '..', 'public', 'images', 'products');
    const fullPath = path.join(basePath, pathToImage);
    const imageBuffer = fs.readFileSync(fullPath);
    const tfimage = tf.node.decodeImage(imageBuffer, 3);
    return tfimage;
}

const createModel = async (numClasses) => {
    const pretrainedModel = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
    const layer = pretrainedModel.getLayer('conv_pw_13_relu');
    const truncatedModel = tf.model({ inputs: pretrainedModel.inputs, outputs: layer.output });

    const model = tf.sequential();
    model.add(truncatedModel);
    model.add(tf.layers.globalAveragePooling2d({ dataFormat: 'channelsLast' }));
    model.add(tf.layers.dense({ units: 128, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
    model.add(tf.layers.dense({ units: numClasses, activation: 'softmax' }));

    model.compile({
        optimizer: tf.train.adam(),
        loss: 'sparseCategoricalCrossentropy',
        metrics: ['accuracy'],
    });

    return model;
};

const productsByProductTypeName = async (productTypeName) => {
    const pipeline = [
        {
            $lookup: {
                from: "producttypes",
                localField: "product_type_id",
                foreignField: "_id",
                as: "product_type"
            }
        },
        {
            $match: {
                "product_type.product_type_name": productTypeName
            }
        },
    ]
    const products = await Product.aggregate(pipeline);
    return products;
}

const loadDataset = async () => {
    const data = [];
    const labels = [];

    const productTypes = await getProductTypes();

    for (let i = 0; i < productTypes.length; i++) {
        const products = await productsByProductTypeName(productTypes[i]);
        for (const item of products) {
            const label = i;
            for (let j = 1; j <= item.nrImages; j++) {
                const img = await loadImage(`${item._id}/img${j}.jpg`);
                const processedImg = img.resizeNearestNeighbor([IMAGE_SIZE, IMAGE_SIZE]).toFloat().div(255);
                data.push(processedImg);
                img.dispose();
                labels.push(label);
            }
        }
    }

    const xs = tf.stack(data);
    const ys = tf.tensor(labels, [labels.length]);

    return { xs, ys };
}

const trainModel = async (model, dataset) => {
    const { xs, ys } = dataset;

    await model.fit(xs, ys, {
        epochs: EPOCHS,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                console.log(`Epoch ${epoch + 1} of ${EPOCHS}: Loss = ${logs.loss.toFixed(3)}, Accuracy = ${logs.acc.toFixed(3)}`);
            },
        },
    });

    xs.dispose();
    ys.dispose();
}

const startTraining = async (req, res) => {
    const productTypes = await getProductTypes();
    const numClasses = productTypes.length;

    const model = await createModel(numClasses);
    const dataset = await loadDataset();
    await trainModel(model, dataset);
    await model.save('file://intelligentSuggestion');
    return res.status(200).json({ message: 'Antrenarea modelului a fost realizata cu succes, iar modelul a fost salvat' })
}

module.exports = { startTraining };