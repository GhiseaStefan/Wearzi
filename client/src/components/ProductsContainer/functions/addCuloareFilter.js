const addCuloareFilter = (e, filters, setFilters) => {
    const newFilters = { ...filters }
    if (e.target.checked) {
        newFilters.culori.push(e.target.value)
    } else {
        newFilters.culori.splice(newFilters.culori.indexOf(e.target.value), 1)
    }
    setFilters(newFilters)
}

export default addCuloareFilter