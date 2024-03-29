const SERVER = 'http://localhost:8123'

const fetchProductsByCategory = async (category_id, limit, descending) => {
    try {
        const descendingQueryParam = descending ? 'true' : 'false';
        const productsServer = await (await fetch(`${SERVER}/products/category/${category_id}?limit=${limit}&descending=${descendingQueryParam}`)).json()
        const productsClient = {}
        productsServer.forEach(p => productsClient[p._id] = p)
        return productsClient
    } catch (err) {
        console.warn(err)
    }
}

export default fetchProductsByCategory