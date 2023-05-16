const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const ProductType = require('../models/productTypeModel');
const { Product } = require('../models/productModel');

const IMAGE_SIZE = 224;

const getProductTypes = async () => {
    const productTypes = await ProductType.find().sort('_id');
    return productTypes.map(pt => pt.product_type_name);
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

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const uploadDir = `public/temp_images`;
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        callback(null, `${name}${ext}`);
    },
});

const upload = multer({ storage })

const uploadImageSuggestion = async (req, res) => {
    upload.single('image')(req, res, (error) => {
        if (error) {
            console.warn(error);
            return res.status(500).json({ message: 'Imaginea nu a putut fi incarcata' });
        } else {
            const fileName = req.file.originalname;
            return res.status(200).json({ message: 'Imaginea a fost incarcata', fileName });
        }
    });
};

const getRandomProducts = (products, count) => {
    const shuffledProducts = products.slice().sort(() => 0.5 - Math.random());
    return shuffledProducts.slice(0, count);
};

const getSuggestion = async (req, res) => {
    try {
        const uploadedImagePath = path.resolve(__dirname, '..', 'public', 'temp_images', `${req.query.fileName}`);
        const imageBuffer = fs.readFileSync(uploadedImagePath);
        const processedImage = await sharp(imageBuffer).resize(IMAGE_SIZE, IMAGE_SIZE).toBuffer();

        const tfimage = tf.node.decodeImage(processedImage, 3);
        const inputTensor = tfimage.resizeNearestNeighbor([IMAGE_SIZE, IMAGE_SIZE]).toFloat().div(255);
        const inputData = tf.stack([inputTensor]);
        tfimage.dispose();
        inputTensor.dispose();

        const model = await tf.loadLayersModel('file://intelligentSuggestion/model.json');

        const predictions = model.predict(inputData);
        const topIndices = tf.topk(predictions, 1).indices.arraySync();

        const productTypes = await getProductTypes();

        const productTypeName = productTypes[topIndices[0][0]];
        const products = await productsByProductTypeName(productTypeName);
        const selectedProducts = getRandomProducts(products, 9);

        fs.unlinkSync(uploadedImagePath);

        return res.status(200).json({ outfitCombinations: selectedProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare in generare de sugestii' });
    }
};

module.exports = { uploadImageSuggestion, getSuggestion };