const express = require("express");
const router = express.Router();

// import express-validatos
const { body } = require("express-validator/check");

// Import controller
const proyectosController = require("../controllers/proyectosController");
const tareasController = require("../controllers/tareasController");
const usuariosController = require("../controllers/usuariosController");
const authController = require("../controllers/authController");

// this is like export default class ...
module.exports = function () {
  // route for home
  router.get(
    "/",
    authController.usuarioAutenticado,
    proyectosController.proyectosHome
  );
  router.get(
    "/nuevo-proyecto",
    authController.usuarioAutenticado,
    proyectosController.formularioProyecto
  );
  router.post(
    "/nuevo-proyecto",
    body("nombre").not().isEmpty().trim().escape(),
    proyectosController.nuevoProyecto
  );

  // List projects
  router.get(
    "/proyecto/:url",
    authController.usuarioAutenticado,
    proyectosController.proyectoPorUrl
  );

  // update proyect
  router.get(
    "/proyecto/editar/:id",
    authController.usuarioAutenticado,
    proyectosController.formularioEditar
  );

  router.post(
    "/nuevo-proyecto/:id",
    body("nombre").not().isEmpty().trim().escape(),
    authController.usuarioAutenticado,
    proyectosController.actualizarProyecto
  );

  // delete project
  router.delete(
    "/proyectos/:url",
    authController.usuarioAutenticado,
    proyectosController.eliminarProyecto
  );

  // Tasks
  router.post(
    "/proyecto/:url",
    authController.usuarioAutenticado,
    tareasController.agregarTarea
  );

  // update task
  router.patch(
    "/tareas/:id",
    authController.usuarioAutenticado,
    tareasController.cambiarEstadoTarea
  );
  // delete task
  router.delete(
    "/tareas/:id",
    authController.usuarioAutenticado,
    tareasController.eliminarTarea
  );
  // Create account
  router.get("/crear-cuenta", usuariosController.formCrearCuenta);
  router.post("/crear-cuenta", usuariosController.crearCuenta);
  router.get("/confirmar/:correo", usuariosController.confirmarCuenta);

  // LogIn
  router.get("/iniciar-sesion", usuariosController.formIniciarSesion);
  router.post("/iniciar-sesion", authController.autenticarUsuario);

  // logout
  router.get("/cerrar-sesion", authController.cerrarSesion);

  // restore password
  router.get("/reestablecer", usuariosController.formRestablecerPassword);
  router.post("/reestablecer", authController.enviarToken);
  router.get("/reestablecer/:token", authController.validarToken);
  router.post("/reestablecer/:token", authController.actualizarPassword);

  return router;
};
