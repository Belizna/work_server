import AssignmentModel from '../models/Assignment.js'
import GanttModel from '../models/Gantt.js'
import moment from 'moment/moment.js'

export const assignment_get = async (req, res) => {
    try {
        const assignment = await AssignmentModel.
            find({ assignment_employee: req.params.assignment_employee }).sort({ assignment_date: 1 })

        res.status(200).json({ assignment })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const assignment_add = async (req, res) => {
    try {

        var daysUTC_3 = new Date(req.body.assignment_date)
        daysUTC_3.setDate(daysUTC_3.getDate() + 1)

        var daysUTC_to = moment(daysUTC_3).format('YYYY.MM.DD')
        var daysUTC_from = moment().format('YYYY.MM.DD')

        daysUTC_3 = daysUTC_3.toISOString().slice(0, 10).split("-").reverse().join("-")


        const assignmentDoc = new AssignmentModel({
            assignment_date: daysUTC_3,
            assignment_name: req.body.assignment_name,
            assignment_status: req.body.assignment_status,
            assignment_priority: req.body.assignment_priority,
            assignment_task: req.body.assignment_task,
            assignment_employee: req.params.assignment_employee,
        })
        const assignment = await assignmentDoc.save()

        const granttDoc = new GanttModel({
            id: assignment._id.toString(),
            type: 'task',
            name: req.body.assignment_name,
            start: daysUTC_from,
            end: daysUTC_to,
            progress: 5,
            status: 'Не Выполнено',
            assignment_employee: req.params.assignment_employee
        })

        await granttDoc.save()

        res.status(200).json({
            assignment,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const assignment_delete = async (req, res) => {
    try {

        const deleteAssignment = await AssignmentModel.findByIdAndDelete(req.params.id)

        if (!deleteAssignment) {
            return res.status(404).send({
                message: 'Такой задачи нет'
            })
        }

        await GanttModel.deleteMany({
            $or: [
                { id: req.params.id },
                { dependencies: req.params.id },
                { dependencies: req.params.id + 'task' }
            ]
        })

        res.status(200).json({ deleteAssignment })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const assignment_edit = async (req, res) => {
    try {

        const assignment_edit = await AssignmentModel.findByIdAndUpdate(req.params.id, {
            assignment_date: ((req.body.assignment_date).substr(0, 10)).split("-").reverse().join("-"),
            assignment_name: req.body.assignment_name,
            assignment_status: req.body.assignment_status,
            assignment_priority: req.body.assignment_priority,
            assignment_task: req.body.assignment_task
        })

        await GanttModel.updateMany({
            $or: [
                { id: req.params.id },
                { dependencies: req.params.id },
                { dependencies: req.params.id + 'task' }
            ]
        }, {
            $set: {
                name: req.body.assignment_name,
                status: req.body.assignment_status
            }
        })

        res.status(200).json({
            assignment_edit,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}