import initApiKeyModel from '../models/apikey.model.js';
import { sequelize } from '../models/index.js';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config(); 

export const verifyExistingKey = async (req, res) => {
    const { userId } = req.params;
    const ApiKey = initApiKeyModel(sequelize);

    try {
        const apiKey = await ApiKey.findOne({ where: { user_id: userId } });
        if (apiKey) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(404).json({ exists: false });
        }
    } catch (error) {
        console.error('Error checking API key:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


function encrypt(value) {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');

    if (!key || !iv) {
        throw new Error('Encryption key and IV must be defined in environment variables');
    }

    if (iv.length !== 16) {
        throw new Error('IV length must be 16 bytes for AES-256-CBC');
    }

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export const verifyApiKey = async (req, res) => {
    const ApiKey = initApiKeyModel(sequelize);
    const { publicKey, privateKey } = req.body;

    if (!publicKey || !privateKey) {
        return res.status(400).json({ error: 'Public key and private key are required' });
    }

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        const encryptedPublicKey = encrypt(publicKey);
        const encryptedPrivateKey = encrypt(privateKey);

        console.log('Encrypted Public Key:', encryptedPublicKey);
        console.log('Encrypted Private Key:', encryptedPrivateKey);

        const apiKey = await ApiKey.create({
            user_id: req.user.id,
            api_key: encryptedPublicKey,
            secret_key: encryptedPrivateKey,
        });

        return res.status(200).json({ message: 'API keys saved successfully', success: true });
    } catch (error) {
        console.error('Error saving API keys:', error);
        return res.status(500).json({ error: 'Internal server error', success: false });
    }
}