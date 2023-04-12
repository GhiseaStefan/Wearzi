const SERVER = 'http://localhost:8123'

const fetchCategories = async (limit) => {
    try {
        const categoriesServer = await (await fetch(`${SERVER}/categories?limit=${limit}`)).json()
        const categoriesClient = {}
        categoriesServer.forEach(c => categoriesClient[c._id] = c)
        return categoriesClient
    } catch (err) {
        console.warn(err)
    }
}

export default fetchCategories