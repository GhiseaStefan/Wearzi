const handleHover = (category_id, mode, categoryRefs) => {
    const categoryName = categoryRefs.current[category_id].children[0]
    if (mode === 'over') {
        categoryName.classList.add('category-hovered')
    }
    if (mode === 'out') {
        categoryName.classList.remove('category-hovered')
    }
}

export default handleHover;