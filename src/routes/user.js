import express from "express";
import expressValidator from "express-validator";
import { Constants } from "../constants/constants.js";
import {
  getAllUsers,
  create,
  activate,
  changePassword,
  getUserById,
  updateUser,
  deleteUserById,
  getUserByName,
} from "../controllers/UserController.js";
import { auth } from "./../middleware/auth.js";
const { check } = expressValidator;
const { Router } = express;
const router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Users:
 *      type: object
 *      items:
 *      properties:
 *        name:
 *          type: string
 *          description: user name
 *        password:
 *          type: string
 *          description: user password
 *        address:
 *          type: string
 *          description: user address
 *        birthdate:
 *          type: date
 *          description: user birthdate
 *        identification:
 *          type: string
 *          description: user identification
 *        phone:
 *          type: string
 *          description: user phone
 *        email:
 *          type: string
 *          description: user email
 *        rol:
 *          type: string
 *          description: user rol
 *      required:
 *        - name
 *        - identification
 *        - phone
 *        - password
 *        - email
 *        - rol
 *      example:
 *        name: 'Helmer Villarreal Larios'
 *        password: '16/04/2023'
 *        address: "calle 100 # 20-34 barranca"
 *        birthdate: "08/06/1990"
 *        identification: "1051635342"
 *        phone: "3013555186"
 *        email: "helmervillarreal@gmail.com"
 *        rol: "admin"
 *
 *
 *    Response200CreateUser:
 *      type: object
 *      properties:
 *        status:
 *          type:
 *          description: status respose
 *          example: true
 *        response:
 *          $ref: '#/components/schemas/ObjectUser'
 *          description: Objects with properties of user
 *        msg:
 *          type: string
 *          description: "Message of response"
 *          example: "User created successfully"
 *
 *    Response400CreateUser:
 *      type: object
 *      properties:
 *        status:
 *          type:
 *          description: status respose
 *          example: false
 *        response:
 *          $ref: '#/components/schemas/ArrayObjectErrorValidateUser'
 *          description: Objects with properties of user
 *        msg:
 *          type: string
 *          description: "Message of response"
 *          example: "Error in data input"
 *
 *    ArrayObjectUser:
 *      type: array
 *      items:
 *        type: object
 *        $ref: '#/components/schemas/ObjectUser'
 *
 *
 *    ObjectUser:
 *      type: object
 *      items:
 *      properties:
 *        id:
 *          type: number
 *          example: 2
 *        name:
 *          type: string
 *          example: "Helmer Villarreal Larios"
 *        address:
 *          type: string
 *          example: "calle 100 # 20-34 barranca"
 *        birthdate:
 *          type: string
 *          example: "1990-08-06T05:00:00.000Z"
 *        identification:
 *          type: string
 *          example: "1051635340"
 *        phone:
 *          type: string
 *          example: "3013555186"
 *        email:
 *          type: string
 *          example: "helmervillarreal@gmail.com"
 *        rol:
 *          type: string
 *          example: "admin"
 *        firstAccess:
 *          type: boolean
 *          example: true
 *        active:
 *          type: boolean
 *          example: true
 *        codeActivation:
 *          type: string
 *          example: "472219"
 *        createdAt:
 *          type: date
 *          example: "2023-04-15T23:30:17.000Z"
 *        updatedAt:
 *          type: date
 *          example: "2023-04-15T23:30:17.000Z"
 *
 *
 *    ArrayObjectErrorValidateUser:
 *      type: array
 *      items:
 *        type: object
 *        properties:
 *          type:
 *            type: string
 *            example: "field"
 *          msg:
 *            type: string
 *            example: "The phone is required"
 *          path:
 *            type: string
 *            example: "phone"
 *          location:
 *            type: string
 *            example: "body"
 *
 *
 *    Response200UpdateUser:
 *      type: object
 *      properties:
 *        status:
 *          type:
 *          description: status respose
 *          example: true
 *        response:
 *          $ref: '#/components/schemas/ObjectUser'
 *          description: Array of objects with properties of user
 *        msg:
 *          type: string
 *          description: "Message of response"
 *          example: "User Update successfully"
 *
 *    Response200GetByIdUser:
 *      type: object
 *      properties:
 *        status:
 *          type:
 *          description: status respose
 *          example: true
 *        response:
 *          $ref: '#/components/schemas/ObjectUser'
 *          description: Array of objects with properties of user
 *        msg:
 *          type: string
 *          description: "Message of response"
 *          example: "User found"
 */
/**
 * @swagger
 * /api/users/create:
 *  post:
 *    summary: Create a user
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Users'
 *    responses:
 *      200:
 *        description: User created successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Response200CreateUser'
 *      400:
 *        description: Error in data input.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Response400CreateUser'
 *      409:
 *        description: User already exists.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: false
 *                response:
 *                  $ref: '#/components/schemas/ObjectUser'
 *                  description: Objects with properties of user
 *                msg:
 *                  type: string
 *                  description: "Message of response"
 *                  example: "User already exists"
 *      500:
 *        description: Error creating user
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: false
 *                response:
 *                  type: object
 *                  items:
 *                    properties:
 *                msg:
 *                  type: string
 *                  description: "Message of response"
 *                  example: "Error creating user"
 */
router.post(
  "/create",
  [
    check("name", "The name is required").not().isEmpty(),
    check("identification", "The identification is required").not().isEmpty(),
    check("phone", "The phone is required").not().isEmpty(),
    check("email", "Add an email valid.").isEmail(),
    check(
      "password",
      "the password cannot be empty and must contain at least 6 characters."
    ).isLength({ min: 6 }),
    check("rol", "The rol user is required")
      .not()
      .isEmpty()
      .custom((value, { req }) => {
        if (
          ![Constants.TYPE_USER.STANDARD, Constants.TYPE_USER.ADMIN].includes(
            value
          )
        ) {
          throw new Error("Error the type user  not is valid");
        }
        return true;
      }),
  ],
  create
);
/**
 * @swagger
 * /api/users/getAll:
 *  get:
 *    summary: Get all users
 *    tags: [Users]
 *    responses:
 *      200:
 *        description: array of 0 or more users.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: true
 *                response:
 *                  $ref: '#/components/schemas/ArrayObjectUser'
 *                  description: Array with objects of users
 *                msg:
 *                  type: string
 *                  description: "Message of response"
 *                  example: "Users found"
 *      403:
 *        description: Error at privileges.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: false
 *                response:
 *                  type: array
 *                  items:
 *                    properties:
 *                msg:
 *                  type: string
 *                  description: "Message of error response"
 *                  example: "Unauthorized access or expired Session."
 *      500:
 *        description: Error get users of server
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: false
 *                response:
 *                  type: array
 *                  items:
 *                    properties:
 *                msg:
 *                  type: string
 *                  description: "Message of error response"
 *                  example: "Error internal server."
 * */
router.get("/getAll", getAllUsers);
/**
 * @swagger
 * /api/users/getById/{userId}:
 *  get:
 *    summary: Get a user by Id
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: integer
 *        required: true
 *        description: Id of the user to get
 *        example: 2
 *    responses:
 *      200:
 *        description: User created successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Response200GetByIdUser'
 *      400:
 *        description: Error, incorrect parameters.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: false
 *                response:
 *                  type: object
 *                  items:
 *                    properties:
 *                msg:
 *                  type: string
 *                  description: "Message of error response"
 *                  example: "Error, parameter id incorrect"
 *      403:
 *        description: Error at privileges.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: false
 *                response:
 *                  type: object
 *                  items:
 *                    properties:
 *                msg:
 *                  type: string
 *                  description: "Message of error response"
 *                  example: "Unauthorized access or expired Session."
 *      404:
 *        description: User not found.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: false
 *                response:
 *                  type: object
 *                  items:
 *                    properties:
 *                msg:
 *                  type: string
 *                  description: "Message of error response"
 *                  example: "User not found"
 *      500:
 *        description: Error get user by id
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: false
 *                response:
 *                  type: object
 *                  items:
 *                    properties:
 *                msg:
 *                  type: string
 *                  description: "Message of error response"
 *                  example: "Error, user not updated"
 * */
router.get("/getById/:userId", auth, getUserById);
router.get("/activate/:token", activate);
/**
 * @swagger
 * /api/users/changePassword:
 *  put:
 *    summary: update a user by Id
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              password:
 *                type: string
 *                description: Password old in format base64
 *                example: "MTIzNDU2Nzg5"
 *                required: true
 *              newPassword:
 *                type: string
 *                description: New password in format base64
 *                example: "MTIzNDU2Nzg5"
 *                required: true
 *    responses:
 *      200:
 *        description: User updated successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Response200UpdateUser'
 *      400:
 *        description: Error, incorrect parameters.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: false
 *                response:
 *                  type: object
 *                  items:
 *                    properties:
 *                msg:
 *                  type: string
 *                  description: "Message of error response"
 *                  example: "Error in data input"
 *      401:
 *        description: Error in password sended.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: false
 *                response:
 *                  type: object
 *                  items:
 *                    properties:
 *                msg:
 *                  type: string
 *                  description: "Message of error response"
 *                  example: "The password sent is wrong"
 *      403:
 *        description: Error at privileges.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: false
 *                response:
 *                  type: object
 *                  items:
 *                    properties:
 *                msg:
 *                  type: string
 *                  description: "Message of error response"
 *                  example: "Error at privileges, the user cannot update users"
 *      404:
 *        description: User not found for update.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: false
 *                response:
 *                  type: object
 *                  items:
 *                    properties:
 *                msg:
 *                  type: string
 *                  description: "Message of error response"
 *                  example: "User not found"
 *      500:
 *        description: Error at change password user
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: false
 *                response:
 *                  type: object
 *                  items:
 *                    properties:
 *                msg:
 *                  type: string
 *                  description: "Message of error response"
 *                  example: "Error internal server."
 */
router.put(
  "/changePassword/",
  [
    check(
      "password",
      "The password cannot be empty and must contain at least 6 characters.."
    ).isLength({ min: 6 }),
    check(
      "newPassword",
      "The new password cannot be empty and must contain at least 6 characters."
    ).isLength({ min: 6 }),
  ],
  auth,
  changePassword
);
/**
 * @swagger
 * /api/users/update/{userId}:
 *  put:
 *    summary: update a user by Id
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: integer
 *        required: true
 *        description: Id of the user to get
 *        example: 2
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Users'
 *    responses:
 *      200:
 *        description: User updated successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Response200UpdateUser'
 *      400:
 *        description: Error, incorrect parameters.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: false
 *                response:
 *                  type: object
 *                  items:
 *                    properties:
 *                msg:
 *                  type: string
 *                  description: "Message of error response"
 *                  example: "Error, parameter id incorrect"
 *      403:
 *        description: Error at privileges.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: false
 *                response:
 *                  type: object
 *                  items:
 *                    properties:
 *                msg:
 *                  type: string
 *                  description: "Message of error response"
 *                  example: "Error at privileges, the user cannot update users"
 *      404:
 *        description: User not found for update.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: false
 *                response:
 *                  type: object
 *                  items:
 *                    properties:
 *                msg:
 *                  type: string
 *                  description: "Message of error response"
 *                  example: "User not found"
 *      500:
 *        description: Error creating user
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: false
 *                response:
 *                  type: object
 *                  items:
 *                    properties:
 *                msg:
 *                  type: string
 *                  description: "Message of error response"
 *                  example: "Error, user not updated"
 */
router.put("/update/:userId", auth, updateUser);
/**
 * @swagger
 * /api/users/deleteById/{userId}:
 *  delete:
 *    summary: Delete a user
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: integer
 *        required: true
 *        description: Id of the user to delete
 *        example: 2
 *    responses:
 *      200:
 *        description: User delete successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Response200UpdateUser'
 *      400:
 *        description: Error, incorrect parameters.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: false
 *                response:
 *                  type: object
 *                  items:
 *                    properties:
 *                msg:
 *                  type: string
 *                  description: "Message of error response"
 *                  example: "Error, parameter id incorrect"
 *      403:
 *        description: Error at privileges.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: false
 *                response:
 *                  type: object
 *                  items:
 *                    properties:
 *                msg:
 *                  type: string
 *                  description: "Message of error response"
 *                  example: "Error at privileges, the user cannot delete users or Unauthorized access or expired Session."
 *      404:
 *        description: User not found for delete.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: false
 *                response:
 *                  type: object
 *                  items:
 *                    properties:
 *                msg:
 *                  type: string
 *                  description: "Message of error response"
 *                  example: "User not found"
 *      500:
 *        description: Error deleting user
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: false
 *                response:
 *                  type: object
 *                  items:
 *                    properties:
 *                msg:
 *                  type: string
 *                  description: "Message of error response"
 *                  example: "Error, user not deleted"
 *
 * */
router.delete("/deleteById/:userId", auth, deleteUserById);
/**
 * @swagger
 * /api/users/getByName/{userName}:
 *  get:
 *    summary: Get a user by Name
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: userName
 *        schema:
 *          type: string
 *        required: true
 *        description: Name of the user to find
 *        example: "helmer"
 *    responses:
 *      200:
 *        description: array of 0 or many users.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: true
 *                response:
 *                  $ref: '#/components/schemas/ArrayObjectUser'
 *                  description: Array with object of users
 *                msg:
 *                  type: string
 *                  description: "Message of response"
 *                  example: "Users found"
 *      400:
 *        description: Error, incorrect parameters.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: false
 *                response:
 *                  type: array
 *                  items:
 *                    properties:
 *                msg:
 *                  type: string
 *                  description: "Message of error response"
 *                  example: "Error, parameter name incorrect"
 *      403:
 *        description: Error at privileges.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: false
 *                response:
 *                  type: array
 *                  items:
 *                    properties:
 *                msg:
 *                  type: string
 *                  description: "Message of error response"
 *                  example: "Unauthorized access or expired Session."
 *      500:
 *        description: Error get user by id
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type:
 *                  description: status respose
 *                  example: false
 *                response:
 *                  type: array
 *                  items:
 *                    properties:
 *                msg:
 *                  type: string
 *                  description: "Message of error response"
 *                  example: "Error, user not updated"
 * */
router.get("/getByName/:userName", auth, getUserByName);
export default router;
