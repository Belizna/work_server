import mongoose from "mongoose";

const VocationSchema = new mongoose.Schema({
    assignment_employee: {
        type: String,
        required: true,
    },
    employee_vocation_from: {
        type: String,
        required: true,
    },
    employee_vocation_to: {
        type: String,
        required: true
    }
})

export default mongoose.model('Vocation', VocationSchema);