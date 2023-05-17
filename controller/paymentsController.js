import {validationResult} from 'express-validator'
import PaymentsModel from '../models/Payments.js'

export const get_payments = async (req,res) => {
    try {
            const payments = await PaymentsModel.find().sort({'_id': 1})
            if(!payments)
            {
                return res.status(404).send({
                    message:"Платежи не найдены"
                })
            }
            else {
                return res.status(200).json({
                    payments
                })
            }
    }
    catch(err)
    {
        res.status(400).json({
            err
        })
    }
}

export const update_payment = async (req, res) => {
    try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array())
            }
            const updatePayments = await PaymentsModel.
            findByIdAndUpdate(req.params.id, {
                date_payment: req.body.date_payment,
                summ_payment: req.body.summ_payment,
                status_payment: req.body.status_payment  
            })
            res.json({
                updatePayments
            })
    }
    catch(err) {
        res.status(500).json({
            err
        })
    }
}


export const delete_payment = async (req,res) => {
    try {
            const deletePayments = await PaymentsModel.
            findByIdAndDelete(req.params.id)
            if(!deletePayments) {
                return res.status(404).send({
                    message: 'Такого платежа нет'
                })
            }
            res.json({
                deletePayments
            })
    }
    catch(err){
        res.status(500).json({
            err
        })
    }
}