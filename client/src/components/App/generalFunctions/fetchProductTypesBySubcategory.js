const SERVER = 'http://localhost:8123';

const fetchProductTypesBySubcategory = async (subcategory_id) => {
    try {
        const productTypesServer = await (await fetch(`${SERVER}/productTypes/subcategory/${subcategory_id}`)).json()
        const productTypesClient = {}
        productTypesServer.forEach(pt => productTypesClient[pt._id] = pt)
        return productTypesClient
    } catch (err) {
        console.warn(err)
    }
}

export default fetchProductTypesBySubcategory