require('dotenv').config();

const jwt = require('jsonwebtoken');

// @ts-ignore
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  
  if (!token) return res.sendStatus(401);
  
  // @ts-ignore
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function generateAccessToken(username:string) {
  return jwt.sign( { data: username }, process.env.TOKEN_SECRET);
}

module.exports = {
  authenticateToken,
  generateAccessToken,
};
