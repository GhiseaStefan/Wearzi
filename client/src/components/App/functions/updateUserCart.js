const SERVER = 'http://localhost:8123';

const updateUserCart = async (updatedCartItems, loggedIn, user) => {
    if (loggedIn) {
        try {
            await fetch(`${SERVER}/user/updateCart`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user._id,
                    cartItems: updatedCartItems
                })
            });
        } catch (err) {
            console.warn(err);
        }
    }
}

export default updateUserCart;