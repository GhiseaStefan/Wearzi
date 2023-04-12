const addPretFilter = (pretMin, pretMax, filters, setFilters) => {
    if (!isNaN(pretMin) && !isNaN(pretMax)) {
        const newFilters = { ...filters }
        newFilters.preturi[0] = pretMin
        newFilters.preturi[1] = pretMax
        setFilters(newFilters)
    }
}

export default addPretFilter