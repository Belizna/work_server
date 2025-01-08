import PersonModel from "../models/Person.js";

export const person_get = async (req, res) => {
    try {
        const person = await PersonModel.find()

        var personTree = []

        person.map(arr=> personTree.push({id: arr.id, children: arr.children}))

        var personSelectorOptions = []

        for(var i = 0; i < person.length; i++){ 
            personSelectorOptions.push({value : i, label: person[i].id})
        }

        res.status(200).json({
            personTree,
            personSelectorOptions
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}