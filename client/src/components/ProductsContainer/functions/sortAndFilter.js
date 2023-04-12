const backToObj = (values) => {
    return values.reduce((acc, curr) => {
        acc[curr._id] = curr;
        return acc;
    }, {});
}

const sortAndFilter = (filters, products, setShowRemoveFilters, setContainerProducts, displayedProducts, setDisplayedProducts) => {
    if (filters.sort !== "" || filters.marimi.length !== 0 || filters.culori.length !== 0 || filters.preturi[0] !== null || filters.preturi[1] !== null) {
        setShowRemoveFilters(true)
    } else {
        setShowRemoveFilters(false)
    }
    let modifiedProducts = { ...products }
    if (filters.sort === 'pretCrescator') {
        modifiedProducts = Object.values(modifiedProducts).sort((a, b) => {
            const priceA = a.discount !== 0 ? (a.price - a.price * a.discount) : a.price;
            const priceB = b.discount !== 0 ? (b.price - b.price * b.discount) : b.price;
            return priceA > priceB
        });
    }
    if (filters.sort === 'pretDescrescator') {
        modifiedProducts = Object.values(modifiedProducts).sort((a, b) => {
            const priceA = a.discount !== 0 ? (a.price - a.price * a.discount) : a.price;
            const priceB = b.discount !== 0 ? (b.price - b.price * b.discount) : b.price;
            return priceA < priceB
        });
    }
    if (filters.sort === 'celMaiNou') {
        modifiedProducts = Object.values(modifiedProducts).reverse();
    }
    if (filters.marimi.length !== 0) {
        const filteredProductsValues = Object.values(modifiedProducts).filter((p) => p.size.some(m => filters.marimi.includes(m)))
        modifiedProducts = backToObj(filteredProductsValues)
    }
    if (filters.culori.length !== 0) {
        const filteredProductsValues = Object.values(modifiedProducts).filter((p) => filters.culori.includes(p.color))
        modifiedProducts = backToObj(filteredProductsValues)
    }
    if (filters.preturi[0] !== null && filters.preturi[1] === null) {
        const filteredProductsValues = Object.values(modifiedProducts).filter((p) => {
            const actualPrice = p.discount !== 0 ? (p.price - p.price * p.discount) : p.price;
            return actualPrice > filters.preturi[0]
        })
        modifiedProducts = backToObj(filteredProductsValues)
    }
    if (filters.preturi[0] === null && filters.preturi[1] !== null) {
        const filteredProductsValues = Object.values(modifiedProducts).filter((p) => {
            const actualPrice = p.discount !== 0 ? (p.price - p.price * p.discount) : p.price;
            return actualPrice < filters.preturi[1]
        })
        modifiedProducts = backToObj(filteredProductsValues)
    }
    if (filters.preturi[0] !== null && filters.preturi[1] !== null) {
        const filteredProductsValues = Object.values(modifiedProducts).filter((p) => {
            const actualPrice = p.discount !== 0 ? (p.price - p.price * p.discount) : p.price;
            return (filters.preturi[0] < actualPrice) && (actualPrice < filters.preturi[1])
        })
        modifiedProducts = backToObj(filteredProductsValues)
    }
    setContainerProducts(modifiedProducts)
    if (filters.marimi.length !== 0 || filters.culori.length !== 0 || filters.preturi[0] !== null || filters.preturi[1] !== null) {
        setDisplayedProducts(Object.values(modifiedProducts).length)
    }
}

export default sortAndFilter