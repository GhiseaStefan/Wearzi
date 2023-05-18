const SERVER = 'http://localhost:8123'

const handleSendOrder = async (loggedIn, user, cartItems, setCartItems, setError) => {
    if (loggedIn) {
        try {
            const response = await fetch(`${SERVER}/user/sendOrder`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({
                    userId: user._id,
                    cartItems: Object.values(cartItems),
                }),
            });

            if (response.ok) {
                setCartItems({});
                localStorage.setItem("cartItems", JSON.stringify({}));
                setError('');
            }

        } catch (err) {
            console.warn(`Eroare la trimiterea comenzii: ${err.message}`);
        }
    } else {
        setError('Trebuie sa va autentificati pentru a trimite comanda')
    }
};

export default handleSendOrder;