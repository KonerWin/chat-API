const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    data: null,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
};

module.exports = notFoundHandler;
