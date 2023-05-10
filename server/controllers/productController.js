const multer = require('multer')
const path = require('path')
const fs = require('fs')
const mongoose = require('mongoose');
const { Product } = require('../models/productModel');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json(products);
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when getting all products' });
    }
};

const getProductsByCategory = async (req, res) => {
    try {
        const { category_id } = req.params;
        let { limit } = req.query;
        if (limit) {
            limit = parseInt(limit, 10);
        }
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
                $lookup: {
                    from: "subcategories",
                    localField: "product_type.subcategory_id",
                    foreignField: "_id",
                    as: "subcategory"
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "subcategory.category_id",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $match: {
                    "category._id": mongoose.Types.ObjectId(category_id)
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]
        if (limit) {
            pipeline.push({ $limit: limit })
        }
        const products = await Product.aggregate(pipeline);
        return res.status(200).json(products);
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when getting products by category' });
    }
}

const getProductsBySubcategory = async (req, res) => {
    try {
        const { subcategory_id } = req.params;
        let { limit } = req.query;
        if (limit) {
            limit = parseInt(limit, 10);
        }
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
                $lookup: {
                    from: "subcategories",
                    localField: "product_type.subcategory_id",
                    foreignField: "_id",
                    as: "subcategory"
                }
            },
            {
                $match: {
                    "subcategory._id": mongoose.Types.ObjectId(subcategory_id)
                }
            },
        ]
        if (limit) {
            pipeline.push({ $limit: limit })
        }
        const products = await Product.aggregate(pipeline);
        return res.status(200).json(products);
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when getting products by subcategory' });
    }
}

const getProductsByProductType = async (req, res) => {
    try {
        const { product_type_id } = req.params;
        let { limit } = req.query;
        if (limit) {
            limit = parseInt(limit, 10);
        }
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
                    "product_type._id": mongoose.Types.ObjectId(product_type_id)
                }
            },
        ]
        if (limit) {
            pipeline.push({ $limit: limit })
        }
        const products = await Product.aggregate(pipeline);
        return res.status(200).json(products);
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when getting products by product type' });
    }
}

const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(product);
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when getting product' });
    }
};

// uploadImage
const startingIndexNumber = (uploadDir) => {
    const files = fs.readdirSync(uploadDir);
    const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext)
    })
    return imageFiles.length
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const uploadDir = `public/images/products/${req.body._id}`
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir)
        }
        callback(null, uploadDir)
    },
    filename: (req, file, callback) => {
        const uploadDir = `public/images/products/${req.body._id}`
        const ext = path.extname(file.originalname)
        const name = `img${startingIndexNumber(uploadDir) + 1}${ext}`
        callback(null, name)
    }
})

const upload = multer({ storage })

const uploadImage = async (req, res) => {
    upload.array('images')(req, res, (error) => {
        if (error) {
            console.warn(error);
            return res.status(500).json({ message: 'Failed to upload image' })
        } else {
            return res.status(200).json({ message: 'Images uploaded' })
        }
    })
}

const createProduct = async (req, res) => {
    try {
        const { product_name, price, quantity, discount, size, color, description, nrImages, product_type_id } = req.body;
        const newProduct = await Product.create({ product_name, price, quantity, discount, size, color, description, nrImages, product_type_id });
        return res.status(201).json(newProduct);
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when creating product' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const updates = {};
        for (const [key, value] of Object.entries(req.body)) {
            if (value) {
                updates[key] = value;
            }
        }
        await Product.findByIdAndUpdate(req.params.id, updates);
        return res.status(200).json({ message: 'Product updated' });
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when updating product' });
    }
};

const deleteProductImages = async (productId) => {
    const imageDir = `public/images/products/${productId}`;

    try {
        const files = await fs.promises.readdir(imageDir);

        for (const file of files) {
            await fs.promises.unlink(`${imageDir}/${file}`);
        }

        await fs.promises.rmdir(imageDir);
    } catch (err) {
        console.warn(err);
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await deleteProductImages(product._id.toString());
        await product.remove();
        return res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when deleting product' });
    }
};

module.exports = { getProducts, getProductsByCategory, getProductsBySubcategory, getProductsByProductType, getProduct, createProduct, updateProduct, deleteProduct, uploadImage };