import TeamsModel from "../models/Teams.js"
import ReleaseModel from '../models/Release.js'
import AssignmentModel from '../models/Assignment.js'
import VocationModel from '../models/Vocation.js'

import moment from 'moment/moment.js'

export const mainPage_get = async (req, res) => {
    try {

        const now = moment();

        const monthDiff = (date) => {
            return (moment(date).year() - moment(now).year()) * 12 +
                (moment(date).month() - moment(now).month())
        }

        var eventsTeams = []
        var releaseTeams = [{ title: 'Текущий месяц', release: [] }, { title: 'Следующий месяц', release: [] }]
        var assignmentTeams = []
        var assignmentMe = []
        var events = []

        const teams = await TeamsModel.find()
        const relase = await ReleaseModel.find()
        const assignment = await AssignmentModel.aggregate([
            {
                $match: {
                    assignment_status: 'Не Выполнено',
                    $expr: {
                        $lt: [
                            {
                                $dateFromString: {
                                    dateString: "$assignment_date",
                                    format: "%d-%m-%Y"
                                }
                            },
                            {
                                $dateAdd: {
                                    startDate: "$$NOW",
                                    unit: "day",
                                    amount: 3
                                }
                            }
                        ]
                    }

                }
            },
            {
                $group: {
                    _id: "$assignment_employee",
                    tasks: {
                        $push: {
                            assignment_date: "$assignment_date",
                            assignment_name: "$assignment_name",
                            assignment_task: "$assignment_task",
                        }
                    },
                    count: { $sum: 1 }
                }
            }
        ])

        const vocation = await VocationModel.find({
            $expr: {
                $and: [
                    {
                        $gte: [
                            { $toDate: "$employee_vocation_from" },
                            now.startOf("month").toDate()
                        ]
                    },
                    {
                        $lte: [
                            { $toDate: "$employee_vocation_to" },
                            now.add(1, "month").endOf("month").toDate()
                        ]
                    }
                ]
            }
        })

        vocation.sort((a, b) => {
            const dateA = moment(a.employee_vocation_from, "YYYY-MM-DD").toDate();
            const dateB = moment(b.employee_vocation_from, "YYYY-MM-DD").toDate();

            return dateA - dateB;
        });

        assignment.map(arr => {
            arr.tasks.sort((a, b) => {
                const dateA = moment(a.assignment_date, "DD-MM-YYYY").toDate();
                const dateB = moment(b.assignment_date, "DD-MM-YYYY").toDate();

                return dateA - dateB;
            });
        })

        assignmentTeams = assignment.filter(arr => arr._id != "Ермолаев Ян Александрович")
        assignmentMe = assignment.filter(arr => arr._id === "Ермолаев Ян Александрович")

        teams.map(arr => {

            var birthday = moment(`${arr.birthday?.substr(0, 6) + now.year()}`, "DD-MM-YYYY")
            const monthDiffBirth = monthDiff(birthday) + 1;

            if (monthDiffBirth >= 0 && monthDiffBirth < 3) {

                eventsTeams.push({
                    days: moment(birthday).format("DD-MM-YYYY"),
                    title: "🎂 День рождения",
                    fio_user: arr.fio_user,
                    diff: `Исполняется - ${now.year() - arr.birthday?.substr(6, 4)}`
                })

            }

            var employmentday = moment(`${arr.date_employment?.substr(0, 6) + now.year()}`, "DD-MM-YYYY")
            const monthDiffEmployment = monthDiff(employmentday) + 1;

            if (monthDiffEmployment >= 0 && monthDiffEmployment < 3) {

                if (now.year() - arr.date_employment?.substr(6, 4) === 1) {
                    eventsTeams.push({
                        days: moment(employmentday).format("DD-MM-YYYY"),
                        title: "🎉 Юбилей в команде",
                        fio_user: arr.fio_user,
                        diff: `Прошел - ${now.year() - arr.date_employment?.substr(6, 4)} год`
                    })
                }
                else if (now.year() - arr.date_employment?.substr(6, 4) > 1 &&
                    now.year() - arr.date_employment?.substr(6, 4) < 5) {
                    eventsTeams.push({
                        days: moment(employmentday).format("DD-MM-YYYY"),
                        title: "🎉 Юбилей в команде",
                        fio_user: arr.fio_user,
                        diff: `Прошло - ${now.year() - arr.date_employment?.substr(6, 4)} года`
                    })
                }
                else {
                    eventsTeams.push({
                        days: moment(employmentday).format("DD-MM-YYYY"),
                        title: "🎉 Юбилей в команде",
                        fio_user: arr.fio_user,
                        diff: `Прошло - ${now.year() - arr.date_employment?.substr(6, 4)} лет`
                    })
                }
            }
        })

        eventsTeams.sort((a, b) => {
            const dateA = moment(a.days, "DD-MM-YYYY").toDate();
            const dateB = moment(b.days, "DD-MM-YYYY").toDate();

            return dateA - dateB;
        });

        relase.sort((a, b) => {
            const dateA = moment(a.release_date, "DD-MM-YYYY").toDate();
            const dateB = moment(b.release_date, "DD-MM-YYYY").toDate();

            return dateA - dateB;
        });

        relase.map(arr => {

            const monthDiffReleae = monthDiff(moment(arr.release_date, "DD-MM-YYYY")) + 1;

            if (monthDiffReleae === 0) {
                releaseTeams[0].release.push({
                    assignment_employee: arr.assignment_employee.split(" ").slice(0, 2).join(" "),
                    release_date: arr.release_date
                })
            } else if (monthDiffReleae === 1) {
                releaseTeams[1].release.push({
                    assignment_employee: arr.assignment_employee.split(" ").slice(0, 2).join(" "),
                    release_date: arr.release_date
                })
            }

        })

        events.push({ title: 'Команда', events: eventsTeams },
            { title: 'Отпуск', events: vocation }
        )

        res.status(200).json({ events, assignmentMe, assignmentTeams, eventsTeams, releaseTeams })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}