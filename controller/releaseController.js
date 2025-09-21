import ReleaseModel from '../models/Release.js'
import moment from 'moment/moment.js'

export const release_get = async (req, res) => {
    try {

        var statiscticRelease = [{ date_release: 0 }, { time_release: 0 }]
        var releaseMonth = []
        var releaseGroupMonth = [];

        const releaseEntity = await
            ReleaseModel.find({
                $expr: {
                    $eq: [
                        { $substr: ["$release_date", 6, 4] },
                        req.body.year
                    ]
                },
                assignment_employee: req.body.assignment_employee
            })

        releaseEntity.sort((a, b) => {
            const dateA = moment(a.release_date, "DD-MM-YYYY").toDate();
            const dateB = moment(b.release_date, "DD-MM-YYYY").toDate();

            return dateA - dateB;
        });

        releaseEntity.map(obj => {
            releaseMonth.push({ date: obj.release_date.slice(3), sum: obj.release_time })
        })

        releaseMonth.reduce((res, value) => {
            if (!res[(value.date)]) {
                res[value.date] = { type: value.date, value: 0 };
                releaseGroupMonth.push(res[value.date])
            }
            res[value.date].value += value.sum;
            return res;
        }, {});

        releaseEntity.sort((a, b) => {
            const dateA = moment(a.release_date, "DD-MM-YYYY").toDate();
            const dateB = moment(b.release_date, "DD-MM-YYYY").toDate();

            return dateB - dateA;
        });

        for (var i = 0; i < releaseEntity.length; i++) {
            statiscticRelease[0].date_release = i + 1
            statiscticRelease[1].time_release += releaseEntity[i].release_time
        }

        res.status(200).json({
            releaseEntity,
            statiscticRelease,
            releaseGroupMonth
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const release_edit = async (req, res) => {
    try {

        const release_edit = await ReleaseModel.findByIdAndUpdate(req.params.id, {
            release_date: ((req.body.release_date).substr(0, 10)).split("-").reverse().join("-"),
            release_time: req.body.release_time,
            release_zni: req.body.release_zni
        })

        res.status(200).json({ release_edit })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const release_add = async (req, res) => {
    try {

        var daysUTC = new Date(req.body.release_date)

        daysUTC = moment((daysUTC.setDate(daysUTC.getDate() + 1))).format('DD-MM-YYYY')

        const releaseDoc = new ReleaseModel({
            assignment_employee: req.params.assignment_employee,
            release_date: daysUTC,
            release_time: req.body.release_time,
            release_zni: req.body.release_zni,
        })

        await releaseDoc.save()

        res.status(200).json({ releaseDoc })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const release_delete = async (req, res) => {
    try {

        const deleteRelease = await
            ReleaseModel.findByIdAndDelete(req.params.id)

        res.status(200).json({ deleteRelease })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

