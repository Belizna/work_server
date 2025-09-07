import GanttModel from '../models/Gantt.js'
import moment from 'moment/moment.js'

export const gantt_get = async (req, res) => {
    try {
        var gantt = []
        var ganttSelector = []

        const ganttEntity = await GanttModel
            .find({ assignment_employee: req.params.assignment_employee, status: 'Не Выполнено' })

        ganttEntity.map(data => {
            gantt.push({
                id: data.id,
                type: data.type,
                name: data.name,
                start: data.start,
                end: data.end,
                progress: data.progress,
                dependencies: [data?.dependencies] || []
            }),
                ganttSelector.push({
                    value: data.id,
                    label: data.name,
                })
        })


        res.status(200).json({ gantt, ganttSelector })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const gantt_edit = async (req, res) => {
    try {

        const gantt_edit = await GanttModel.updateMany({ id: req.params.id }, {
            $set: {
                progress: req.body.progress,
                end: req.body.end
            }
        })

        res.status(200).json({ gantt_edit })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const gantt_add = async (req, res) => {
    try {

        var daysUTC_3 = new Date(req.body.end)
        daysUTC_3.setDate(daysUTC_3.getDate() + 1)

        var daysUTC_to = moment(daysUTC_3).format('YYYY.MM.DD')
        var daysUTC_from = moment().format('YYYY.MM.DD')

        //var id = req.body.dependencies+'task'

        const granttDoc = new GanttModel({
            id: crypto.randomUUID(),
            type: 'task',
            name: req.body.name,
            start: daysUTC_from,
            end: daysUTC_to,
            progress: 5,
            status: 'Не Выполнено',
            dependencies: req.body.dependencies,
            assignment_employee: req.params.assignment_employee
        })

        await granttDoc.save()

        res.status(200).json({ granttDoc })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}
