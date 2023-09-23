import MiniatureModel from "../models/Miniature.js"

export const miniatures_get = async(req,res) => {
    try{
        const miniatures = await MiniatureModel.find()

        res.status(200).json({miniatures})
    }
    catch(err){
        res.status(500).json({...err})
    }
}

export const miniatures_add = async(req,res) => {
    try{
        const miniatureDoc = new MiniatureModel({
            miniature_name: req.body.miniature_name,
            date_buy_miniature: req.body.date_buy_miniature,
            price_miniature: req.body.price_miniature,
            collection_miniature: req.body.collection_miniature,
            count_miniatures: req.body.count_miniatures,
            count_miniatures_color: req.body.count_miniatures_color,
            procent_miniatures_color: Number((req.body.count_miniatures_color * 100 / 
            req.body.count_miniatures).toFixed(2)),
        })
        
        const miniature = await miniatureDoc.save()

        res.status(200).json({miniature})
    }
    catch(err){
        res.status(500).json({...err})
    }
}

export const miniatures_edit = async(req,res) => {
    try{
        const miniature_edit = await MiniatureModel.findByIdAndUpdate(req.params.id, {
            miniature_name: req.body.miniature_name,
            date_buy_miniature: req.body.date_buy_miniature,
            price_miniature: req.body.price_miniature,
            collection_miniature: req.body.collection_miniature,
            count_miniatures: req.body.count_miniatures,
            count_miniatures_color: req.body.count_miniatures_color,
            procent_miniatures_color: Number((req.body.count_miniatures_color * 100 / 
            req.body.count_miniatures).toFixed(2)),
        })
    
            res.status(200).json({
                miniature_edit,
            })
    }
    catch(err){
        res.status(500).json({...err})
    }
}

export const miniatures_delete = async(req,res) => {
    try{
        const deleteMiniature = await MiniatureModel.findByIdAndDelete(req.params.id)
            if(!deleteMiniature) {
                return res.status(404).send({
                    message: 'Такой миниатюры нет'
                })
            }

        res.status(200).json({deleteMiniature})
    }
    catch(err){
        res.status(500).json({...err})
    }
}