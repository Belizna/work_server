import OneToOneModel from '../models/OneToOne.js'


export const oneToOne_get = async (req, res) => {
    try {
        const oneToOne = await OneToOneModel.
            find({ assignment_employee: req.params.assignment_employee }).sort({ oneToOne_date: 1 })

        res.status(200).json({ oneToOne })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const oneToOne_add = async (req, res) => {
    try {

        var daysUTC_3 = new Date(req.body.oneToOne_date)
        daysUTC_3.setDate(daysUTC_3.getDate() + 1)
        daysUTC_3 = daysUTC_3.toISOString().slice(0, 10).split("-").reverse().join("-")

        const oneToOneDoc = new OneToOneModel({
            oneToOne_date: daysUTC_3,
            oneToOne_agenda: req.body.oneToOne_agenda,
            oneToOne_protocol: req.body.oneToOne_protocol,
            oneToOne_status: req.body.oneToOne_status,
            assignment_employee: req.params.assignment_employee,
        })
        const oneToOne = await oneToOneDoc.save()

        res.status(200).json({
            oneToOne,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const oneToOne_delete = async (req, res) => {
    try {

        const deleteoneToOne = await OneToOneModel.findByIdAndDelete(req.params.id)

        if (!deleteoneToOne) {
            return res.status(404).send({
                message: 'Такой задачи нет'
            })
        }

        res.status(200).json({ deleteoneToOne })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const oneToOne_edit = async (req, res) => {
    try {
        const oneToOne_edit = await OneToOneModel.findByIdAndUpdate(req.params.id, {
            oneToOne_date: ((req.body.oneToOne_date).substr(0, 10)).split("-").reverse().join("-"),
            oneToOne_agenda: req.body.oneToOne_agenda,
            oneToOne_protocol: req.body.oneToOne_protocol,
            oneToOne_status: req.body.oneToOne_status,
        })

        res.status(200).json({
            oneToOne_edit,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}