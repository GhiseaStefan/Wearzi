const SERVER = 'http://localhost:8123'

const fetchSubcategories = async () => {
    try {
        const subcategoriesServer = await (await fetch(`${SERVER}/subcategories`)).json()
        const subcategoriesClient = {}
        subcategoriesServer.forEach(s => subcategoriesClient[s._id] = s)
        return subcategoriesClient
    } catch (err) {
        console.warn(err)
    }
}

export default fetchSubcategories