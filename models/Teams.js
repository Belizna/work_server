import mongoose from 'mongoose'

const TeamSchema = new mongoose.Schema({

    fio_user: {
        type: String,
        required: true,
    },
    birthday: {
        type: String,
        required: true,
    },
    date_employment: {
        type: String,
        required:true
    },
    user_position: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
})

export default mongoose.model('Teams', TeamSchema);