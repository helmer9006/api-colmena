import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../database/database.js";

export const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    identification: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstAccess: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    codeActivation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);
