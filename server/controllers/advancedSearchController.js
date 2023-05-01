const { NlpManager } = require('node-nlp');
const fs = require('fs');
const { Product } = require('../models/productModel');

const manager = new NlpManager({ languages: ['ro'] });

const trainingData = JSON.parse(fs.readFileSync('public/trainingData.json', 'utf-8'))
for (const example of trainingData) {
    manager.addDocument(example.language, example.input, example.output);
}

(async () => {
    await manager.train();
    manager.save();
})();

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const advSearch = async (req, res) => {
    try {
        const { searchMessage } = req.body;
        const response = await manager.process('ro', searchMessage);
        const intent = response.intent;
        const intentList = intent.split(',').map(el => el.trim())
        if (intent) {
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
                        $or: [
                            { "product_type.product_type_name": { $in: intentList } },
                            { "description": { $regex: new RegExp(intentList.join('|'), 'i') } }
                        ]
                    }
                },
            ]
            const products = await Product.aggregate(pipeline);
            shuffleArray(products)
            return res.status(200).json(products);
        } else {
            return res.status(400).json({ message: 'Nu am înțeles cererea. Vă rugăm să încercați din nou.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

module.exports = { advSearch }