const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Joi = require("joi");

const schemaLogin = Joi.object({
  username: Joi.string(),
  password: Joi.string().required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "pl"] } })
    .required(),
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter"),
  token: Joi.string().default(null),
});

const register = async (req, res, next) => {
  const body = schemaLogin.validate(req.body);
  const { username, email, password } = req.body;

  if (body.error) {
    return res.status(400).json({ error: body.error.details[0].message });
  }

  const existingUser = await User.findOne({ email }).lean();
  if (existingUser) {
    return res.status(409).json({
      status: "409 Conflict",
      code: 409,
      message: "Email in use",
      data: "Conflict",
    });
  }

  try {
    const newUser = new User({ username, email });
    await newUser.setPassword(password);
    await newUser.save();

    return res.status(201).json({
      status: "201 Created",
      code: 201,
      message: "Registration successfull",
      user: { email: newUser.email },
    });
  } catch (error) {
    console.error(`Error during registration: ${error.message}`);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const body = schemaLogin.validate(req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (body.error) {
      return res.status(400).json({ error: body.error.details[0].message });
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isPasswordCorrect = await user.validatePassword(password);

    if (isPasswordCorrect) {
      const payload = { id: user._id };
      const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "12h" });
      const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
        expiresIn: "30d",
      });

      await user.setToken(token);
      await user.save();

      return res.status(201).json({
        status: "200 OK",
        code: 200,
        message: "Log in successfull",
        token,
        refreshToken,
        user: {
          email: user.email,
          _id: user._id,
        },
      });
    } else {
      return res.status(401).json({
        status: "401 Unauthorized",
        code: 401,
        message: "Email or password is wrong",
      });
    }
  } catch (error) {
    next(error);
  }
};

const refresh = (req, res) => {
  const refreshToken = req.headers.authorization;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required" });
  }

  const splitToken = refreshToken.split(" ")[1];

  jwt.verify(
    splitToken,
    process.env.REFRESH_SECRET,
    async (err, decodedToken) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refesh" });
      }

      const user = await User.findOne({ _id: decodedToken.id });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const payload = {
        id: user._id,
      };

      const accessToken = jwt.sign(payload, process.env.SECRET, {
        expiresIn: "12h",
      });

      const newRefreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
        expiresIn: "30d",
      });

      return res.json({
        token: accessToken,
        refreshToken: newRefreshToken,
      });
    }
  );
};

const logout = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    user.token = null;
    await user.save();
    return res.status(200).json({
      status: "204 No Content - User is log out",
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    next(error);
  }
};

module.exports = { register, login, refresh, logout };
