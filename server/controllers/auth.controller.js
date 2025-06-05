const md5 = require('md5');
const { createUser, findUserByEmail } = require('../models/User.model');

const login = async(req, res) => {
    const {email, password} = req.body;
    const user = await findUserByEmail(email);

    if(!user){
        return res.status(401).json({message: 'Email does not exist'});
    }

    const isMatch = (md5(password) === user.password) ? true : false;
    if(!isMatch){
        return res.status(401).json({message: "Invalid Credentials"});
    }

    req.session.user = {
        id: user.user_id,
        username: user.username,
        email: user.email
    };

    res.status(200).json({message: "Login successful", user: req.session.user});
}

module.exports = {
    login
}