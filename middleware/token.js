"use strict";

require("dotenv").config();

const jwt = require('jsonwebtoken');
const accessDecrypt = process.env.ACCESS_SECRET;
const refreshDecrypt = process.env.REFRESH_SECRET;
class TokenMiddleware {
  static generateAccessToken(data) {
    return jwt.sign( { id: data.id, email: data.email }, accessDecrypt, { expiresIn: '30m' });
  }

  static generateRefreshToken(data) {
    return jwt.sign( { id: data.id, email: data.email }, refreshDecrypt, { expiresIn: '14d' });
  }

  static resendAccessToken(res, accessToken) {
    res.setHeader('authorization', `Bearer ${accessToken}`);
    res.status(200).send({
      message: 'get refresh token successfully'
    });
  }

  static verifyToken(req) {
    console.log('헤더 재확인',req.headers);
    let authorization = req.headers['authorization'];
    console.log('http_authorization', req.headers['http_authorization']);
    console.log('authorization확인',req.headers['authorization']);
    if(req.headers['http_authorization'] === undefined && req.headers['authorization'] !== undefined) {
      authorization = req.headers['authorization'];
    }
    if(req.headers['authorization'] === undefined && req.headers['http_authorization'] !== undefined) {
      console.log('http_authorization', req.headers['http_authorization']);
      authorization = req.headers['http_authorization'];
    }
    console.log('토큰 값을 확인', authorization)
    if(req.headers['http_authorization'] === undefined && req.headers['authorization'] === undefined) {
      return null;
    }
    const token = authorization.split(' ')[1];
    try {
      return jwt.verify(token, accessDecrypt);
    } catch {
      return null;
    }
  }
  static checkRefreshToken(refreshToken) {
    try {
    return jwt.decode(refreshToken);
    } catch {
      return null;
    }
  }
  
}

module.exports = TokenMiddleware;
