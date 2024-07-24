import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';

export const register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ firstname, lastname, email, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Route de connexion
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const userId = user.id
    res.status(200).json({email, userId});
  } catch (error) {
    res.status(500).json({ message: 'Error logging in user', error });
  }
};

export default { register, login };
