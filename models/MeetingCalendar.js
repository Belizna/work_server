import mongoose from "mongoose";

const MeetingCalendarSchema = new mongoose.Schema({
    meetingCalendar_date: {
        type: String,
        required: true,
    },
    meetingCalendar_agenda: {
        type: String,
        required: true,
    },
    meetingCalendar_protocol: {
        type: String,
        required: true
    },
    meetingCalendar_status: {
        type: String,
        required: true
    }
})

export default mongoose.model('MeetingCalendar', MeetingCalendarSchema);