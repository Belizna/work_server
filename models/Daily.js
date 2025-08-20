import mongoose from "mongoose";

const DailySchema = new mongoose.Schema({
    daily_date: {
        type: String,
        required: true,
    },
    daily_agenda: {
        type: String,
        required: true,
    },
    daily_protocol: {
        type: String,
        required: true
    }
})

export default mongoose.model('Daily', DailySchema);