const ProductType = require('../models/productTypeModel');
const { Product } = require('../models/productModel');
const { deleteProductImages } = require('./productController');
const mongoose = require('mongoose');

const getProductTypes = async (req, res) => {
    try {
        const productTypes = await ProductType.find().sort('_id');
        return res.status(200).json(productTypes);
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when getting all product types' });
    }
};

const getProductTypesBySubcategory = async (req, res) => {
    try {
        const { subcategory_id } = req.params;
        const pipeline = [
            {
                $lookup: {
                    from: "subcategories",
                    localField: "subcategory_id",
                    foreignField: "_id",
                    as: "subcategory"
                }
            },
            {
                $match: {
                    "subcategory._id": mongoose.Types.ObjectId(subcategory_id)
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]
        const productTypes = await ProductType.aggregate(pipeline);
        return res.status(200).json(productTypes);
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when getting product types by subcategory' });
    }
};

const getProductTypesByCategory = async (req, res) => {
    try {
        const { category_id } = req.params;
        const pipeline = [
            {
                $lookup: {
                    from: "subcategories",
                    localField: "subcategory_id",
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
                    _id: 1
                }
            }
        ]
        const productTypes = await ProductType.aggregate(pipeline);
        return res.status(200).json(productTypes);
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when getting product types by category' });
    }
};

const getProductType = async (req, res) => {
    try {
        const productType = await ProductType.findById(req.params.id);
        if (!productType) {
            return res.status(404).json({ message: 'Product type not found' });
        }
        return res.status(200).json(productType);
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when getting product type' });
    }
};

const createProductType = async (req, res) => {
    try {
        const { product_type_name, subcategory_id } = req.body;
        await ProductType.create({ product_type_name, subcategory_id });
        return res.status(201).json({ message: 'New product type created' });
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when creating product type' });
    }
};

const updateProductType = async (req, res) => {
    try {
        const productType = await ProductType.findById(req.params.id);
        if (!productType) {
            return res.status(404).json({ message: 'Product type not found' });
        }
        const updates = {};
        for (const [key, value] of Object.entries(req.body)) {
            if (value) {
                updates[key] = value;
            }
        }
        await ProductType.findByIdAndUpdate(req.params.id, updates);
        return res.status(200).json({ message: 'Product type updated' });
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when updating product type' });
    }
};

const deleteProductType = async (req, res) => {
    try {
        const productType = await ProductType.findById(req.params.id);
        if (!productType) {
            return res.status(404).json({ message: 'Product type not found' });
        }

        const products = await Product.find({ product_type_id: productType._id });

        if (products && products.length > 0) {
            for (let product of products) {
                await deleteProductImages(product._id.toString());
                await product.remove();
            }
        }

        await productType.remove();
        return res.status(200).json({ message: 'Product type and all associated products deleted' });
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when deleting product type' });
    }
};

module.exports = { getProductTypes, getProductTypesByCategory, getProductTypesBySubcategory, getProductType, createProductType, updateProductType, deleteProductType };