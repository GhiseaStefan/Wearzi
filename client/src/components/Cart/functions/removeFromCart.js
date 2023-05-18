const removeFromCart = (productCartId, cartItems, setCartItems) => {
    const updatedCartItems = { ...cartItems };
    delete updatedCartItems[productCartId];
    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
}

export default removeFromCart;