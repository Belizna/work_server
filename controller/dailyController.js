import DailyModel from '../models/Daily.js'


export const daily_get = async (req, res) => {
    try {
        const daily = await DailyModel.find().sort({daily_date: -1})

        res.status(200).json({ daily })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const daily_add = async (req, res) => {
    try {
        
        var daysUTC_3 = new Date(req.body.daily_date)
        daysUTC_3.setDate(daysUTC_3.getDate() + 1)
        daysUTC_3 = daysUTC_3.toISOString().slice(0, 10).split("-").reverse().join("-")

        const dailyDoc = new DailyModel({
            daily_date: daysUTC_3,
            daily_agenda: req.body.daily_agenda,
            daily_protocol: req.body.daily_protocol,
        })
        const daily = await dailyDoc.save()

        res.status(200).json({
            daily,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const daily_delete = async (req, res) => {
    try {

        const deleteDaily= await DailyModel.findByIdAndDelete(req.params.id)
        
        if (!deleteDaily) {
            return res.status(404).send({
                message: 'Такой задачи нет'
            })
        }

        res.status(200).json({ deleteDaily })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const daily_edit = async (req, res) => {
    try {

        const daily_edit = await DailyModel.findByIdAndUpdate(req.params.id, {
            daily_date: ((req.body.daily_date).substr(0, 10)).split("-").reverse().join("-"),
            daily_agenda: req.body.daily_agenda,
            daily_protocol: req.body.daily_protocol
        })

        res.status(200).json({
            daily_edit,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}