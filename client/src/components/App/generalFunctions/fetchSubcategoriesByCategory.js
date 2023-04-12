const SERVER = 'http://localhost:8123';

const fetchSubcategoriesByCategory = async (category_id) => {
    try {
        const subcategoriesServer = await (await fetch(`${SERVER}/subcategories/category/${category_id}`)).json()
        const subcategoriesClient = {}
        subcategoriesServer.forEach(s => subcategoriesClient[s._id] = s)
        return subcategoriesClient
    } catch (err) {
        console.warn(err)
    }
}

export default fetchSubcategoriesByCategory