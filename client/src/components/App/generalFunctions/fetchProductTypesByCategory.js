const SERVER = 'http://localhost:8123';

const fetchProductTypesByCategory = async (category_id) => {
    try {
        const productTypesServer = await (await fetch(`${SERVER}/productTypes/category/${category_id}`)).json()
        const productTypesClient = {}
        productTypesServer.forEach(pt => productTypesClient[pt._id] = pt)
        return productTypesClient
    } catch (err) {
        console.warn(err)
    }
}

export default fetchProductTypesByCategory