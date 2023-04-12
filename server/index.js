require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connect = require('./config/database');

const categoriesRoute = require('./routes/categoriesRoute');
const subcategoriesRoute = require('./routes/subcategoriesRoute');
const productTypesRoute = require('./routes/productTypeRoute');
const productsRoute = require('./routes/productsRoute');

const port = process.env.PORT || 8123;
const app = express();

connect();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.use('/categories', categoriesRoute);
app.use('/subcategories', subcategoriesRoute);
app.use('/productTypes', productTypesRoute);
app.use('/products', productsRoute);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});