const passport = require("passport");
const Usuarios = require("../models/Usuarios");
const crypto = require("crypto");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt-nodejs");
const Op = Sequelize.Op;
const enviarEmail = require("../handlers/email");

exports.autenticarUsuario = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/iniciar-sesion",
  failureFlash: true,
  badRequestMessage: "Ambos campos son obligatorios!",
});

// function check if user is authenticated
exports.usuarioAutenticado = (req, res, next) => {
  // if user is authenticated, next
  if (req.isAuthenticated()) {
    return next();
  }
  // else redirect to form
  return res.redirect("/iniciar-sesion");
};

// function logout
exports.cerrarSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/iniciar-sesion");
  });
};

// generate token if user is valid
exports.enviarToken = async (req, res) => {
  // verificar que el usuario exista
  const { email } = req.body;
  const usuario = await Usuarios.findOne({ where: { email } });

  if (!usuario) {
    req.flash("error", "No existe esa cuenta");
    res.render("/reestablecer");
  }

  // user exists
  usuario.token = crypto.randomBytes(20).toString("hex");
  usuario.expiracion = Date.now() + 3600000;

  // save to db
  await usuario.save();
  // reset url
  const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
  // Send email with token
  await enviarEmail.enviar({
    usuario,
    subject: "Password Reset",
    resetUrl,
    archivo: "reestablecer-password",
  });

  // end execute
  req.flash("correcto", "Se envio un mensaje a tu correo");
  res.redirect("/iniciar-sesion");
};

exports.validarToken = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: { token: req.params.token },
  });

  if (!usuario) {
    req.flash("error", "No válido");
    res.redirect("/reestablecer");
  }

  // Form to gen password
  res.render("resetPassword", {
    nombrePagina: "Reestablecer Contraseña",
  });
};

// new password
exports.actualizarPassword = async (req, res) => {
  // Verify valid token and expiration date
  const usuario = await Usuarios.findOne({
    where: { token: req.params.token, expiracion: { [Op.gte]: Date.now() } },
  });

  if (!usuario) {
    req.flash("error", "No válido");
    res.redirect("/reestablecer");
  }

  // hash password
  usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  usuario.token = null;
  usuario.expiracion = null;

  // Save new password
  await usuario.save();
  req.flash("correcto", "Tu passowrd se ha modificado correctamente");
  res.redirect("/iniciar-sesion");
};
