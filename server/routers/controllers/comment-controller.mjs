import models from "../../models/index.mjs";

const getAllTaskComments = async (req, res, next) => {
  try {
    const taskComments = await models.Comment.findAll({
      where: {
        taskId: req.params.tid,
      },
      include: [
        {
          model: models.User,
          attributes: ["email"],
          required: true,
        },
      ],
      order: [["createdAt", "ASC"]],
    });
    res.status(200).json(taskComments);
  } catch (err) {
    next(err);
  }
};

const createTaskComment = async (req, res, next) => {
  try {
    const taskComment = await models.Comment.create({
      content: req.body.content,
      taskId: req.params.tid,
      userId: req.params.uid,
    });
    res.status(201).json(taskComment);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllTaskComments,
  createTaskComment,
};
