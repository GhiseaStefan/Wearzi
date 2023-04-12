const discountedPrice = (price, discount) => {
    return (price - price * discount).toFixed(2)
}

export default discountedPrice