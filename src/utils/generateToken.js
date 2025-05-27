const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { jwtEncryptionKey, jwtAlgorithmKey } = require('../../config/config');

const encryptionKey = Buffer.from(jwtEncryptionKey, 'hex'); // 32 bytes for aes-256
const ivLength = 16; // For AES

// Helper to encrypt payload
function encryptPayload(payload) {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(jwtAlgorithmKey, encryptionKey, iv);
  let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { encrypted, iv: iv.toString('hex') };
}

// Helper to decrypt payload
function decryptPayload(encrypted, ivHex) {
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(jwtAlgorithmKey, encryptionKey, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}

// Token Encrypt (JWT Sign)
exports.encryptToken = async (payload) => {
  try {
    const { encrypted, iv } = encryptPayload(payload);
    const token = jwt.sign({ data: encrypted, iv }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
  } catch (err) {
    console.error(`encryptToken Error: `, err.message);
    return { error: 'An unexpected error occurred during token encryption.' };
  }
};

// Token Decrypt (JWT Verify)
exports.decryptToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const payload = decryptPayload(decoded.data, decoded.iv);
    return payload;
  } catch (err) {
    console.error(`decryptToken Error: `, err.message);
    return { error: 'An unexpected error occurred during token decryption.' };
  }
};

//^ Easy Way Token Generation
//^ exports.encryptToken = async (payload) => token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
//^ exports.decryptToken = async (token) => payload = jwt.verify(token, JWT_SECRET);