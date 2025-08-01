import ComputerModel from "../models/Computer.js"

export const get_computer = async (req, res) => {
    try {

        const category = ['Процессор', 'Материнская плата', 'Блок питания', 'Корпус', 'Видеокарта',
            'Охлаждение процессора', 'Оперативная память', 'Накопитель', 'Звуковая карта',
            'Монитор', 'Клавиатура', 'Мышь', 'Наушники', 'Микрофон', 'Стол', 'Кресло']


        const computer = await ComputerModel.find()

        if (!computer) {
            return res.status(404).send({
                message: 'Комплектующие не найдены'
            })
        }

        res.status(200).json({
            computer,
            category
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const edit_computer = async (req, res) => {
    try {

        const computer_edit = await ComputerModel
            .findByIdAndUpdate(req.params.id, {
                components_name: req.body.components_name,
                components_summ: req.body.components_summ,
                category: req.body.category,
                date_buy : ((req.body.date_buy).substr(0, 10)).split("-").reverse().join("-")
            })
        res.status(200).json({
            computer_edit
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const delete_computer = async (req, res) => {
    try {

        const deleteComputer = await ComputerModel.
            findByIdAndDelete(req.params.id)

        if (!deleteComputer) {
            return res.status(404).send({
                message: "Комплектующие не найдены"
            })
        }

        return res.status(200).json({
            deleteComputer
        })

    } catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const add_computer= async (req, res) => {
    try {

        var daysUTC_3 = new Date(req.body.date_buy)
        daysUTC_3.setDate(daysUTC_3.getDate() + 1)
        daysUTC_3 = daysUTC_3.toISOString().slice(0, 10).split("-").reverse().join("-")

        const computerDoc = new ComputerModel({
            components_name: req.body.components_name,
            components_summ: req.body.components_summ,
            category: req.body.category,
            date_buy: req.params.date_buy
        })

        const computer = await computerDoc.save()

        res.status(200).json({
            ...computer._doc
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}