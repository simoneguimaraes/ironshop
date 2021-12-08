module.exports = (req, res, next) => {
  if (req.currentUser.role === "admin") {
    return next();
  } else {
    return res
      .status(401)
      .json({ msg: "You do not have permission to do this." });
  }
};
