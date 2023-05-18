const SERVER = 'http://localhost:8123';

const getUserCart = async (loggedIn, user) => {
    if (loggedIn) {
        try {
            const response = await fetch(`${SERVER}/user/updateCart?userId=${user._id}`);
            const data = await response.json();
            if (response.status === 200) {
                const userCartItems = data.cartItems;
                return userCartItems;
            }
        } catch (err) {
            console.warn(err);
        }
    }
    return {};
}

export default getUserCart;