import TeamsModel from "../models/Teams.js"


export const teams_get = async (req, res) => {
    try {
        const teams = await TeamsModel.find()

        res.status(200).json({ teams })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const teams_add = async (req, res) => {
    try {

        var daysUTC_3 = new Date(req.body.birthday)
        daysUTC_3.setDate(daysUTC_3.getDate() + 1)
        daysUTC_3 = daysUTC_3.toISOString().slice(0, 10).split("-").reverse().join("-")

        var daysUTC_3_2 = new Date(req.body.date_employment)
        daysUTC_3_2.setDate(daysUTC_3_2.getDate() + 1)
        daysUTC_3_2 = daysUTC_3_2.toISOString().slice(0, 10).split("-").reverse().join("-")

        const teamsDoc = new TeamsModel({
            birthday: daysUTC_3,
            date_employment: daysUTC_3_2,
            fio_user: req.body.fio_user,
            user_position: req.body.user_position,
        })

        const teams = await teamsDoc.save()

        res.status(200).json({
            teams,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const teams_delete = async (req, res) => {
    try {

        const deleteTeams = await TeamsModel.findByIdAndDelete(req.params.id)

        if (!deleteTeams) {
            return res.status(404).send({
                message: 'Такой задачи нет'
            })
        }

        res.status(200).json({ deleteTeams })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const teams_edit = async (req, res) => {
    try {
        const teams_edit = await TeamsModel.findByIdAndUpdate(req.params.id, {
            date_employment: ((req.body.date_employment).substr(0, 10)).split("-").reverse().join("-"),
            birthday: ((req.body.birthday).substr(0, 10)).split("-").reverse().join("-"),
            fio_user: req.body.fio_user,
            user_position: req.body.user_position,
        })

        res.status(200).json({
            teams_edit,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}