import MeetingCalendarModel from '../models/MeetingCalendar.js'


export const meetingCalendar_get = async (req, res) => {
    try {
        const meetingCalendar = await MeetingCalendarModel.find()

        res.status(200).json({ meetingCalendar })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const meetingCalendar_add = async (req, res) => {
    try {

        var daysUTC_3 = new Date(req.body.meetingCalendar_date)
        daysUTC_3.setDate(daysUTC_3.getDate() + 1)
        daysUTC_3 = daysUTC_3.toISOString().slice(0, 10).split("-").reverse().join("-")

        const meetingCalendarDoc = new MeetingCalendarModel({
            meetingCalendar_date: daysUTC_3,
            meetingCalendar_agenda: req.body.meetingCalendar_agenda,
            meetingCalendar_protocol: req.body.meetingCalendar_protocol,
            meetingCalendar_status: req.body.meetingCalendar_status,
        })
        const meetingCalendar = await meetingCalendarDoc.save()

        res.status(200).json({
            meetingCalendar,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const meetingCalendar_delete = async (req, res) => {
    try {

        const deletemeetingCalendar = await MeetingCalendarModel.findByIdAndDelete(req.params.id)

        if (!deletemeetingCalendar) {
            return res.status(404).send({
                message: 'Такой задачи нет'
            })
        }

        res.status(200).json({ deletemeetingCalendar })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const meetingCalendar_edit = async (req, res) => {
    try {

        const meetingCalendar_edit = await MeetingCalendarModel.findByIdAndUpdate(req.params.id, {
            meetingCalendar_date: ((req.body.meetingCalendar_date).substr(0, 10)).split("-").reverse().join("-"),
            meetingCalendar_agenda: req.body.meetingCalendar_agenda,
            meetingCalendar_protocol: req.body.meetingCalendar_protocol
        })

        res.status(200).json({
            meetingCalendar_edit,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}