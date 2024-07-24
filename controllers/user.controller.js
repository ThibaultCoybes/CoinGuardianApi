import initApiKeyModel from '../models/apikey.model.js';
import { User, sequelize } from '../models/index.js';
import { encrypt } from '../services/crypto.service.js';

export const getUser =  async(req, res) => {
    res.status(200).json(req.user);
}

export const updateUser = async (req, res) => {
  try {
    const { firstname, lastname, email, secretKey, publicKey } = req.body;

    const [updated] = await User.update(
      { firstname, lastname, email },
      { where: { id: req.user.id } }
    );

    const ApiKey = initApiKeyModel(sequelize);
    const encryptedPublicKey = encrypt(publicKey);
    const encryptedPrivateKey = encrypt(secretKey);
    
    const apiKey = await ApiKey.update(
      { api_key: encryptedPublicKey, secret_key: encryptedPrivateKey},
      { where: { user_id: req.user.id } }
    );

    if (updated && apiKey) {
      return res.status(200).json({ sucess: true, });
    }
    
    throw new Error('Utilisateur non trouvé');
  } catch (error) {
    console.error(error);
    return res.status(500).json({ sucess: false, });
  }
};