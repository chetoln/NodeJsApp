module.exports = class MemberCheck {
  //判斷email格式
  checkEmail(email) {
    const mailFormat = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return mailFormat.test(email);
  }

  //判斷空值
  checkNull(data) {
    for (let key in data) {
      // 不為空
      return false;
    }
    // 為空值
    return true;
  }
};
