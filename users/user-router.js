const router = require('express').Router();

const Users = require('./user-model.js');
const restricted = require('../auth/middleware.js');

router.get('/', restricted, checkRole(['student', 'admin']), (req, res) => {
    Users.find()
    .then(users => {
        res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = router;

function checkRole(roles) {
    return (req, res, next) => {
        if(roles.includes(req.decodedJwt.role)) {
            next();
        } else {
            res.status(403).json({ message: "Cant touch this" })
        }
    }
}