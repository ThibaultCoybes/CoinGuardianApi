import crypto from 'crypto';

export const encrypt = (value) => {
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');

  if (!key || !iv) {
    throw new Error('Encryption key and IV must be defined in environment variables');
  }

  if (key.length !== 32) {
    throw new Error('Encryption key length must be 32 bytes for AES-256-CBC');
  }

  if (iv.length !== 16) {
    throw new Error('IV length must be 16 bytes for AES-256-CBC');
  }

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

export const decrypt = (value) => {
  try {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');

    if (key.length !== 32) {
      throw new Error('Invalid ENCRYPTION_KEY length. Must be 32 bytes for AES-256-CBC.');
    }
    if (iv.length !== 16) {
      throw new Error('Invalid ENCRYPTION_IV length. Must be 16 bytes for AES-256-CBC.');
    }

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(value, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw error; 
  }
};
