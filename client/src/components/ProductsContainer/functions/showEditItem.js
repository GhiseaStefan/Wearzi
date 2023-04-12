const showEditItem = (editItem, barRefs) => {
    Object.values(barRefs).forEach(r => {
        if (r !== editItem) {
            const arrow = r.current.children[0].children[0]
            const dropdownContainer = r.current.children[1]
            arrow.classList.remove('open');
            dropdownContainer.classList.remove('visible')
        } else {
            const arrow = editItem.current.children[0].children[0]
            const dropdownContainer = editItem.current.children[1]
            arrow.classList.toggle('open')
            dropdownContainer.classList.toggle('visible')
        }
    })
}

export default showEditItem