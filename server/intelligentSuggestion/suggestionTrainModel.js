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
    model.add(tf.layers.dense({ units: 256, activation: 'relu' }));
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

    const shuffledIndices = tf.util.createShuffledIndices(data.length);
    const shuffledData = [];
    const shuffledLabels = [];

    shuffledIndices.forEach(index => {
        shuffledData.push(data[index]);
        shuffledLabels.push(labels[index]);
    });

    const trainSplitIdx = Math.floor(shuffledData.length * 0.7);
    const validSplitIdx = Math.floor(shuffledData.length * 0.9);

    const trainData = shuffledData.slice(0, trainSplitIdx);
    const trainLabels = shuffledLabels.slice(0, trainSplitIdx);

    const validData = shuffledData.slice(trainSplitIdx, validSplitIdx);
    const validLabels = shuffledLabels.slice(trainSplitIdx, validSplitIdx);

    const testData = shuffledData.slice(validSplitIdx);
    const testLabels = shuffledLabels.slice(validSplitIdx);

    const trainDataset = { xs: tf.stack(trainData), ys: tf.tensor(trainLabels, [trainLabels.length]) };
    const validDataset = { xs: tf.stack(validData), ys: tf.tensor(validLabels, [validLabels.length]) };
    const testDataset = { xs: tf.stack(testData), ys: tf.tensor(testLabels, [testLabels.length]) };

    return { trainDataset, validDataset, testDataset };
}

const trainModel = async (model, trainDataset, validDataset) => {
    const { xs: trainXs, ys: trainYs } = trainDataset;
    const { xs: validXs, ys: validYs } = validDataset;

    await model.fit(trainXs, trainYs, {
        epochs: EPOCHS,
        validationData: [validXs, validYs],
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                console.log(`Epoch ${epoch + 1} of ${EPOCHS}: Loss = ${logs.loss.toFixed(3)}, Accuracy = ${logs.acc.toFixed(3)}`);
            },
        },
    });

    trainXs.dispose();
    trainYs.dispose();
    validXs.dispose();
    validYs.dispose();
}

const startTraining = async (req, res) => {
    const productTypes = await getProductTypes();
    const numClasses = productTypes.length;

    const model = await createModel(numClasses);
    const { trainDataset, validDataset, testDataset } = await loadDataset();
    await trainModel(model, trainDataset, validDataset);

    const { xs: testXs, ys: testYs } = testDataset;
    const evaluation = model.evaluate(testXs, testYs);
    const testLoss = evaluation[0].dataSync()[0];
    const testAccuracy = evaluation[1].dataSync()[0];
    console.log(`Test Loss: ${testLoss.toFixed(3)}, Test Accuracy: ${testAccuracy.toFixed(3)}`);

    await model.save('file://intelligentSuggestion');

    testXs.dispose();
    testYs.dispose();

    return res.status(200).json({ message: 'Antrenarea modelului a fost realizata cu succes, iar modelul a fost salvat' })
}

module.exports = { startTraining };