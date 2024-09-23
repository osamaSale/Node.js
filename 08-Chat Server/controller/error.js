const error = (massage) => {
    let data = {
        status: 400,
        massage: massage,
    };
    return data;
};

module.exports = { error }