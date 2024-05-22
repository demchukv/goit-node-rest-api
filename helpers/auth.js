import passport from "passport";
import "../controllers/config/config-passport.js";
import jwt from "jsonwebtoken";
import HttpError from "./HttpError.js";

const SECRET = process.env.SECRET;

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err || !jwt.verify(user.token, SECRET)) {
      next(HttpError(401));
    }

    req.user = user;
    next();
  })(req, res, next);
};

export default auth;
