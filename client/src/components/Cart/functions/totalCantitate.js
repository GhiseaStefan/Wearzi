const totalCantitate = (cartItems) => {
    let c = 0
    Object.values(cartItems).forEach(ci => c += ci.quantity)
    return c
}

export default totalCantitate