module.exports = {
  apiLimiter: new RateLimit({
  windowMs: 60 * 1000, //1분간
  max: 1, //최대 요청 횟수
  delayMS: 1000, //1초 간격
  handler(req, res){
    res.status(this.statusCode).json({
      code: this.statusCode,
      message: '1분에 한 번만 요청을 보낼 수 있습니다'
    })
  }
  })
}