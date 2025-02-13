import models from "../../models/index.mjs";

const getAllTasksForProject = async (req, res, next) => {
  try {
    const query = {
      where: {
        projectId: req.params.pid,
      },
    };

    if (req.query.pageSize && req.query.pageNumber) {
      query.limit = req.query.pageSize;
      query.offset =
        parseInt(req.query.pageSize) * parseInt(req.query.pageNumber);
    }

    const filterQuery = {
      where: {
        projectId: req.params.pid,
      },
    };
    const count = await models.Task.count({
      ...filterQuery,
      include: {
        model: models.Permission,
        where: {
          forUser: req.params.uid,
          type: "task",
        },
        required: false,
      },
    });
    const data = await models.Task.findAll({
      ...query,
      include: [
        {
          model: models.Permission,
          where: {
            forUser: req.params.uid,
            type: "task",
          },
          required: false,
        },
        {
          model: models.User,
          required: false,
          as: "assignedTo",
          attributes: ["id", "email"],
        },
      ],
    });
    res.status(200).json({ data, count });
  } catch (err) {
    next(err);
  }
};

const getOneTaskForProject = async (req, res, next) => {
  try {
    const task = await models.Task.findOne({
      where: {
        id: req.params.tid,
        projectId: req.params.pid,
      },
      include: [
        {
          model: models.Permission,
          where: {
            forUser: req.params.uid,
            type: "task",
          },
          required: false,
        },
        {
          model: models.User,
          required: false,
          as: "assignedTo",
          attributes: ["id", "email"],
        },
      ],
    });
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    next(err);
  }
};

const createOwnedTaskForProject = async (req, res, next) => {
  try {
    const task = await models.Task.create({
      ...req.body,
      projectId: req.params.pid,
    });
    await models.Permission.create({
      forResource: task.id,
      forUser: req.params.uid,
      type: "task",
      rights: ["read", "write"],
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

const updateOwnedTaskForProject = async (req, res, next) => {
  try {
    const task = await models.Task.findOne({
      where: {
        id: req.params.tid,
        projectId: req.params.pid,
      },
    });
    if (task) {
      await task.update(req.body);
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    next(err);
  }
};

const deleteOwnedTaskForProject = async (req, res, next) => {
  try {
    const task = await models.Task.findOne({
      where: {
        id: req.params.tid,
        projectId: req.params.pid,
      },
    });
    const permission = await models.Permission.findOne({
      where: {
        forResource: req.params.tid,
        forUser: req.params.uid,
        type: "task",
      },
    });
    if (task && permission) {
      await permission.destroy();
      await task.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    next(err);
  }
};

const assignTaskToUser = async (req, res, next) => {
  try {
    const task = await models.Task.findOne({
      where: {
        id: req.params.tid,
        projectId: req.params.pid,
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const user = await models.User.findOne({
      where: {
        id: req.body.assignedTo,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await task.update({ assignedToId: req.body.assignedTo });
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

const updateAssignedTaskStatus = async (req, res, next) => {
  try {
    const task = await models.Task.findOne({
      where: {
        id: req.params.tid,
        projectId: req.params.pid,
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.update({ status: req.body.status });
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

export default {
  getAllTasksForProject,
  getOneTaskForProject,
  createOwnedTaskForProject,
  updateOwnedTaskForProject,
  deleteOwnedTaskForProject,
  assignTaskToUser,
  updateAssignedTaskStatus,
};
