import express from "express";
import expressValidator from "express-validator";
import { authenticateUser } from "../controllers/authController.js";
const { check } = expressValidator;
const { Router } = express;
const router = Router();

//SCHEMAS
/**
 * @swagger
 * components:
 *  schemas:
 *    Auth:
 *      type: object
 *      properties:
 *        identification:
 *          type: number
 *          description: Number identification
 *        password:
 *          type: string
 *          description: Password user in base64
 *      required:
 *        - identification
 *        - password
 *      example:
 *        identification: '1051635340'
 *        password: 'MTIzNDU2Nzg5'
 */

/**
 * @swagger
 * /api/auth:
 *  post:
 *    summary: Auth - Login User
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Auth'
 *    responses:
 *      200:
 *        description: Authenticated successfully..
 *      400:
 *        description: The field is required or the password cannot be empty and must contain at least 6 characters.
 *      500:
 *        description: Error at authenticate
 *
 */
router.post(
  "/",
  [
    check("identification", "The identification is required.").not().isEmpty(),
    check(
      "password",
      "the password cannot be empty and must contain at least 6 characters."
    )
      .not()
      .isEmpty(),
  ],
  authenticateUser
);
export default router;
