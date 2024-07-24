import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
import initApiKeyModel from '../models/apikey.model.js';
import { sequelize } from '../models/index.js';
import { decrypt } from './crypto.service.js';

dotenv.config();

const BINANCE_API_URL = 'https://api.binance.com';

export const getBinanceData = async (user) => {
    const ApiKey = initApiKeyModel(sequelize);

    try {
        const apiKeyRecord = await ApiKey.findOne({ where: { user_id: user.id } });

        if (!apiKeyRecord) {
            throw new Error('API keys not found for the user');
        }

        const apiKey = decrypt(apiKeyRecord.api_key);
        const secretKey = decrypt(apiKeyRecord.secret_key);

        if (!apiKey || !secretKey || apiKey.length !== 64 || secretKey.length !== 64) {
            throw new Error('API key or secret key is invalid');
        }

        const signRequest = (params, secretKey) => {
            const query = new URLSearchParams(params).toString();
            return crypto.createHmac('sha256', secretKey).update(query).digest('hex');
        };

        const getAccountInfo = async () => {
            const endpoint = '/api/v3/account';
            const params = {
                timestamp: Date.now(),
            };
            params.signature = signRequest(params, secretKey);

            try {
                const response = await axios.get(`${BINANCE_API_URL}${endpoint}`, {
                    headers: {
                        'X-MBX-APIKEY': apiKey,
                    },
                    params,
                });

                return response.data;
            } catch (error) {
                console.error('Error in getAccountInfo:', error.response?.data || error.message);
                throw error;
            }
        };

        const getPrices = async () => {
            const endpoint = '/api/v3/ticker/price';
            const response = await axios.get(`${BINANCE_API_URL}${endpoint}`);
            return response.data;
        };

        const accountInfo = await getAccountInfo();
        const prices = await getPrices();

        const balances = accountInfo.balances.filter(balance => parseFloat(balance.free) > 0 || parseFloat(balance.locked) > 0);

        const binanceData = balances.map(balance => {
            const asset = balance.asset;
            const free = parseFloat(balance.free);
            const locked = parseFloat(balance.locked);
            const total = free + locked;

            let priceInUSD = 0;
            if (asset === 'USDT') {
                priceInUSD = 1;
            } else {
                const priceData = prices.find(p => p.symbol === `${asset}USDT`);
                if (priceData) {
                    priceInUSD = parseFloat(priceData.price);
                }
            }

            const valueInUSD = total * priceInUSD;

            return {
                asset,
                free,
                locked,
                valueInUSD,
            };
        });

        const totalUSD = binanceData.reduce((sum, balance) => sum + balance.valueInUSD, 0);

        return {
            balances: binanceData,
            totalUSD,
        };
    } catch (error) {
        console.error('Error fetching or updating Binance data:', error);
        throw error;
    }
};
