const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// Reference to Model where need authenticate
const Usuarios = require("../models/Usuarios");

// Local strategy - Login with your own credentials
passport.use(
  new LocalStrategy(
    // default passport wait user and password
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const usuario = await Usuarios.findOne({
          where: { email, activo: 1 },
        });
        // User exist but password is incorrect
        if (!usuario.verificarPassword(password)) {
          return done(null, false, {
            message: "Password incorrecto",
          });
        }
        // Email exist and password is correct
        return done(null, usuario);
      } catch (error) {
        // User don't exist
        return done(null, false, {
          message: "Esa cuenta no existe",
        });
      }
    }
  )
);

// serialize user
passport.serializeUser((usuario, callback) => {
  callback(null, usuario);
});

// deserialize user
passport.deserializeUser((usuario, callback) => {
  callback(null, usuario);
});

// export
module.exports = passport;
