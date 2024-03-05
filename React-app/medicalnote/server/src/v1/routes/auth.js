const router = require("express").Router();
const { body, validationResult } = require('express-validator');
const validation = require("../handlers/validation");
const userController = require("../controllers/user");
const User = require("../models/user");
const tokenHandler = require("../handlers/tokenHandler")

// ユーザー新規登録API
router.post(
  "/register",
  body("username")
    .isLength({ min: 8 })
    .withMessage("ユーザー名は８文字以上で入力してください"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("パスワードは8文字以上で入力してください"),
  body("confirmpassword")
    .isLength({ min: 8 })
    .withMessage("確認用パスワードは8文字以上で入力してください"),
  body('username').custom((value) => {
    return User.findOne({ username: value }).then((user) => {
      if (user) {
        return Promise.reject("このユーザー名はすでに使われています")
      }
    });
  }),
  validation.validate,
  userController.register
);

router.post(
  "/login",
  body("username")
    .isLength({ min: 8 })
    .withMessage("ユーザー名は８文字以上で入力してください"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("パスワードは8文字以上で入力してください"),
  validation.validate,
  userController.login
);

router.post("/verify-token",tokenHandler.verifyToken, (req, res) => {
  return res.status(200).json({ user: req.user });
});


module.exports = router;
