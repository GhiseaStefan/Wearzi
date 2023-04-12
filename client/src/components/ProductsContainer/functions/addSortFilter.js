const addSortFilter = (e, filters, setFilters) => {
    const newFilters = { ...filters }
    newFilters.sort = e.target.value
    setFilters(newFilters)
}

export default addSortFilter