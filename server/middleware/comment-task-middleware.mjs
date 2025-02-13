import models from "../models/index.mjs";

export default (resourceIdKey, rights) => {
  return async (req, res, next) => {
    const permission = await models.Permission.findOne({
      where: {
        forResource: req.params[resourceIdKey],
        forUser: req.params.uid,
      },
    });

    const task = await models.Task.findOne({
      where: {
        id: req.params.tid,
        assignedToId: req.params.uid,
      },
    });
    if (
      permission &&
      rights.every((right) => permission.rights.includes(right))
    ) {
      next();
    } else if (task) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  };
};
