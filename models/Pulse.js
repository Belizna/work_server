import mongoose from "mongoose";

const PulseSchema = new mongoose.Schema({
    date_pulse :{
        type: Date,
        required: true,
    },
    name_pulse: {
        type: String,
        required: false
    },
    category_pulse: {
        type: String,
        required: true
    },
    time_pulse: {
        type: Number,
        required: false
    },
    sum_pulse: {
        type: Number,
        required: false
    },
    sum_pulse_credit: {
        type: Number,
        required: false
    }
})

export default mongoose.model('Pulse', PulseSchema);