import { Router } from "express";
import authenticateUser from "../middleware/auth.middleware.js";
import { verifyApiKey, verifyExistingKey } from "../controllers/verifyBinanceKey.controller.js";
import { fetchBinanceData } from "../controllers/binanceApi.controller.js";

const router = Router();

/**
 * @swagger
 * /api/binanceApi/check-api-key/{userId}:
 *   get:
 *     summary: Check if API key exists for a user
 *     description: Checks if there is an existing API key associated with the specified user ID.
 *     tags:
 *       - BinanceApi
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to check for existing API key
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully checked API key existence
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   example: true
 *                   description: Indicates if API key exists for the user
 *       '404':
 *         description: API key not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   example: false
 *                   description: Indicates no API key exists for the user
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/check-api-key/:userId', authenticateUser, verifyExistingKey);

/**
 * @swagger
 * /validate-binance-key:
 *   post:
 *     summary: Validate and save Binance API keys for a user
 *     description: Validates and securely saves the provided Binance API keys (public and private) for the authenticated user.
 *     tags:
 *       - BinanceApi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               publicKey:
 *                 type: string
 *               privateKey:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: API keys saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: API keys saved successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *       '400':
 *         description: Missing public key or private key
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Public key and private key are required
 *       '401':
 *         description: User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not authenticated
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/validate-binance-key', authenticateUser, verifyApiKey)

/**
 * @swagger
 * /fetch-binance-data:
 *   get:
 *     summary: Fetch Binance account data
 *     description: Retrieves and returns the user's Binance account balances and total USD value.
 *     tags:
 *       - BinanceApi
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved Binance account data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balances:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: integer
 *                         example: 123
 *                       asset:
 *                         type: string
 *                         example: BTC
 *                       free:
 *                         type: number
 *                         example: 0.1
 *                       locked:
 *                         type: number
 *                         example: 0
 *                       valueInUSD:
 *                         type: number
 *                         example: 5000
 *                 totalUSD:
 *                   type: number
 *                   example: 10000
 *       '401':
 *         description: User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not authenticated
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error fetching or updating Binance data
 */
router.get('/fetch-binance-data', authenticateUser, fetchBinanceData);

export default router;
