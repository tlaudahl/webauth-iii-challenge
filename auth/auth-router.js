const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../users/user-model.js');
const { validateUser } = require('../users/user-helper');
// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
    let user = req.body;
  // always validate the data before sending it to the db
    const validateResult = validateUser(user);

    if(validateResult.isSuccessful === true) {
    const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
    user.password = hash;
    Users.add(user)
    .then(saved => {
        res.status(201).json(saved);
    })
    .catch(error => {
        res.status(500).json(error);
    });
} else {
    res.status(400).json({ message: "Invalid information about the user, see errors for details", errors: validateResult.errors })
}




});

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
    .first()
    .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
        // Produce a Token
            const token = getJwtToken(user.username);
        // send the token to the client
            res.status(200).json({
                token,
                message: `Welcome ${user.username}!`,
            });
        } else {
            res.status(401).json({ message: 'Invalid Credentials' });
        }
    })
    .catch(error => {
        res.status(500).json(error);
    });
});

function getJwtToken(username) {
    const payload = { 
    username, 
    role: 'student'  // this will probably come from the database
}

    const secret = process.env.JWT_SECRET || '/fKv$]%UBfeYHianq`S}cAopuQ5wL3uePM2UAQ~H`;#]h^Mv#>cxMa[4^782qFe'

    const options = {
    expiresIn: '1d'
}

    return jwt.sign(payload, secret, options)
}

module.exports = router;
