import router from "./src/auth.route.js";
import passport from "./src/passport.js";
import authenticate from "./src/auth.middleware.js";
import * as jwt from "./services/jwt.service.js";
import * as password from "./services/password.service.js";
import * as cookie from "./services/cookie.service.js";

const services = {
  jwt,
  password,
  cookie,
};

export {
  router,
  passport,
  authenticate,
  services,
};

export default {
  router,
  passport,
  authenticate,
  services,
};
