/**
 * @module Authorization
 * @return {function}
 */
module.exports =  function (req, res) {
    return {
        data: {
            errors: [
                req.method,
                'Message #1',
                'Message #2'
            ]
        }
    };
};
