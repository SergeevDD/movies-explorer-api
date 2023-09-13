const jwt = require('jsonwebtoken');
const { SECRET_STRING } = require('../utils/config');
const AuthenticationError = require('../errors/authentication-err');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.send({status:false});
 return res.end();
  }
  let payload;
  try {
    payload = jwt.verify(
      token,
      SECRET_STRING,
    );
  } catch (err) {
    res.send({status:false});
return res.end();
  }

  res.send({status:true});
return res.end();
};