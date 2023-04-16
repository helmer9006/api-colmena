import { Router } from "express";
import { check } from "express-validator";
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

const router = Router();

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
router.get("/getAll", auth, getAllUsers);
router.get("/getById/:userId", auth, getUserById);
router.get("/activate/:token", activate); // user activate register
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
router.put("/update/:userId", auth, updateUser);
router.delete("/deleteById/:userId", auth, deleteUserById);
router.get("/getByName/:userName", auth, getUserByName);
export default router;
