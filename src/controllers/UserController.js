import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { Op, where } from "sequelize";
import { Constants } from "../constants/constants.js";
import fs from "fs";
import { getToken, getTokenData } from "../config/jwt.config.js";
import { sendMail } from "../config/mail.config.js";

export const create = async (req, res) => {
  debugger;
  console.log("POST - CREATE USER");
  try {
    // throw console.error( 'Error!' );
    //validate error
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({
        status: false,
        response: errores.array(),
        msg: "Error in data input",
      });
    }
    const {
      name,
      password,
      address,
      services,
      birthdate,
      identification,
      phone,
      email,
      rol,
    } = req.body;
    // check if user is already registered
    let userReg = await User.findOne({
      where: { identification },
    });
    if (userReg) {
      return res.status(409).json({
        status: false,
        response: userReg,
        msg: "User already exists",
      });
    }

    // Hashear pass
    const decodedPassword = new Buffer(password, "base64").toString();
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(decodedPassword, salt);

    const userCreated = await User.create({
      name: req.body.name,
      password: req.body.password,
      address: req.body.address || null,
      birthdate: req.body.birthdate || null,
      identification: req.body.identification,
      phone: req.body.phone,
      email: req.body.email,
      rol: req.body.rol,
      codeActivation: Math.floor(Math.random() * 1000000 + 1),
    });
    if (!userCreated) {
      return res.status(500).json({
        status: false,
        response: {},
        msg: "could not create user",
      });
    }
    // create token
    const token = getToken({
      id: userCreated.id,
      name: userCreated.name,
      codeActivation: userCreated.codeActivation,
      rol: userCreated.rol,
      identification: userCreated.identification,
      active: userCreated.active,
      email: userCreated.email,
    });
    // enviar email con código
    fs.readFile(
      "./src/templates/register-user.html",
      async function (err, data) {
        if (err) throw err;
        const asunto = "Confirmación de nuevo usuario";
        let body = data.toString();
        const url = `http://${Constants.URL_SERVER}/api/users/activate/${token}`;
        body = body.replace("<URL_REDIRECCION>", url);
        body = body.replace("@NAME", userCreated.name);
        const rest = await sendMail(userCreated.email, asunto, body);
      }
    );

    res.json({
      status: true,
      response: userCreated,
      msg: "User create successfull.",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, response: {}, msg: "Error creating user" });
  }
};

export const getUserById = async (req, res) => {
  console.log("GET - USER BY ID");
  try {
    //validar params userId
    const { userId } = req.params;
    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        status: false,
        response: {},
        msg: "Error, incorrect parameters",
      });
    }

    const user = await User.findOne({
      where: { id: userId },
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: false, response: {}, msg: "User not found" });
    }
    res.json({ status: true, response: user, msg: "User found" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, response: {}, msg: "Error internal server." });
  }
};

export const getAllUsers = async (req, res) => {
  console.log("GET - ALL USERS");
  try {
    const users = await User.findAll();
    res.json({ status: true, response: users, msg: "Users found" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, response: [], msg: "Error internal server." });
  }
};

export const activate = async (req, res) => {
  try {
    debugger;
    console.log("GET - ACTIVATE USER");
    const { token } = req.params;
    const dataUser = await getTokenData(token);
    if (!dataUser) {
      return res.json({
        status: false,
        response: null,
        msg: "Err of data user",
      });
    }
    const user = await User.findOne({
      where: { identification: dataUser.user.identification },
      attributes: ["id", "codeActivation"],
    });
    if (!user) {
      return res.json({
        status: false,
        response: null,
        msg: "Err user not found",
      });
    }
    const { codeActivation } = dataUser.user;
    if (codeActivation !== Number(user.codeActivation)) {
      return res.redirect("/public/error.html");
    }

    const update = await user.update({ active: true });
    if (!update) {
      return res.json({
        status: false,
        response: null,
        msg: "error confirming user",
      });
    }
    return res.redirect("/public/activate.html");
  } catch (error) {
    console.log("Err activating account", error);
  }
};

export const changePassword = async (req, res) => {
  try {
    debugger;
    console.log("PUT - CHANGE PASSWORD");
    //validate error
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({
        status: false,
        response: errores.array(),
        msg: "Error in data input",
      });
    }
    const { password, newPassword } = req.body;
    console.log("user auth req.user", req.user);
    const { id } = req.user;
    const userFound = await User.findOne({
      where: { id },
      // attributes: ["id", "password"],
    });
    if (!userFound) {
      return res.status(404).json({
        status: false,
        response: {},
        msg: "user not found.",
      });
    }
    const decodedPassword = new Buffer(password, "base64").toString();
    const decodedNewPassword = new Buffer(newPassword, "base64").toString();
    if (!bcrypt.compareSync(decodedPassword, userFound.password)) {
      return res.status(401).json({
        status: false,
        response: {},
        msg: "The password sent is wrong",
      });
    }
    // Hashear password
    const salt = await bcrypt.genSalt(10);
    let passNew = await bcrypt.hash(decodedNewPassword, salt);
    const updatedPass = await userFound.update({ password: passNew });
    if (!updatedPass) {
      return res.status(404).json({
        status: false,
        response: {},
        msg: "user not updated.",
      });
    }
    if (updatedPass.firstAccess == false) {
      await userFound.update({ firstAccess: true });
    }
    res.status(200).json({
      status: true,
      response: userFound,
      msg: "User Update successfully.",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, response: [], msg: "Error internal server." });
  }
};

export const updateUser = async (req, res) => {
  console.log("PUT - UPDATE USER");
  try {
    // data user auth
    const { rol, name } = req.user;

    //validar params userId
    const { userId } = req.params;
    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        status: false,
        response: {},
        msg: "Error, parameter id incorrect",
      });
    }

    //validate rol
    if (rol !== Constants.TYPE_USER.ADMIN) {
      return res.status(403).json({
        status: false,
        response: {},
        msg: `Error at privileges, the user ${name} cannot update users`,
      });
    }

    const foundUser = await User.findOne({ where: { id: userId } });
    if (!foundUser) {
      return res.status(404).json({
        status: false,
        response: {},
        msg: "User not found",
      });
    }
    const { password, ...body } = req.body;
    const updateUser = await foundUser.update(body);
    if (!updateUser) {
      return res.json({
        status: false,
        response: {},
        msg: "Error, user not updated",
      });
    }

    res.json({
      status: true,
      response: updateUser,
      msg: "User updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      response: {},
      msg: "Error, user not updated",
    });
  }
};

export const deleteUserById = async (req, res) => {
  console.log("DELETE - USER BY ID");
  try {
    debugger;
    //validar params userId
    const { userId } = req.params;
    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        status: false,
        response: {},
        msg: "Error, incorrect parameters",
      });
    }

    //validate rol
    if (req.user.rol !== Constants.TYPE_USER.ADMIN) {
      return res.status(403).json({
        status: false,
        response: {},
        msg: `Error at privileges, the user ${req.user.name} cannot delete users`,
      });
    }

    const userFound = await User.findOne({
      where: { id: userId },
    });
    if (!userFound) {
      return res.status(400).json({
        status: false,
        response: {},
        msg: "Could not delete user, not found",
      });
    }
    const userDelete = await User.destroy({ where: { id: userId } });
    if (!userDelete) {
      return res.status(500).json({
        status: true,
        response: {},
        msg: "Could not delete user",
      });
    }
    res.json({
      status: true,
      response: userFound,
      msg: "User delete successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, response: {}, msg: "Error internal server." });
  }
};

export const getUserByName = async (req, res) => {
  console.log("GET - USER BY NAME");
  try {
    debugger;
    //validar params userName
    const { userName } = req.params;
    if (!userName || !isNaN(userName)) {
      return res.status(400).json({
        status: false,
        response: {},
        msg: "Error, incorrect parameters",
      });
    }

    const user = await User.findAll({
      where: {
        name: {
          [Op.like]: `%${userName}%`,
        },
      },
      // logging: console.log,
    });
    res.json({ status: true, response: user, msg: "Users found" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, response: [], msg: "Error internal server." });
  }
};
