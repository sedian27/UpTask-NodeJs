const Proyectos = require("../models/Proyectos");
const Tareas = require("../models/Tareas");
// this is like a exports const todoHome =  () => {}
// u can exports any functions
exports.proyectosHome = async (request, response) => {
  // console.log(response.locals.usuario);

  const usuarioId = response.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: { usuarioId } });

  response.render("index", {
    nombrePagina: "Proyectos",
    proyectos,
  });
};

exports.formularioProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: { usuarioId } });

  res.render("nuevoProyecto", {
    nombrePagina: "Nuevo Proyecto",
    proyectos,
  });
};

exports.nuevoProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: { usuarioId } });

  // Send to the console what the user types.
  // console.log(req.body);

  // validate that we have somthing in the input
  const { nombre } = req.body;

  let errores = [];

  if (!nombre) {
    errores.push({ texto: "Agrega un Nombre al Proyecto" });
  }
  // if mistakes
  if (errores.length > 0) {
    res.render("nuevoProyecto", {
      nombrePagina: "Nuevo Proyecto",
      errores,
      proyectos,
    });
  } else {
    // no mistakes
    // insert in to bd
    const usuarioId = res.locals.usuario.id;
    await Proyectos.create({ nombre, usuarioId });
    res.redirect("/");
  }
};

exports.proyectoPorUrl = async (req, res, next) => {
  const usuarioId = res.locals.usuario.id;
  const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });
  const proyectoPromise = Proyectos.findOne({
    where: {
      url: req.params.url,
      usuarioId,
    },
  });

  const [proyectos, proyecto] = await Promise.all([
    proyectosPromise,
    proyectoPromise,
  ]);

  // check current project tasks
  const tareas = await Tareas.findAll({
    where: { proyectoId: proyecto.id },
    // include: { model: Proyectos }, // This is like a inner join
  });
  // console.log(tareas);

  if (!proyecto) return next();

  // render to view
  res.render("tareas", {
    nombrePagina: "Tareas del Proyecto",
    proyecto,
    proyectos,
    tareas,
  });
};

exports.formularioEditar = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });
  const proyectoPromise = Proyectos.findOne({
    where: {
      id: req.params.id,
    },
  });

  const [proyectos, proyecto] = await Promise.all([
    proyectosPromise,
    proyectoPromise,
  ]);

  // render to view
  res.render("nuevoProyecto", {
    nombrePagina: "Editar Proyecto",
    proyectos,
    proyecto,
  });
};

exports.actualizarProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: { usuarioId } });

  // Send to the console what the user types.
  // console.log(req.body);

  // validate that we have somthing in the input
  const { nombre } = req.body;

  let errores = [];

  if (!nombre) {
    errores.push({ texto: "Agrega un Nombre al Proyecto" });
  }
  // if mistakes
  if (errores.length > 0) {
    res.render("nuevoProyecto", {
      nombrePagina: "Nuevo Proyecto",
      errores,
      proyectos,
    });
  } else {
    // no mistakes
    // insert in to bd
    await Proyectos.update(
      { nombre: nombre },
      { where: { id: req.params.id } }
    );
    res.redirect("/");
  }
};

exports.eliminarProyecto = async (req, res, next) => {
  // req, query or params
  // console.log(req.query);
  const { urlProyecto } = req.query;
  const resultado = await Proyectos.destroy({ where: { url: urlProyecto } });
  if (!resultado) return next();
  res.status(200).send("Proyecto eliminado correctamente.");
};
