const SERVER = 'http://localhost:8123'

const fetchProductTypesBySubcategory = async (subcategory_id, limit) => {
    try {
        const productsServer = await (await fetch(`${SERVER}/products/subcategory/${subcategory_id}?limit=${limit}`)).json()
        const productsClient = {}
        productsServer.forEach(p => productsClient[p._id] = p)
        return productsClient
    } catch (err) {
        console.warn(err)
    }
}

export default fetchProductTypesBySubcategory