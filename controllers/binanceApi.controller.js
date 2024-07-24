import { getBinanceData } from '../services/binance.service.js';
import BinanceData from '../models/wallet.mongo.js'; 

export const fetchBinanceData = async (req, res) => {
  try {
    const user = req.user;
    console.log(user);

    const { balances, totalUSD } = await getBinanceData(user);

    await BinanceData.deleteMany({ user_id: user.id });

    const binanceData = balances.map(balance => ({
      user_id: user.id,
      asset: balance.asset,
      free: balance.free,
      locked: balance.locked,
      valueInUSD: balance.valueInUSD,
      timestamp: new Date() 
    }));

    const savedDataPromises = binanceData.map(data => BinanceData.create(data));
    await Promise.all(savedDataPromises);

    binanceData.sort((a, b) => b.valueInUSD - a.valueInUSD);

    res.status(200).json({
      balances: binanceData,
      totalUSD: totalUSD,
    });
  } catch (error) {
    console.error('Error fetching or updating Binance data:', error);
    res.status(500).json({ message: 'Error fetching or updating Binance data', error });
  }
};
