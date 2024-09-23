const error = (massage) => {
    let data = {
        status: 422,
        massage: massage,
    };
    return data;
};

module.exports = { error }