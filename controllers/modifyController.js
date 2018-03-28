const toRegister = require("../models/registerModel");
const toLogin = require("../models/loginModel");
const toVerify = require("../models/verifyModel");
const toUpdate = require("../models/updateModel");
const MemberCheck = require("../service/memberCheck");
const encryption = require("../models/encryption");
const jwt = require("jsonwebtoken");
const config = require("../config/developConfig");
const httpStatus = require("http-status-codes");

const memberCheck = new MemberCheck();

module.exports = class Member {
  postRegister(req, res, next) {
    //Get data from client side
    const memberData = {
      name: req.body.name,
      email: req.body.email,
      password: encryption(req.body.password),
      create_date: onTime()
    };

    const checkEmail = memberCheck.checkEmail(memberData.email);
    if (!checkEmail) {
      res.json({
        result: {
          status: "Register failed.",
          err: "Invalid email."
        }
      });
      return;
    }

    // Write data into database
    toRegister(memberData).then(
      result => {
        // success
        res.json({
          result: {
            status: "Register successed.",
            data: result
          }
        });
      },
      err => {
        // fail
        res.json({
          result: {
            status: "Register failed.",
            err: err
          }
        });
      }
    );
  }

  postLogin(req, res, next) {
    const memberData = {
      email: req.body.email,
      password: encryption(req.body.password)
    };

    toLogin(memberData).then(rows => {
      if (memberCheck.checkNull(rows)) {
        res.json({
          result: {
            status: "login failed",
            err: "Error account or password."
          }
        });
      } else {
        res.json({
          result: {
            status: "login successed",
            loginMember: "Welcome! " + rows[0].name,
            token: getToken(rows[0].id)
          }
        });
      }
    });
  }

  putUpdateInfo(req, res, next) {
    const token = req.headers["token"];
    if (memberCheck.checkNull(token) || !req.body.name) {
      res.json({
        result: {
          status: "Update user info failed",
          err: !req.body.name ? "Invalid parameter" : "Invalid token。"
        }
      });
      return;
    }

    toVerify(token).then(tokenResult => {
      if (tokenResult.status !== httpStatus.OK) {
        res.json({
          result: {
            status: "Update user info failed",
            err: tokenResult.err
          }
        });
      } else {
        const id = tokenResult.data;
        const updData = {
          name: req.body.name,
          update_date: onTime()
        };
        //remove name if user does't update name
        if (!updData.name) delete updData.name;

        toUpdate(id, updData).then(
          result => {
            res.json({
              result: {
                status: "User info updated",
                data: result
              }
            });
          },
          err => {
            res.json({
              result: {
                status: "Update user info failed",
                err: err
              }
            });
          }
        );
      }
    });
  }

  //TODO
  putUpdatePassword(req, res, next) {
    const token = req.headers["token"];
    if (
      !token ||
      !req.body.oriPassword ||
      !req.body.newPassword ||
      !req.body.email
    ) {
      res.json({
        result: {
          status: "Update password failed.",
          err: !token ? "Invalid token" : "Invalid parameter"
        }
      });
      return;
    }

    //Get data from client side
    const pwdData = {
      email: req.body.email,
      oriPassword: req.body.oriPassword,
      newPassword: req.body.newPassword,
      update_date: onTime()
    };

    const oriData = {
      email: req.body.email,
      password: encryption(req.body.oriPassword)
    };
    toVerify(token).then(tokenResult => {
      if (tokenResult.status !== httpStatus.OK) {
        res.json({
          result: {
            status: "Update password failed",
            err: tokenResult.err
          }
        });
      } else {
        const id = tokenResult.data;
        const updData = {
          password: encryption(req.body.newPassword),
          update_date: onTime()
        };

        toUpdate(id, updData).then(
          result => {
            res.json({
              result: {
                status: "User password updated",
                data: result
              }
            });
          },
          err => {
            res.json({
              result: {
                status: "Update user password failed",
                err: err
              }
            });
          }
        );
      }
    });
  }
};

const getToken = id =>
  jwt.sign(
    {
      algorithm: "HS256",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // valid time : 1 day。
      data: id
    },
    config.secret
  );

//Get current time and transfer the format to YYYY-MM-DD HH:MM:SS
const onTime = () => {
  const date = new Date();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  const hh = date.getHours();
  const mi = date.getMinutes();
  const ss = date.getSeconds();

  return [
    date.getFullYear(),
    "-" + (mm > 9 ? "" : "0") + mm,
    "-" + (dd > 9 ? "" : "0") + dd,
    " " + (hh > 9 ? "" : "0") + hh,
    ":" + (mi > 9 ? "" : "0") + mi,
    ":" + (ss > 9 ? "" : "0") + ss
  ].join("");
};
