const removeFilters = (setFilters, barRefs, marimiRefs, culoriRefs, setPretMin, setPretMax, setContainerProducts, products, displayedProducts, setDisplayedProducts) => {
    setFilters({
        sort: "",
        marimi: [],
        culori: [],
        preturi: [null, null]
    })
    const dropdownContainerSortare = barRefs.sortareRef.current.children[1]
    dropdownContainerSortare.children[0].children[0].checked = false;
    dropdownContainerSortare.children[1].children[0].checked = false;
    dropdownContainerSortare.children[2].children[0].checked = false;
    Object.values(marimiRefs.current).forEach(m => {
        if (m) {
            m.children[0].checked = false;
        }
    })
    Object.values(culoriRefs.current).forEach(c => {
        if (c) {
            c.children[0].checked = false;
        }
    })
    const dropdownContainerPret = barRefs.pretRef.current.children[1]
    dropdownContainerPret.children[0].children[0].value = '';
    dropdownContainerPret.children[1].children[0].value = '';
    setPretMin(null)
    setPretMax(null)
    setContainerProducts(products);
    setDisplayedProducts(displayedProducts)
}

export default removeFilters