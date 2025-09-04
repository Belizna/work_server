import MeetingModel from '../models/Meeting.js'


export const meeting_get = async (req, res) => {
    try {
        const meeting = await MeetingModel.find()

        res.status(200).json({ meeting })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const meeting_add = async (req, res) => {
    try {

        var daysUTC_3 = new Date(req.body.meeting_date)
        daysUTC_3.setDate(daysUTC_3.getDate() + 1)
        daysUTC_3 = daysUTC_3.toISOString().slice(0, 10).split("-").reverse().join("-")

        const meetingDoc = new MeetingModel({
            meeting_date: daysUTC_3,
            meeting_agenda: req.body.meeting_agenda,
            meeting_protocol: req.body.meeting_protocol,
            meeting_status: req.body.meeting_status,
        })
        const meeting = await meetingDoc.save()

        res.status(200).json({
            meeting,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const meeting_delete = async (req, res) => {
    try {

        const deleteMeeting = await MeetingModel.findByIdAndDelete(req.params.id)

        if (!deleteMeeting) {
            return res.status(404).send({
                message: 'Такой задачи нет'
            })
        }

        res.status(200).json({ deleteMeeting })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const meeting_edit = async (req, res) => {
    try {
        const meeting_edit = await MeetingModel.findByIdAndUpdate(req.params.id, {
            meeting_date: ((req.body.meeting_date).substr(0, 10)).split("-").reverse().join("-"),
            meeting_agenda: req.body.meeting_agenda,
            meeting_protocol: req.body.meeting_protocol,
            meeting_status: req.body.meeting_status,
        })

        res.status(200).json({
            meeting_edit,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}