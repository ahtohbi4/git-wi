/**
 * @module Authorization
 * @return {function}
 */
module.exports =  function (req, res, router) {
    res.send(router.generate('main'));

    switch (req.method.toLowerCase()) {
        case 'post':
            if (/* email and password is valid */ true) {
                res.redirect(301, '/ru/');
            } else {
                return {
                    data: {
                        errors: [
                            'Authorization Error!'
                        ]
                    }
                };
            }
            break;
        case 'get':
        default:
            return {};
    }
};
