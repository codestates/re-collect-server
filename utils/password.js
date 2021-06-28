
module.exports = {
  isValidPwd: (pwd) => {
    var strongPwd = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    var mediumPwd = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    if(strongPwd.test(pwd) || mediumPwd.test(pwd) ) {
      return true;
    } else {
      return false;
    }
  },

  makeRandomPwd: (len) => {
  let charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for(let i =0; i< len; i++ ) {
    result += charset[Math.floor(Math.random()*charset.length)];
  }
  console.log('임시 비밀번호', result);
  return result;
  }
}
