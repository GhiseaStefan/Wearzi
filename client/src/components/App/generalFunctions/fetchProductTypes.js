const SERVER = 'http://localhost:8123'

const fetchProductTypes = async () => {
    try {
        const productTypesServer = await (await fetch(`${SERVER}/productTypes`)).json()
        const productTypesClient = {}
        productTypesServer.forEach(pt => productTypesClient[pt._id] = pt)
        return productTypesClient
    } catch (err) {
        console.warn(err)
    }
}

export default fetchProductTypes