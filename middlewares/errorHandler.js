const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Recurso no encontrado o identificador no válido: '${err.value}'`;
  }

  if (err.code === 11000) {
    statusCode = 409;
    const duplicatedField = Object.keys(err.keyValue || {})[0] || 'campo';
    message = `El valor ingresado para '${duplicatedField}' ya se encuentra registrado`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((item) => item.message);
    message = errors.join('. ');
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'El cuerpo de la petición contiene un formato JSON no válido';
  }

  return res.status(statusCode).json({
    success: false,
    data: null,
    message
  });
};

module.exports = errorHandler;
