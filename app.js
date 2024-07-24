import express from 'express';
import bodyParser from 'body-parser';
import { sequelize } from './models/index.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import totpRoutes from './routes/totp.routes.js';
import binanceApiRoutes from './routes/binanceApi.routes.js';
import dotenv from 'dotenv';
import connectDB from './config/mongoose.js';
import swaggerUi from 'swagger-ui-express';
import specs from './config/swaggerConfig.js';

dotenv.config();
connectDB();
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('API is working');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/totp', totpRoutes);
app.use('/api/binanceApi', binanceApiRoutes);

sequelize.sync();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
