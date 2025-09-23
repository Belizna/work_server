import VocationModel from '../models/Vocation.js'
import moment from 'moment/moment.js'

export const vocation_get = async (req, res) => {
    try {

        var vocation = []

        const vocationEntity = await VocationModel.aggregate([
            {
                $match: {
                    employee_vocation_to: {
                        $gte: `${req.params.year}-01-01`,
                        $lte: `${req.params.year}-12-31`
                    }
                }
            }
        ])

        var vocationGroupDays = [
            { assignment_employee: 'Жданов Александр', days_vocation: 0 },
            { assignment_employee: 'Тарасенко Сергей', days_vocation: 0 },
            { assignment_employee: 'Ерофеева Татьяна', days_vocation: 0 },
            { assignment_employee: 'Прохваткин Алексей', days_vocation: 0 },
            { assignment_employee: 'Шарафадинов Аскар', days_vocation: 0 },
            { assignment_employee: 'Салеев Илья', days_vocation: 0 },
            { assignment_employee: 'Ермолаев Ян', days_vocation: 0 }
        ]

        const employeeSelector = [
            { value: "Жданов Александр", label: "Жданов Александр" },
            { value: "Тарасенко Сергей", label: "Тарасенко Сергей" },
            { value: "Ерофеева Татьяна", label: "Ерофеева Татьяна" },
            { value: "Прохваткин Алексей", label: "Прохваткин Алексей" },
            { value: "Шарафадинов Аскар", label: "Шарафадинов Аскар" },
            { value: "Салеев Илья", label: "Салеев Илья" },
            { value: "Ермолаев Ян", label: "Ермолаев Ян" }
        ]

        const employeeFilterSelector = [
            { text: "Жданов Александр", value: "Жданов Александр" },
            { text: "Тарасенко Сергей", value: "Тарасенко Сергей" },
            { text: "Ерофеева Татьяна", value: "Ерофеева Татьяна" },
            { text: "Прохваткин Алексей", value: "Прохваткин Алексей" },
            { text: "Шарафадинов Аскар", value: "Шарафадинов Аскар" },
            { text: "Салеев Илья", value: "Салеев Илья" },
            { text: "Ермолаев Ян", value: "Ермолаев Ян" }
        ]

        vocationEntity.map(arr => {
            arr.assignment_employee === vocationGroupDays[0].assignment_employee ?
                vocationGroupDays[0].days_vocation +=
                moment(arr.employee_vocation_to).diff(moment(arr.employee_vocation_from), 'days') + 1
                : arr.assignment_employee === vocationGroupDays[1].assignment_employee ?
                    vocationGroupDays[1].days_vocation +=
                    moment(arr.employee_vocation_to).diff(moment(arr.employee_vocation_from), 'days') + 1
                    : arr.assignment_employee === vocationGroupDays[2].assignment_employee ?
                        vocationGroupDays[2].days_vocation +=
                        moment(arr.employee_vocation_to).diff(moment(arr.employee_vocation_from), 'days') + 1
                        : arr.assignment_employee === vocationGroupDays[3].assignment_employee ?
                            vocationGroupDays[3].days_vocation +=
                            moment(arr.employee_vocation_to).diff(moment(arr.employee_vocation_from), 'days') + 1
                            : arr.assignment_employee === vocationGroupDays[4].assignment_employee ?
                                vocationGroupDays[4].days_vocation +=
                                moment(arr.employee_vocation_to).diff(moment(arr.employee_vocation_from), 'days') + 1
                                : arr.assignment_employee === vocationGroupDays[5].assignment_employee ?
                                    vocationGroupDays[5].days_vocation +=
                                    moment(arr.employee_vocation_to).diff(moment(arr.employee_vocation_from), 'days') + 1
                                    : arr.assignment_employee === vocationGroupDays[6].assignment_employee ?
                                        vocationGroupDays[6].days_vocation +=
                                        moment(arr.employee_vocation_to).diff(moment(arr.employee_vocation_from), 'days') + 1
                                        :
                                        arr.assignment_employee

            vocation.push({
                _id: arr._id,
                assignment_employee: arr.assignment_employee,
                employee_vocation_from: moment(arr.employee_vocation_from).format('DD.MM.YYYY'),
                employee_vocation_to: moment(arr.employee_vocation_to).format('DD.MM.YYYY'),
            })
        })

        res.status(200).json({
            employeeSelector,
            employeeFilterSelector,
            vocation,
            vocationGroupDays
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const vocation_get_gantt = async (req, res) => {
    try {

        const year = req.params.year
        var vocation = []

        const vocationEntity = await VocationModel.aggregate([
            {
                $match: {
                    employee_vocation_to: {
                        $gte: `${year}-01-01`,
                        $lte: `${year}-12-31`
                    }
                }
            }
        ])

        vocationEntity.map(arr => {
            const monthDiff = (moment(arr.employee_vocation_to).year() -
                moment(arr.employee_vocation_from).year()) * 12 +
                (moment(arr.employee_vocation_to).month()
                    - moment(arr.employee_vocation_from).month());

            if (monthDiff > 0) {
                vocation.push({
                    _id: crypto.randomUUID(),
                    empId: arr.assignment_employee,
                    start: arr.employee_vocation_from,
                    end: moment({ year, month: moment(arr.employee_vocation_from).month() })
                        .endOf("month").format('YYYY-MM-DD')
                }, {
                    _id: crypto.randomUUID(),
                    empId: arr.assignment_employee,
                    start: moment({ year, month: moment(arr.employee_vocation_to).month() })
                        .startOf("month").format('YYYY-MM-DD'),
                    end: arr.employee_vocation_to
                })
            }
            else {
                vocation.push({
                    _id: arr._id,
                    empId: arr.assignment_employee,
                    start: arr.employee_vocation_from,
                    end: moment(arr.employee_vocation_to).add(1, "days"),
                })
            }
        })

        res.status(200).json({ vocation })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const vocation_edit = async (req, res) => {
    try {

        const vocation_edit = await VocationModel.findByIdAndUpdate(req.params.id, {
            assignment_employee: req.body.assignment_employee,
            employee_vocation_to: ((req.body.employee_vocation_to).substr(0, 10)),
            employee_vocation_from: ((req.body.employee_vocation_from).substr(0, 10)),
        })

        res.status(200).json({ vocation_edit })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const vocation_add = async (req, res) => {
    try {

        var daysUTC_from = new Date(req.body.employee_vocation_from)
        var daysUTC_to = new Date(req.body.employee_vocation_to)

        daysUTC_to = moment((daysUTC_to.setDate(daysUTC_to.getDate() + 1))).format('YYYY-MM-DD')
        daysUTC_from = moment((daysUTC_from.setDate(daysUTC_from.getDate() + 1))).format('YYYY-MM-DD')

        const vocationDoc = new VocationModel({
            assignment_employee: req.body.assignment_employee,
            employee_vocation_from: daysUTC_from,
            employee_vocation_to: daysUTC_to,
        })

        await vocationDoc.save()

        res.status(200).json({ vocationDoc })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const vocation_delete = async (req, res) => {
    try {

        const deleteVocation = await
            VocationModel.findByIdAndDelete(req.params.id)

        res.status(200).json({ deleteVocation })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

