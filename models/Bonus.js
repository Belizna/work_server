import mongoose from "mongoose";

const BonusSchema = new mongoose.Schema({
    date_bonus :{
        type: Date,
        required: true,
        unique: true
    },
    time_bouns: {
        type: Number,
    },
    summ_bonus: {
        type: Number,
        required: true
    },
})

export default mongoose.model('Bonus', BonusSchema);