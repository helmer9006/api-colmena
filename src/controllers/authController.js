import { User } from "../models/User.js";
import expressValidator from "express-validator";

const { validationResult } = expressValidator;
import bcrypt from "bcrypt";
import { getToken } from "../config/jwt.config.js";
import { Op } from "sequelize";

// method of autentication
export const authenticateUser = async (req, res, next) => {
  try {
    // validate errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    // find reg user
    const { identification, password } = req.body;

    let userFound = await User.findOne({
      where: {
        [Op.or]: [{ identification }],
      },
    });
    if (!userFound) {
      return res.status(401).json({
        status: false,
        response: userFound,
        msg: "User not found",
      });
    }

    if (userFound.active == false) {
      return res.status(401).json({
        status: false,
        response: userFound,
        msg: "The user has not confirmed the registration",
      });
    }

    // check password
    const decodedPassword = new Buffer(password, "base64").toString();
    if (!bcrypt.compareSync(decodedPassword, userFound.password)) {
      res.status(401).json({
        status: false,
        response: null,
        msg: "Identification or password incorrect",
      });
      return next();
    }
    // create JWT
    const token = getToken({
      id: userFound.id,
      name: userFound.name,
      codeActivation: userFound.codeActivation,
      rol: userFound.rol,
      identification: userFound.identification,
      active: userFound.active,
      email: userFound.email,
      specialtyId: userFound.specialtyId,
    });
    userFound.dataValues.token = token;
    if (userFound.firstAccess == false) {
      await userFound.update({ firstAccess: true });
    }

    res.json({
      status: true,
      token: token,
      msg: "Authenticated successfully.",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, response: {}, msg: "Error at authenticate" });
  }
};
