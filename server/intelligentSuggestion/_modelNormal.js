const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');
const ProductType = require('../models/productTypeModel');
const Product = require('../models/productModel');

const IMAGE_SIZE = 224;
const EPOCHS = 70;

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

const createModel = (numClasses) => {
    const baseModel = tf.sequential();
    baseModel.add(tf.layers.conv2d({ inputShape: [IMAGE_SIZE, IMAGE_SIZE, 3], filters: 16, kernelSize: 3, activation: 'relu' }));
    baseModel.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));
    baseModel.add(tf.layers.conv2d({ filters: 32, kernelSize: 3, activation: 'relu' }));
    baseModel.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));
    baseModel.add(tf.layers.conv2d({ filters: 64, kernelSize: 3, activation: 'relu' }));
    baseModel.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));
    baseModel.add(tf.layers.globalAveragePooling2d({ dataFormat: 'channelsLast' }));
    baseModel.add(tf.layers.dense({ units: 128, activation: 'relu' }));
    baseModel.add(tf.layers.dense({ units: 64, activation: 'relu' }));
    baseModel.add(tf.layers.dense({ units: numClasses, activation: 'softmax' }));

    baseModel.compile({
        optimizer: tf.train.adam(),
        loss: 'sparseCategoricalCrossentropy',
        metrics: ['accuracy'],
    });

    return baseModel;
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
            const img1 = await loadImage(`${item._id}/img1.jpg`);
            const img2 = await loadImage(`${item._id}/img2.jpg`);
            const processedImg1 = img1.resizeNearestNeighbor([IMAGE_SIZE, IMAGE_SIZE]).toFloat().div(255);
            const processedImg2 = img2.resizeNearestNeighbor([IMAGE_SIZE, IMAGE_SIZE]).toFloat().div(255);
            data.push(processedImg1);
            data.push(processedImg2);
            img1.dispose();
            img2.dispose();
            labels.push(label);
            labels.push(label);
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

const main = async (req, res) => {
    const productTypes = await getProductTypes();
    const numClasses = productTypes.length;

    const model = createModel(numClasses);
    const dataset = await loadDataset();
    await trainModel(model, dataset);
    await model.save('file://combinatii');
    return res.status(200).json({ message: 'Model training complete and saved.' })
}

module.exports = { main };