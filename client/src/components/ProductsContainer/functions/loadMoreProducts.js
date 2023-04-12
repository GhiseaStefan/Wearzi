const loadMoreProducts = (products, displayedProducts, NR_PRODUCTS, setDisplayedProducts) => {
    const total = Object.values(products).length;
    if (displayedProducts < total) {
        const newDisplayedProducts = Math.min(displayedProducts + NR_PRODUCTS, total);
        setDisplayedProducts(newDisplayedProducts);
    }
};

export default loadMoreProducts