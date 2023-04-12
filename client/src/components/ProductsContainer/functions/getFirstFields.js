const getFirstFields = (obj, n) => {
    const newObj = {};
    const keys = Object.keys(obj);
    for (let i = 0; i < n && i < keys.length; i++) {
        newObj[keys[i]] = obj[keys[i]];
    }
    return newObj;
}

export default getFirstFields