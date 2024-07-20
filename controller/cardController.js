import CardModel from "../models/Card.js"
import PulseModel from '../models/Pulse.js'

export const get_card = async (req, res) => {
    try {
        const card = await CardModel.find({ collection_card: req.params.collection_card }).sort({ 'number_card': 1 })

        res.status(200).json({
            card
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const edit_card = async (req, res) => {
    try {
        const card = await CardModel.findById(req.params.id)

        var collection_card_pulse = ''

        if (card.collection_card == 'Герои и Злодеи' ||
            card.collection_card == 'Герои и Злодеи. 2-я часть.' ||
            card.collection_card == 'Герои и Злодеи. 3-я часть.' ||
            card.collection_card == 'Герои и Злодеи. 4-я часть.') {
            collection_card_pulse = 'Spider_Man'
        }
        else if (card.collection_card == 'Воины тени' ||
            card.collection_card == 'Боевая четверка' ||
            card.collection_card == 'Братья по оружию') {
            collection_card_pulse = 'Teenage_Mutant_Ninja'
        }
        else if (card.collection_card == 'Отчаянные бойцы' ||
            card.collection_card == 'Новая Вестроя') {
            collection_card_pulse = 'Bakugan'
        }
        else collection_card_pulse = card.collection_card

        if (req.body.status_card === 'Есть' && card.status_card === 'Нет' || card.status_card === 'Замена') {
            const pulseDoc = new PulseModel({
                date_pulse: Date.now(),
                name_pulse: req.body.name_card,
                sum_pulse: req.body.summ_card,
                category_pulse: 'card_price',
                collection_card_pulse: collection_card_pulse,
                id_object: req.params.id
            })

            await pulseDoc.save()
        }
        else if (req.body.status_card === 'Нет' && card.status_card === 'Есть' || card.status_card === 'Замена') {
            await PulseModel.deleteMany({ id_object: req.params.id })
        }
        else {
            await PulseModel.updateMany({ id_object: req.params.id },
                {
                    name_pulse: req.body.name_card,
                    sum_pulse: req.body.summ_card,
                })
        }

        const card_edit = await CardModel
            .findByIdAndUpdate(req.params.id, {
                name_card: req.body.name_card,
                level_card: req.body.level_card,
                status_card: req.body.status_card,
                number_card: req.body.number_card,
                summ_card: req.body.summ_card,
            })
        res.status(200).json({
            card_edit
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const delete_card = async (req, res) => {
    try {

        const deleteCard = await CardModel.
            findByIdAndDelete(req.params.id)

        await PulseModel.deleteMany({ id_object: req.params.id })

        return res.status(200).json({
            deleteCard
        })

    } catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const add_card = async (req, res) => {
    try {

        const cardDoc = new CardModel({
            number_card: req.body.number_card,
            name_card: req.body.name_card,
            level_card: req.body.level_card,
            collection_card: req.params.collection_card,
            status_card: req.body.status_card,
            summ_card: req.body.summ_card,
        })

        const card = await cardDoc.save()

        if (req.body.status_card === 'Есть') {
            const pulseDoc = new PulseModel({
                date_pulse: Date.now(),
                name_pulse: req.body.name_card,
                category_pulse: 'card_price',
                collection_card_pulse: req.params.collection_card,
                sum_pulse: req.body.summ_card,
                id_object: String(card._doc._id)
            })

            await pulseDoc.save()
        }
        res.status(200).json({
            ...card._doc
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const get_card_listgroup = async (req, res) => {
    try {

        var cardListGroup = []
        var cardListGroupNaruto = []

        const filters = [
            { cards: 'Боевая четверка', key: '123' },
            { cards: 'Воины тени', key: '274' },
            { cards: 'Братья по оружию', key: '838' },
            { cards: 'Герои и Злодеи', key: '38' },
            { cards: 'Герои и Злодеи. 2-я часть.', key: '106' },
            { cards: 'Герои и Злодеи. 3-я часть.', key: '166' },
            { cards: 'Герои и Злодеи. 4-я часть.', key: '166' },
            { cards: 'Отчаянные бойцы', key: '264' },
            { cards: 'Новая Вестроя', key: '594' },
            { cards: 'Beyblade Metal Fusion', key: '934' },
            { cards: 'Transformers Prime', key: '991' },
        ]

        const cards_list = await CardModel.aggregate([
            { $match: { collection_card: { $not: { $regex: 'Naruto' } } } },
            {
                $group: {
                    _id: "$collection_card",
                    children: { $push: { status: "$status_card", title: "$number_card" } },
                    count: { $sum: 1 }
                }
            }
        ])

        const cards_listNaruto = await CardModel.aggregate([
            { $match: { collection_card: { $regex: 'Naruto' } } },
            {
                $group: {
                    _id: "$level_card",
                    children: {
                        $push: {
                            status: "$status_card", title: "$number_card",
                            hashImage_card: "$hashImage_card"
                        }
                    },
                    count: { $sum: 1 }
                }
            }
            , { $sort: { _id: 1 } }
        ])

        var itemNaruto = []
        var sumCount = 0

        for (var i = 0; i < cards_listNaruto.length; i++) {

            cards_listNaruto[i].children.sort((a, b) => a.title - b.title)

            cards_listNaruto[i].children.map(obj => obj.status === 'Нет' ?
                itemNaruto.push({ title: cards_listNaruto[i]._id + '-' + obj.title, hash: obj.hashImage_card }) : obj)
            sumCount += cards_listNaruto[i].count
        }

        const procentNaruto = (100 - (itemNaruto.length * 100 / sumCount)).toFixed(2)

        cardListGroupNaruto.push({ nameCollection: 'NARUTO KAYOU CARD', countCards: 
        sumCount, procent: procentNaruto, countNotCard: itemNaruto.length, items: itemNaruto })

        for (var i = 0; i < cards_list.length; i++) {
            var items = []
            var countCards = ''
            var keyCards = ''
            var procent = 0

            filters.map((obj) => {
                if (obj.cards === cards_list[i]._id) {
                    countCards = obj.count,
                        keyCards = obj.key
                } else
                    obj
            }
            )

            cards_list[i].children.map(obj => obj.status === 'Нет' ? items.push(obj.title) : obj)

            procent = (100 - (items.length * 100 / cards_list[i].count)).toFixed(2)
            var countNotCard = items.length
            cardListGroup.push({
                nameCollection: cards_list[i]._id, countCards: countCards, keyCards: keyCards,
                procent: procent, countNotCard: countNotCard, items: items.sort((a, b) => a - b)
            })
        }

        cardListGroup.sort((a, b) => b.procent - a.procent)

        res.status(200).json({
            cardListGroup,
            cardListGroupNaruto
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}