const JWT = require("jsonwebtoken");
const User = require("../models/user");

// クライアントから渡されたJWTが正常　
const tokenDecode = (req) => {
  const beareHeader = req.headers["authorization"];
  if (beareHeader) {
     const bearer = beareHeader.split(" ")[1];
    try {
      const decodedToken = JWT.verify(bearer, process.env.TOKEN_SECRET_KEY);
      return decodedToken;
    } catch {
      return false;
    }
  } else {
    return false;
  }
};



// JWT認証を検証するためのミドルウェア
exports.verifyToken = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req);
  if (tokenDecoded) {
    const user = await User.findById(tokenDecoded.id);
    if (!user) {
      return res.status(401).json("権限がありません");
    }
    req.user = user;
    next();
  } else {
    return res.status(401).json("権限がありません");
  }
};
