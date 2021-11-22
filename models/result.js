"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Result extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Result.init(
    {
      dob: { type: DataTypes.DATE, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      score: { type: DataTypes.FLOAT, allowNull: false },
      rollno: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    },
    {
      sequelize,
      modelName: "Result",
    }
  );
  return Result;
};
