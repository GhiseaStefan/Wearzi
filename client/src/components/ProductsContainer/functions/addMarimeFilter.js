const addMarimeFilter = (e, filters, setFilters) => {
    const newFilters = { ...filters }
    if (e.target.checked) {
        newFilters.marimi.push(e.target.value)
    } else {
        newFilters.marimi.splice(newFilters.marimi.indexOf(e.target.value), 1)
    }
    setFilters(newFilters)
}

export default addMarimeFilter