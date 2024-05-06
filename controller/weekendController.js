import BonusModel from "../models/Bonus.js";
import NormaModel from "../models/Norma_time.js"
import PulseModel from '../models/Pulse.js'

export const bonus_get = async(req,res) => {
    try{
        const bonus = await BonusModel.find().sort({'_id' : -1})

        res.status(200).json({bonus})
    }
    catch(err){
        res.status(500).json({...err})
    }
}

export const bonus_add = async(req,res) => {
    try{
        const zp = 230550
        const norma_time = await NormaModel.find({month_norma: (((req.body.date_bonus).substr(0, 10)).split("-").reverse().join("-")).substr(3, 7) })

    const bonusDoc = new BonusModel({
        date_bonus: ((req.body.date_bonus).substr(0, 10)).split("-").reverse().join("-"),
        time_bonus: req.body.time_bonus,
        summ_bonus: (zp/norma_time[0].time_norma * 2 * req.body.time_bonus).toFixed(2),
        status_bonus: req.body.status_bonus
    })
    const bonus = await bonusDoc.save()

    const pulseDoc = new PulseModel({
        date_pulse: new Date((req.body.date_bonus)),
        name_pulse: `Подработка за ${req.body.date_bonus}`,
        category_pulse: 'bonus',
        sum_pulse: (zp/norma_time[0].time_norma * 2 * req.body.time_bonus).toFixed(2),
        id_object: bonus._id.toString()
    })
    
    await pulseDoc.save()

        res.status(200).json({
            bonus,
        })
    }
    catch(err){
        res.status(500).json({...err})
    }
}

export const bonus_delete = async(req,res) => {
    try{

        const deleteBonus = await BonusModel.findByIdAndDelete(req.params.id)
            if(!deleteBonus) {
                return res.status(404).send({
                    message: 'Такой выплаты нет'
                })
            }

            await PulseModel.deleteMany({id_object: req.params.id})
        res.status(200).json({deleteBonus})
    }
    catch(err){
        res.status(500).json({...err})
    }
}

export const bonus_edit = async(req,res) => {
    try{
        const zp = 230550
        const norma_time = await NormaModel.find({month_norma: (((req.body.date_bonus).substr(0, 10)).split("-").reverse().join("-")).substr(3, 7) })

        const bonus_edit = await BonusModel.findByIdAndUpdate(req.params.id, {
        date_bonus: ((req.body.date_bonus).substr(0, 10)).split("-").reverse().join("-"),
        time_bonus: req.body.time_bonus,
        summ_bonus: (zp/norma_time[0].time_norma * 2 * req.body.time_bonus).toFixed(2),
        status_bonus: req.body.status_bonus
    })

        await PulseModel.updateMany({id_object: req.params.id}, 
            {
                date_pulse: new Date((req.body.date_bonus)),
                name_pulse: `Подработка за ${req.body.date_bonus}`,
                sum_pulse: (zp/norma_time[0].time_norma * 2 * req.body.time_bonus).toFixed(2),
            })
        
            console.log(bonus_edit)

        res.status(200).json({
            bonus_edit,
        })
    }
    catch(err){
        res.status(500).json({...err})
    }
}