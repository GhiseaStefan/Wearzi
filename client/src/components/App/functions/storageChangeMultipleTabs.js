const storageChangeMultipleTabs = (setCartItems) => {
    const handleStorageChange = (e) => {
        if (e.key === "cartItems") {
            setCartItems(JSON.parse(e.newValue));
        }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
        window.removeEventListener("storage", handleStorageChange);
    };
}

export default storageChangeMultipleTabs