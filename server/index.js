require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connect = require('./config/database');

const categoriesRoute = require('./routes/categoriesRoute');
const subcategoriesRoute = require('./routes/subcategoriesRoute');
const productTypesRoute = require('./routes/productTypeRoute');
const productsRoute = require('./routes/productsRoute');
const advancedSearchRoute = require('./routes/advancedSearchRoute');
const userRoute = require('./routes/userRoute');
const suggestionRoute = require('./intelligentSuggestion/suggestionRoute');

const port = process.env.PORT || 8123;
const app = express();

connect();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(express.static('public'));

app.use('/categories', categoriesRoute);
app.use('/subcategories', subcategoriesRoute);
app.use('/productTypes', productTypesRoute);
app.use('/products', productsRoute);
app.use('/advancedSearch', advancedSearchRoute);
app.use('/user', userRoute);
app.use('/suggestion', suggestionRoute);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});