const loadMarimi = (containerProducts) => {
    const loadedMarimi = []
    Object.values(containerProducts).forEach(p => {
        p.size.forEach(marime => {
            if (!loadedMarimi.includes(marime)) {
                loadedMarimi.push(marime)
            }
        })
    })
    return loadedMarimi
}

export default loadMarimi