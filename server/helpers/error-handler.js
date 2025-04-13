function errorHandler(err, req, res, next) {
  if (err) {
    res.status(500).json({ message: err.message });
    console.log("AN ERROR HAPPENED ^^^^");
  }
}

module.exports = errorHandler;
