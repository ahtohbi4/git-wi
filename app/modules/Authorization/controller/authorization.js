/**
 * @module Authorization
 * @return {function}
 */
module.exports =  function (req, res, router) {
    res.end(router.generate('static_page_by_all_methods', {
        _locale: 'en',
        _protocol: 'https',
        foo: 'some'
    }, '#hash'));

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
