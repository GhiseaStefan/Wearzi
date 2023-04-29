const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const validatePhoneNumber = (phoneNumber) => {
    const regex = /^(\+40|0)[0-9]{9}$/;
    return regex.test(phoneNumber);
};

const validatePostalCode = (postalCode) => {
    const regex = /^[0-9]{6}$/;
    return regex.test(postalCode);
};

module.exports = { validateEmail, validatePhoneNumber, validatePostalCode };