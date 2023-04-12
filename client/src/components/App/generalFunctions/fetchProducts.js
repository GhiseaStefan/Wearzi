const SERVER = 'http://localhost:8123'

const fetchProducts = async () => {
    try {
        const productsServer = await (await fetch(`${SERVER}/products/`)).json()
        const productsClient = {}
        productsServer.forEach(p => productsClient[p._id] = p)
        return productsClient
    } catch (err) {
        console.warn(err)
    }
}

export default fetchProducts