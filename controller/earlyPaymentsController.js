import EarlyPaymentsModel from "../models/EarlyPayments.js";
import {validationResult} from 'express-validator'

export const get_early_payment = async(req,res) => {
    try {
        const early_payment = await EarlyPaymentsModel.find().sort({'_id': 1})
        
        if(!early_payment)
        {
            return res.status(404).send({
                message:"Досрочные платежи не найдены"
            })
        }

        res.status(200).json({
            early_payment
        })
    }
    catch(err) {
        res.status(500).json({
            err
        })
    }
}

export const add_early_payment = async(req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const EarlyPaymentsDoc = new EarlyPaymentsModel({
            date_earlyPayment : ((req.body.date_earlyPayment).substr(0, 10)).split("-").reverse().join("-"),
            summ_earlyPayment: req.body.summ_earlyPayment
        })

        const earlyPayments  = await EarlyPaymentsDoc.save()

        res.json({
            ...earlyPayments._doc
        })
    }
    catch(err){
        res.status(500).json({
            err
        })
    }
}

export const edit_early_payment = async (req,res) =>  {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        const earleUpdate = await EarlyPaymentsModel.findByIdAndUpdate
        (req.params.id, {
            date_earlyPayment : ((req.body.date_earlyPayment).substr(0, 10)).split("-").reverse().join("-"),
            summ_earlyPayment: req.body.summ_earlyPayment
        })
        if(!earleUpdate)
        {
            return res.status(404).send({message: "Не найден платеж на обновление"})
        }
        res.status(200).json({
            earleUpdate
        })

    }
    catch(err) {
        res.status(500).json({
            err
        })
    }
}


export const delete_early_payment =  async (req, res) => {
    try {
        const deleteEarlyPay = await EarlyPaymentsModel.
        findByIdAndDelete(req.params.id)
        if(!deleteEarlyPay)
        {
            return res.status(404).send({
                message:'Досрочный платеж не найден'
            })
        }

        res.json({
            deleteEarlyPay
        })

    }
    catch(err) {
        res.status(500).json({
            err
        })
    }
}