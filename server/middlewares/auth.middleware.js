const checkCredentials = (req, res, next) => {
    if(req.session && req.session.user){
        next();
    }else{
        return res.status(401).json({ message: 'Unauthorized: Please log in' });
    }
}

module.exports = checkCredentials;