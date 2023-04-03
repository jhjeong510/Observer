const jwt = require('jsonwebtoken');
const dbManager = require('../db/dbManager');

const signJsonWebToken = async (id) => {
  const payLoad = {
    id: id,
    logindatetime: new Date().getTime()
  };
  const secret = 'observer';
  const signOption = {
    issuer: 'GreenITKorea',
    subject: 'greenitkr000@gmail.com',
    audience: 'http://greenitkr.com',
    expiresIn: '24h',
    // algorithm: 'RS256'
  }

  return new Promise((resolve, reject) => {
    jwt.sign(payLoad, secret, signOption, (err, token) => {
      if (err) {
        console.log('jwt sign err:', err);
        return reject(err);
      }
      return resolve(token);
    })
  });
}

const veryfyJsonWebToken = async (token) => {
  const secret = 'observer';

  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    })  
  });  
}

exports.login = async (id, password) => {
  const query = `SELECT id FROM "users" WHERE "id"='${id}' AND "password"=MD5('${password}')`;
  try {
    const res = await dbManager.pgQuery(query);
    if (res && res.rows && res.rows.length > 0) {
      const token = await signJsonWebToken(id);
      return token;
    } else {
      return null;
    }
  } catch (err) {
    console.log('login err:', err);
    throw err;
  }
}

exports.register = async (id, password) => {

}

exports.logout = async (token) => {

}

exports.checkToken = async (token) => {
  try {
    const res = await veryfyJsonWebToken(token);
    return res;
  } catch (err) {
    return err;
  }
}
