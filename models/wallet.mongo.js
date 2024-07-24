import mongoose from 'mongoose';

const { Schema } = mongoose;

const BinanceDataSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    asset: {
        type: String,
        required: true
    },
    free: {
        type: Number,
        required: true
    },
    locked: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const BinanceData = mongoose.model('BinanceData', BinanceDataSchema);
export default BinanceData;
