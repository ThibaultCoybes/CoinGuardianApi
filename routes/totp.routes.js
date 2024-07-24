import { Router } from "express";
import { checkAuthyToken, setupGoogleAuthenticator, verifyTOTP } from "../controllers/totp.controller.js";

const router = Router();

/**
 * @swagger
 * /api/totp/check-authy-token/{userId}:
 *   get:
 *     summary: Check Authy token existence
 *     description: Check if the user has an Authy token associated.
 *     tags: 
 *       - TOTP
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to check Authy token.
 *     responses:
 *       '200':
 *         description: User has an Authy token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   example: true
 *       '401':
 *         description: User does not have an Authy token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   example: false
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error verifying Authy ID
 */
router.get('/check-authy-token/:userId', checkAuthyToken)

/**
 * @swagger
 * /api/totp/setup-google-authenticator:
 *   post:
 *     summary: Setup Google Authenticator
 *     description: Setup Google Authenticator for the user.
 *     tags: 
 *       - TOTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *     responses:
 *       '200':
 *         description: Google Authenticator setup successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Google Authenticator setup
 *                 secret:
 *                   type: string
 *                   example: JBSWY3DPEHPK3PXP
 *                 otpauth_url:
 *                   type: string
 *                   example: otpauth://totp/CoinGuardian%20(johndoe%40example.com)?secret=JBSWY3DPEHPK3PXP
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error setting up Google Authenticator
 */
router.post('/setup-google-authenticator', setupGoogleAuthenticator);

/**
 * @swagger
 * /api/totp/verify-totp:
 *   post:
 *     summary: Verify TOTP (Time-Based One-Time Password)
 *     description: Verify the TOTP code for a user.
 *     tags: 
 *       - TOTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               token:
 *                 type: number
 *                 example: 123456
 *     responses:
 *       '200':
 *         description: TOTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: TOTP verified
 *                 jwtToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5kb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE2Mjg5NTc5NjgsImV4cCI6MTYyODk2MTU2OH0.KWaGw6zT5URZ6dXvNYm5K0sqz6T6zmebQlIXwGk8pMg
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid TOTP
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error verifying TOTP
 */
router.post('/verify-totp', verifyTOTP);

export default router;
