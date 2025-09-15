import mongoose from "mongoose";

const OneToOneSchema = new mongoose.Schema({
    oneToOne_date: {
        type: String,
        required: true,
    },
    oneToOne_agenda: {
        type: String,
        required: true,
    },
    oneToOne_protocol: {
        type: String,
        required: true
    },
    oneToOne_status: {
        type: String,
        required: true
    },
    assignment_employee: {
        type: String,
        required: true
    },
})

export default mongoose.model('OneToOne', OneToOneSchema);