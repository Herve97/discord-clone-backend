const jwt = require('jsonwebtoken');
const config = process.env;

const verifyToken = async (req, res, next) => {

  let token = req.body.token || req.query.token || req.headers['authorization'];

  if(!token){
    return res.status(403).send("A token is required for authentication.");
  }

  try {

    token = token.replace(/^Bearer\s+/, "");
    const decoded = jwt.verify(token, config.Token_KEY)
    req.user = decoded;
  } catch (err) {
    console.log(err);
    return res.status(401).send("Invalid token")
  }

  return next();

}

module.exports = verifyToken;