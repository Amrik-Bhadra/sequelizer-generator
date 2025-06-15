// const checkCredentials = (req, res, next) => {
//     if(req.session && req.session.user){
//         next();
//     }else{
//         return res.status(401).json({ message: 'Unauthorized: Please log in' });
//     }
// }

// module.exports = checkCredentials;



const { verifyToken } = require("../utils/jwtService");

const checkCredentials = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = checkCredentials;
