const loadCulori = (containerProducts) => {
    const loadedCulori = []
    Object.values(containerProducts).forEach(p => {
        if (!loadedCulori.includes(p.color)) {
            loadedCulori.push(p.color)
        }
    })
    return loadedCulori
}

export default loadCulori