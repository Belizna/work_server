import mongoose from "mongoose";

const GanttSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    start: {
        type: String,
        required: true
    },
    end: {
        type: String,
        required: true
    },
    progress: {
        type: Number,
        required: true
    },
    dependencies: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true
    },
    assignment_employee: {
        type: String,
        required: true
    },

})

export default mongoose.model('Gantt', GanttSchema);