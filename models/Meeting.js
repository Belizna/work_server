import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
    meeting_date: {
        type: String,
        required: true,
    },
    meeting_agenda: {
        type: String,
        required: true,
    },
    meeting_protocol: {
        type: String,
        required: true
    },
    meeting_status: {
        type: String,
        required: true
    }
})

export default mongoose.model('Meeting', MeetingSchema);