import GanttModel from '../models/Gantt.js'
import moment from 'moment/moment.js'

export const gantt_get = async (req, res) => {
    try {
        var gantt = []
        var ganttSelector = []

        function sortTasksByHierarchy(tasks) {
            function collectChildren(parentId) {
                return tasks
                    .filter(t => t.project === parentId)
                    .sort((a, b) => a.start - b.start)
                    .flatMap(child => [child, ...collectChildren(child.id)]);
            }
            const roots = tasks.filter(t => !t.project);

            let result = [];
            roots.forEach(root => {
                result.push(root);
                result = result.concat(collectChildren(root.id));
            });

            return result;
        }

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
                project: data?.project,
                dependencies: [data?.dependencies] || [],
                styles: {
                    backgroundColor: "#1ab935ff",  // цвет фона project-бара
                    progressColor: "#3890e7ff",    // цвет прогресса
                    textColor: "#000000"         // цвет текста (черный)
                }
            }),
                ganttSelector.push({
                    value: data.id,
                    label: data.name,
                })
        })

        gantt = sortTasksByHierarchy(gantt)


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
                end: req.body.end,
                start: req.body.start
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
            project: req.body.dependencies,
            assignment_employee: req.params.assignment_employee
        })

        await granttDoc.save()

        res.status(200).json({ granttDoc })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}
