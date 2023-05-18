const SERVER = 'http://localhost:8123';

const checkLoggedIn = async (setUser, setLoggedIn, setLoading) => {
    try {
        const response = await fetch(`${SERVER}/user/auth`, {
            method: 'GET',
            credentials: 'include',
        });

        if (response.status === 200) {
            const data = await response.json();
            setUser(data.user);
            setLoggedIn(true);
        } else if (response.status === 401) {
            setLoggedIn(false);
            setUser({});
        } else {
            setLoggedIn(false);
            setUser({});
            console.error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        setLoggedIn(false);
        setUser({});
        console.error('Error fetching auth status:', error);
    }
    setLoading(false);
};

export default checkLoggedIn;