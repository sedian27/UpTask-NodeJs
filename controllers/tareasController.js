const Proyectos = require("../models/Proyectos");
const Tareas = require("../models/Tareas");

exports.agregarTarea = async (req, res, next) => {
  // get a actual project
  const proyecto = await Proyectos.findOne({ where: { url: req.params.url } });

  // read input value
  const { tarea } = req.body;

  // status 0 = incomplete and Id of the project
  const estado = 0;
  const proyectoId = proyecto.id;

  // insert tasks to db
  const resultado = await Tareas.create({ tarea, estado, proyectoId });
  if (!resultado) return next();

  // redirect
  res.redirect(`/proyecto/${req.params.url}`);
};

exports.cambiarEstadoTarea = async (req, res, next) => {
  const { id } = req.params;
  const tarea = await Tareas.findOne({ where: { id } });

  // Change status
  let estado = 0;

  if (tarea.estado === estado) {
    estado = 1;
  }

  tarea.estado = estado;

  const resultado = await tarea.save();

  if (!resultado) return next();

  res.status(200).send("Actualizado.");
};

exports.eliminarTarea = async (req, res, next) => {
  const { id } = req.params;
  // Eliminar la tarea de
  const resultado = await Tareas.destroy({ where: { id } });
  if (!resultado) return next();
  res.status(200).send("Tarea eliminada correctamente!");
};
