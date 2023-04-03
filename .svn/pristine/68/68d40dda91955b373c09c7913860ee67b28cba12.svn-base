const jwt = require('jsonwebtoken');

exports.tokenCheck = async (req, res, next) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    res.status(401).send({
      err: {
        code: 2,
        message: 'unauthorized'
      }
    });
    return;
  }
  const token = bearerToken.split('Bearer ')[1];
  if (!token) {
    res.status(401).send({
      err: {
        code: 2,
        message: 'unauthorized'
      }
    });
    return;
  }

  const secret = 'ebell';
  
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(401).send({
        err: {
          code: 2,
          message: 'unauthorized'
        }
      });
      return;
    }
    next();
  });
  
}