const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("ROLE MIDDLEWARE");
    console.log("USER:", req.user);
    console.log("ALLOWED ROLES:", allowedRoles);

    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission",
      });
    }

    console.log("ROLE AUTHORIZED");

    next();
  };
};

module.exports = authorizeRoles;
