const Category = require('../models/categoryModel');

const getCategories = async (req, res) => {
    try {
        let { limit } = req.query;
        if (limit) {
            limit = parseInt(limit, 10);
        }
        const categories = await Category.find().limit(limit);
        return res.status(200).json(categories);
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when getting all categories' });
    }
};

const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.status(200).json(category);
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when getting category' });
    }
};

const createCategory = async (req, res) => {
    try {
        const { category_name } = req.body;
        await Category.create({ category_name });
        return res.status(201).json({ message: 'New category created' });
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when creating category' });
    }
};

const updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const { category_name } = req.body;
        category.category_name = category_name;
        await category.save();
        return res.status(200).json({ message: 'Category updated' });
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when updating category' });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.remove();
        return res.status(200).json({ message: 'Category deleted' });
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when deleting category' });
    }
};

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };