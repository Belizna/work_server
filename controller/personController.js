import PersonModel from "../models/Person.js";

export const person_get = async (req, res) => {
    try {

        var groupPerson = []

        const personClass = await PersonModel.aggregate([
            {
                $group: {
                    _id: "$id",
                    children: { $push: "$children.id" },
                }
            }
        ])

        for (var i = 0; i < personClass.length; i++) {
            var massPerson = []
            personClass[i].children.map(pers => {
                pers.map(p => massPerson.push({ value: p, label: p }))
            })

            groupPerson.push({
                id: personClass[i]._id, person: massPerson
            })
        }

        const person = await PersonModel.find()

        var personTree = []

        person.map(arr => personTree.push({ id: arr.id, children: arr.children }))

        var personSelectorOptions = []
        var personSelectorClass = []

        for (var i = 0; i < person.length; i++) {
            personSelectorOptions.push({ value: i, label: person[i].id })
            personSelectorClass.push({ value: person[i].id, label: person[i].id })
        }

        personSelectorOptions.sort((a, b) => (a.label > b.label) - (a.label < b.label))

        res.status(200).json({
            personTree,
            personSelectorOptions,
            personSelectorClass,
            groupPerson
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const person_add_class = async (req, res) => {
    try {

        var arr = []

        for (var i = 0; i < req.body.names.length; i++) {
            arr.push({ id: req.body.names[i] })
        }

        PersonModel.insertMany(arr)

        res.status(200).json({
            arr
        })
    }

    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const person_add_person = async (req, res) => {
    try {

        const person = await PersonModel.find()

        var arr = [req.body]


        for (var i = 0; i < arr[0].items.length; i++) {

            var countChild = 0

            person.map(pers => pers.id === arr[0].items[i].name ? countChild = pers.children.length : pers)

            for (var j = 0; j < arr[0].items[i].list.length; j++) {
                countChild++
                var group = {
                    id: arr[0].items[i].list[j].first,
                    children: [{ id: countChild + '.' + arr[0].items[i].list[j].second, children: [] }]
                }
                await PersonModel.updateOne({ id: arr[0].items[i].name }, { $addToSet: { children: group } })
            }
        }

        res.status(200).json({
            arr
        })
    }

    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const person_add_books = async (req, res) => {
    try {

        const person = await PersonModel.find()

        var arr = [req.body]

        for (var j = 0; j < person.length; j++) {
            for (var i = 0; i < arr[0].items.length; i++) {
                for (var k = 0; k < person[j].children.length; k++) {
                    if (person[j].id === arr[0].items[i].name && person[j].children[k].id === arr[0].items[i].person) {
                        for (var m = 0; m < arr[0].items[i].list.length; m++) {

                            var books = {
                                id: person[j].children[k].children[0].id.split('.')[0] + '.' + arr[0].items[i].list[m].first
                            }

                            await PersonModel.updateOne({ id: arr[0].items[i].name, children: { $elemMatch: { id: arr[0].items[i].person } } }, { $addToSet: { "children.$.children.0.children": books } })
                        }
                    }
                }
            }
        }

        res.status(200).json({
            arr
        })
    }

    catch (err) {
        res.status(500).json({ ...err })
    }
}