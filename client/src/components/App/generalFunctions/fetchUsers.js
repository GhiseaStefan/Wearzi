const SERVER = 'http://localhost:8123';

const fetchUsers = async () => {
    try {
        const usersServer = await (await fetch(`${SERVER}/user`)).json();
        const usersClient = {};
        usersServer.forEach(u => usersClient[u._id] = u);
        return usersClient;
    } catch (err) {
        console.warn(err);
    }
}

export default fetchUsers;