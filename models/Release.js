import mongoose from "mongoose";

const ReleaseSchema = new mongoose.Schema({
    release_date: {
        type: String,
        required: true,
    },
    release_time: {
        type: Number,
        required: true,
    },
    release_zni: {
        type: String,
        required: false,
    },
    assignment_employee: {
        type: String,
        required: true
    },
})

export default mongoose.model('Release', ReleaseSchema);