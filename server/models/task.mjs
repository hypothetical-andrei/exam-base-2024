/**
 * Defines the 'task' entity in the database.
 *
 * @param {object} sequelize - The Sequelize instance used to define the model.
 * @param {object} DataTypes - A collection of data types supported by Sequelize.
 * @returns {object} A Sequelize model representing the 'task' entity.
 *
 * @property {string} title - The title of the task. This field is required.
 * @property {string} [description] - A detailed description of the task. This field is optional.
 * @property {string} status - The current status of the task. Defaults to 'open'.
 */
export default (sequelize, DataTypes) => {
  return sequelize.define("task", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "open",
    },
    label: {
      type: DataTypes.ENUM("bug", "feature", "urgent"),
      allowNull: false,
      defaultValue: "bug",
    },
  });
};
