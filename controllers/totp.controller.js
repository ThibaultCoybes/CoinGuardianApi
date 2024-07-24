import speakeasy from 'speakeasy';
import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';

// Route pour configurer Google Authenticator
export const setupGoogleAuthenticator = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const secret = speakeasy.generateSecret({ name: `CoinGuardian (${email})` });

    // Stockez le secret dans la base de données pour cet utilisateur
    user.authy_id = secret.base32;
    await user.save();

    // Renvoyer la clé secrète base32 que l'utilisateur peut entrer dans Google Authenticator
    res.status(200).json({ message: 'Google Authenticator setup', secret: secret.base32, otpauth_url: secret.otpauth_url });
  } catch (error) {
    console.error('Error setting up Google Authenticator:', error);
    res.status(500).json({ message: 'Error setting up Google Authenticator', error });
  }
};


// Route pour vérifier le code TOTP
export const verifyTOTP = async (req, res) => {
  const { email, token } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.authy_id,
      encoding: 'base32',
      token
    });

    if (verified) {
      const jwtToken = jwt.sign(
        { email }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );
      res.status(200).json({ message: 'TOTP verified', jwtToken: jwtToken });
    } else {
      res.status(401).json({ message: 'Invalid TOTP' });
    }
  } catch (error) {
    console.error('Error verifying TOTP:', error);
    res.status(500).json({ message: 'Error verifying TOTP', error });
  }
};

export const checkAuthyToken = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ where: { id: userId }});

    if(!user){
      res.status(404).json({ message: "User not found"})
    }
    const authyId = user.authy_id
    if(authyId !==  null){
      res.status(200).json({ exists: true })
    }else{
      res.status(401).json({ exists: false, email: user.email })
    } 

  }catch(err){
    console.log('Error verifying auhty_id :', err);
    res.status(500).json({ message: "Error verifying auhty_id" })
  }
}
