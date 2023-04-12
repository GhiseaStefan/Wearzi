const Subcategory = require('../models/subcategoryModel');
const mongoose = require('mongoose')

const getSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find();
        return res.status(200).json(subcategories);
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when getting all subcategories' });
    }
};

const getSubcategoriesByCategory = async (req, res) => {
    try {
        const { category_id } = req.params;
        const pipeline = [
            {
                $lookup: {
                    from: "categories",
                    localField: "category_id",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $match: {
                    "category._id": mongoose.Types.ObjectId(category_id)
                }
            }
        ]
        const subcategories = await Subcategory.aggregate(pipeline);
        return res.status(200).json(subcategories);
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when getting subcategories by category' });
    }
};

const getSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id);
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        return res.status(200).json(subcategory);
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when getting subcategory' });
    }
};

const createSubcategory = async (req, res) => {
    try {
        const { subcategory_name, category_id } = req.body;
        await Subcategory.create({ subcategory_name, category_id });
        return res.status(201).json({ message: 'New subcategory created' });
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when creating subcategory' });
    }
};

const updateSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id);
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        const updates = {};
        for (const [key, value] of Object.entries(req.body)) {
            if (value) {
                updates[key] = value;
            }
        }
        await Subcategory.findByIdAndUpdate(req.params.id, updates);
        return res.status(200).json({ message: 'Subcategory updated' });
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when updating subcategory' });
    }
};

const deleteSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id);
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        await subcategory.remove();
        return res.status(200).json({ message: 'Subcategory deleted' });
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when deleting subcategory' });
    }
};

module.exports = { getSubcategories, getSubcategoriesByCategory, getSubcategory, createSubcategory, updateSubcategory, deleteSubcategory };