require("dotenv").config();

const RateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const accessDecrypt = process.env.ACCESS_SECRET;
const refreshDecrypt = process.env.REFRESH_SECRET;


module.exports = {
  generateAccessToken: (data) => {
    return jwt.sign( { id: data.id, email: data.email }, accessDecrypt, { expiresIn: '1h' });
  },
  generateRefreshToken: (data) => {
    return jwt.sign( { id: data.id, email: data.email } , refreshDecrypt, { expiresIn: '14d' });
  },
  resendAccessToken: (res, accessToken) => {
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.status(200).send({
      message: 'ok'
    });
  },
  verifyToken: (req) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return null;
    }
    const token = authorization.split(' ')[1];
    try {
      return jwt.verify(token, accessDecrypt);
    } catch {
      return null;
    }
  },
  checkRefreshToken: (refreshToken) => {
    try {
      return jwt.verify(refreshToken, refreshDecrypt);
    } catch {
      return null;
    }
  },
};

