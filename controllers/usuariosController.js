const Usuarios = require("../models/Usuarios");
const enviarEmail = require("../handlers/email");

exports.formCrearCuenta = (req, res) => {
  res.render("crearCuenta", {
    nombrePagina: "Crear cuenta en UpTask",
  });
};

exports.formIniciarSesion = (req, res) => {
  const { error } = res.locals.mensajes;
  res.render("iniciarSesion", {
    nombrePagina: "Iniciar sesión  en UpTask",
    error,
  });
};

exports.crearCuenta = async (req, res) => {
  // read data
  const { email, password } = req.body;

  try {
    await Usuarios.create({ email, password });

    // Create confimation url
    const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

    // create user object
    const usuario = {
      email,
    };

    // send mail
    await enviarEmail.enviar({
      usuario,
      subject: "Confirma tu cuenta UpTask",
      confirmarUrl,
      archivo: "confirmar-cuenta",
    });

    // redirect
    req.flash("correcto", "Enviamos un correo, confirma tu cuenta");
    res.redirect("/iniciar-sesion");
  } catch (error) {
    req.flash(
      "error",
      error.errors.map((error) => error.message)
    );
    res.render("crearCuenta", {
      mensajes: req.flash(),
      nombrePagina: "Crear cuenta en UpTask",
      email,
      password,
    });
  }
};

exports.formRestablecerPassword = (req, res) => {
  res.render("reestablecer", {
    nombrePagina: "Restablecer tu contraseña",
  });
};

// change account status
exports.confirmarCuenta = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: { email: req.params.correo },
  });

  if (!usuario) {
    req.flash("error", "No valido (┬┬﹏┬┬) ");
    res.redirect("/crear-cuenta");
  }

  usuario.activo = 1;
  await usuario.save();
  req.flash("correcto", "Cuenta activada correctamente, Bienvenido (/≧▽≦)/");
  res.redirect("/iniciar-sesion");
};
