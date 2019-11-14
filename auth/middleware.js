const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
        const secret = process.env.JWT_SECRET || '/fKv$]%UBfeYHianq`S}cAopuQ5wL3uePM2UAQ~H`;#]h^Mv#>cxMa[4^782qFe'
        // check that the token is valid
        jwt.verify(token, secret, (err, decodedToken) => {
            if(err) {
            // bad token - it's been tampered with
                res.status(401).json({ message: "Invalid Credentials" })
            } else {
                req.decodedJwt = decodedToken;
            next();
            }
        })
    } else {
        res.status(400).json({ message: 'No credentials provided' });
    }
};
