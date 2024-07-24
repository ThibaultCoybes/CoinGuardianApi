import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import initApiKeyModel from '../models/apikey.model.js';
import { sequelize } from '../models/index.js';
import { decrypt } from '../services/crypto.service.js';

/**
 * Middleware to authenticate user using JWT token.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {void}
 * @throws {Error} 401 - No token provided or failed to authenticate token
 * @throws {Error} 404 - User not found
 * @throws {Error} 500 - Internal server error or decryption error
 */

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error(err);
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired', expired: true });
      }
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    try {
      const user = await User.findOne({ where: { email: decoded.email } });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const apiKeyModel = initApiKeyModel(sequelize);
      const userApiKey = await apiKeyModel.findOne({ where: { user_id: user.id } });

      let decryptedApiKey = "";
      let decryptedSecretKey = ""

      if (userApiKey) {
        try {
          decryptedApiKey = decrypt(userApiKey.api_key);
          decryptedSecretKey = decrypt(userApiKey.secret_key);
        } catch (decryptionError) {
          return res.status(500).json(
            { message: 'Error decrypting API key or secret key', error: decryptionError.message }
          );
        }
      }

      req.user = { 
        id: user.id, 
        firstname: user.firstname, 
        lastname: user.lastname,
        email: user.email, 
        api_key: decryptedApiKey, 
        secret_key: decryptedSecretKey 
      };

      next();
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
};

export default authenticateUser;
