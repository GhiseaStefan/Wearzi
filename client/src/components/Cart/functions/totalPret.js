import discountedPrice from "./discountedPrice"

const totalPret = (cartItems) => {
    let p = 0.0
    Object.values(cartItems).forEach(ci => {
        if (ci.discount !== 0) {
            p += parseFloat(discountedPrice(ci.price, ci.discount) * ci.quantity)
        } else {
            p += parseFloat(ci.price * ci.quantity)
        }
    })
    return p
}

export default totalPret