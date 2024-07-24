import { Router } from "express";
import { getUser, updateUser } from "../controllers/user.controller.js"
import authenticateUser from '../middleware/auth.middleware.js';

const router = Router();


/**
 * Get user profile information.
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile information
 *     description: Retrieves the profile information of the authenticated user.
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 firstname:
 *                   type: string
 *                 lastname:
 *                   type: string
 *                 email:
 *                   type: string
 *                 api_key:
 *                   type: string
 *                 secret_key:
 *                   type: string
 *       '401':
 *         description: Unauthorized - Invalid or expired token
 *       '500':
 *         description: Internal server error
 *     securitySchemes:
 *       BearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */
router.get('/profile', authenticateUser, getUser)

/**
 * @swagger
 * /api/user/update/{userId}:
 *   put:
 *     summary: Update user information
 *     description: Update user details and API keys.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               publicKey:
 *                 type: string
 *               secretKey:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 */
router.put('/update/:userId', authenticateUser, updateUser)

export default router;
