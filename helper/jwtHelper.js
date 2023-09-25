const JWT = require("jsonwebtoken");

const jwtSettings = require("../constants/jwtSetting");

const generateToken = (user) => {
  const expiresIn = "24h"; //Token có thời hạn 24h or 30 phút....
  // const algorithm = "HS25s6";

  return JWT.sign(
    // sign tạo ra token
    {
      iat: Math.floor(Date.now() / 1000),
      ...user,
      // algorithm,
      // email: user.email,
      // name: user.firstName,
    },
    jwtSettings.SECRET,
    // "ADB57C459465E3ED43C6C6231E3C9",
    {
      expiresIn,
    }
  );
};

const generateRefreshToken = (id) => {
  const expiresIn = "30d";

  return JWT.sign({ id }, jwtSettings.SECRET, { expiresIn });
};

module.exports = {
  generateToken,
  generateRefreshToken,
};
