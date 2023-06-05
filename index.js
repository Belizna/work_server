import express from 'express'
import mongoose from 'mongoose'
import {validationResult} from 'express-validator'
import moment from 'moment/moment.js'
import cors from 'cors'

import { creditCreateValidator } from './validations/credit.js'
import { registerValidator } from './validations/auth.js'
import { paymentCreateValidator } from './validations/payments.js'
import { earlyPaymentsEditValidator } from './validations/earlypayments.js'
import { bookCreateValidator } from './validations/book.js'

import CreditModel from './models/Credit.js'
import PaymentsModel from './models/Payments.js'
import EarlyPaymentsModel from './models/EarlyPayments.js'
import BookModel from './models/Book.js'

import { register, login, me } from './controller/authController.js'
import { delete_payment, get_payments, update_payment } from './controller/paymentsController.js'
import { get_early_payment, add_early_payment,edit_early_payment,delete_early_payment  } from './controller/earlyPaymentsController.js'
import { get_heresy_books,edit_heresy_books,delete_heresy_books,add_heresy_books } from './controller/heresy_horusConstroller.js'

import CheckAuth from './utils/CheckAuth.js'

mongoose.connect("mongodb+srv://MuadDib:Qwerty123qwerty@cluster0.a7edzkp.mongodb.net/dshb?retryWrites=true&w=majority",
{useNewUrlParser: true})
.then(()=> console.log('db connection'))
.catch((err) => console.log('error db connection', err))

const app = express();
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
 
});

app.post('/credit/create/', creditCreateValidator, async (req, res) => {

    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        
        const creditDoc =  new CreditModel({
            credit_name : req.body.credit_name,
            summ_credit : req.body.summ_credit,
            date_credit : req.body.date_credit,
            percent : req.body.percent,
            term : req.body.term,
            duty: req.body.duty
        })

        const credit = await creditDoc.save();

        const payment = (req.body.summ_credit * (req.body.percent / (100*12) / (1 - Math.pow((1+(req.body.percent / (100*12))), -req.body.term)))).toFixed(2)

        var arr = [];

        for (var i = 1; i < req.body.term + 1; i++)
        {
            arr.push({date_payment: moment(req.body.date_credit, 'DD-MM-YYYY').add(i, 'M').format('DD-MM-YYYY'),
            summ_payment: payment,
            status_payment: 'Не оплачено',
            Pcredit_name: req.body.credit_name})
        }
        
        //PaymentsModel.insertMany(arr)
        //.then(() => console.log('Payments created'))
        //.catch(err => console.log('Error' + err))

        res.json({
            ...credit._doc
        })
    }
    catch(err){
        res.status(500).json({
            err
        })
    }

})


app.get('/credit/early_payment/', get_early_payment)
app.post('/credit/early_payment/' , earlyPaymentsEditValidator , add_early_payment)
app.patch('/credit/early_payment/:id', earlyPaymentsEditValidator, edit_early_payment )
app.delete('/credit/early_payment/:id', delete_early_payment)


app.get('/carts/static', async (req,res) => {
    //const early = await EarlyPaymentsModel.aggregate([{$group: {_id:null, sum: {$sum : "$summ_earlyPayment"}}}])
    const payments = await PaymentsModel.find()
    const earlyPay = await EarlyPaymentsModel.find()
    const credit = await CreditModel.find()

    var paid_fix = 0;
    var remainder = 0;
    var count_month_paid = 0
    var early_sum = 0


    for(var i = 0; i < earlyPay.length; i++)
    {
        early_sum += earlyPay[i].summ_earlyPayment
    }

    for(var i = 0; i < payments.length; i++)
    {
        if(payments[i].status_payment === 'Оплачено') {
            paid_fix+=payments[i].summ_payment;
            count_month_paid++;
        } else remainder+=payments[i].summ_payment
    }

    const procentStatic = ((paid_fix*100) /(paid_fix+remainder)).toFixed(4)
    const count_month_remainder = payments.length - count_month_paid
    const saving = Number((credit[0].duty - (remainder + paid_fix + early_sum)).toFixed(2))
    const overpayment = Number((credit[0].duty - (credit[0].summ_credit + saving)).toFixed(2))
    const paid=  Number((paid_fix).toFixed(2))

    res.status(200).send({
        paid,
        remainder,
        procentStatic,
        count_month_paid,
        count_month_remainder,
        saving,
        overpayment,
        early_sum
    })
})

app.get('/books/heresy_horus/:book_name', get_heresy_books)
app.post('/books/heresy_horus/add/:book_name', bookCreateValidator, add_heresy_books) 
app.patch('/books/heresy_horus/edit/:id', bookCreateValidator, edit_heresy_books)
app.delete('/books/heresy_horus/delete/:id', delete_heresy_books)


app.get('/credit/payments', get_payments)
app.patch('/credit/payments/:id', paymentCreateValidator, update_payment)
app.delete('/credit/payments/:id', delete_payment)


app.post('/auth/register/', registerValidator, register);
app.post('/auth/login/', registerValidator, login)
app.get('/auth/me/', CheckAuth, me)

app.listen(8080, (err)=> {
    if(err) {
        return console.log(err)
    }
    else console.log('Server run')
})

