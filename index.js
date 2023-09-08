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
import BonusModel from './models/Bonus.js'
import NormaModel from './models/Norma_time.js'
import SalaryModel from './models/Salary.js'

import { register, login, me } from './controller/authController.js'
import { delete_payment, get_payments, update_payment } from './controller/paymentsController.js'
import { get_early_payment, add_early_payment,edit_early_payment,delete_early_payment  } from './controller/earlyPaymentsController.js'
import { get_heresy_books,edit_heresy_books,delete_heresy_books,add_heresy_books } from './controller/heresy_horusConstroller.js'
import { delete_games, edit_games,add_games,get_games } from './controller/gamesController.js'
import { book_static, credit_static, games_static } from './controller/chartsController.js'
import { get_write_books, edit_write_books, add_write_books, delete_write_books } from './controller/writeBooksController.js'

import CheckAuth from './utils/CheckAuth.js'

mongoose.connect(process.env.MONGO_CONNECTION_STRING,
{useNewUrlParser: true})
.then(()=> console.log('db connection'))
.catch((err) => console.log('error db connection', err))

const app = express();
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
 
});

app.get('/norma_time/', async(req,res) => {
    const norma = await NormaModel.find()

    res.json(norma)
})

app.post('/norma_time/', async(req,res) => {
    const normaDoc = new NormaModel({
        month_norma: req.body.month_norma,
        time_norma: req.body.time_norma
    })

    const norma = await normaDoc.save()

    res.json(norma)
})


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

app.get('/weekend/bonus/', async(req,res) => {
    try{
        const bonus = await BonusModel.find().sort({'_id' : -1})

        res.status(200).json({bonus})
    }
    catch(err){
        res.status(500).json({...err})
    }
})

app.post('/weekend/bonus/add', async(req,res) => {
    try{
        const zp = 160000
    const norma_time = await NormaModel.find({month_norma: (req.body.date_bonus).substr(3, 7) })

    const bonusDoc = new BonusModel({
        date_bonus: req.body.date_bonus,
        time_bonus: req.body.time_bonus,
        summ_bonus: (zp/norma_time[0].time_norma * 2 * req.body.time_bonus).toFixed(2),
        status_bonus: req.body.status_bonus
    })

    const bonus = await bonusDoc.save()

        res.status(200).json({
            bonus,
        })
    }
    catch(err){
        res.status(500).json({...err})
    }
})

app.delete('/weekend/bonus/delete/:id', async(req,res) => {
    try{

        const deleteBonus = await BonusModel.findByIdAndDelete(req.params.id)
            if(!deleteBonus) {
                return res.status(404).send({
                    message: 'Такой выплаты нет'
                })
            }

        res.status(200).json({deleteBonus})
    }
    catch(err){
        res.status(500).json({...err})
    }
})

app.patch('/weekend/bonus/edit/:id', async(req,res) => {
    try{
        const zp = 130000
        const norma_time = await NormaModel.find({month_norma: (req.body.date_bonus).substr(3, 7) })

        const bonus_edit = await BonusModel.findByIdAndUpdate(req.params.id, {
        date_bonus: req.body.date_bonus,
        time_bonus: req.body.time_bonus,
        summ_bonus: (zp/norma_time[0].time_norma * 2 * req.body.time_bonus).toFixed(2),
        status_bonus: req.body.status_bonus
    })

        res.status(200).json({
            bonus_edit,
        })
    }
    catch(err){
        res.status(500).json({...err})
    }
})


app.post('/weekend/salary/add', async(req,res) => {
    try{

        const salaryDoc = new SalaryModel({
            date_salary: req.body.date_salary,
            summ_salary: req.body.summ_salary,
            company: req.body.company,
        })
        
        const salary = await salaryDoc.save()

        res.status(200).json({salary})
}
catch(err){
    res.status(500).json({...err})
}
})
app.get('/weekend/work/charts', async(req,res) => {
    try{
            const salary_year = await SalaryModel.aggregate([
            {$group: {_id: { $substr : ["$date_salary",6,4]},
            sum: {$sum: "$summ_salary"}}}])

            const salary_company = await SalaryModel.aggregate([
                {$group: {_id: "$company",
                sum: {$sum: "$summ_salary"}}}])

            const salary_month = await SalaryModel.find()

            const bonus_month = await BonusModel.aggregate([
                {$group: {_id: { $substr : ["$date_bonus",3,7]},
                sum: {$sum: "$summ_bonus"}}}])

                const bonus_year = await BonusModel.aggregate([
                    {$group: {_id: { $substr : ["$date_bonus",6,4]},
                    sum: {$sum: "$summ_bonus"}}}])

        res.status(200).json({salary_year,salary_company,salary_month,bonus_month,bonus_year})
    }
    catch(err){
        res.status(500).json({...err})
    }
})
app.get('/weekend/salary', async(req,res) => {
    try{

        const salary = await SalaryModel.find().sort({'_id': -1})

        res.status(200).json({salary})
    }
    catch(err){
        res.status(500).json({...err})
    }
})
app.patch('/weekend/salary/edit/:id', async(req,res) => {
    try{

        const salary = await SalaryModel.findByIdAndUpdate(req.params.id, 
            {
                date_salary: req.body.date_salary,
                summ_salary: req.body.summ_salary,
                company: req.body.company,
            })

        res.status(200).json({salary})
    }
    catch(err){
        res.status(500).json({...err})
    }
})
app.delete('/weekend/salary/delete/:id', async(req,res) => {
    try{

        const deleteSalary = await SalaryModel.findByIdAndDelete(req.params.id)
            if(!deleteSalary) {
                return res.status(404).send({
                    message: 'Такого платежа нет'
                })
            }

        res.status(200).json({deleteSalary})
    }
    catch(err){
        res.status(500).json({...err})
    }
})

app.get('/credit/early_payment/', get_early_payment)
app.post('/credit/early_payment/' , earlyPaymentsEditValidator , add_early_payment)
app.patch('/credit/early_payment/:id', earlyPaymentsEditValidator, edit_early_payment )
app.delete('/credit/early_payment/:id', delete_early_payment)

app.get('/books/static/:book_name', book_static)
app.get('/carts/static', credit_static)
app.get('/games/static', games_static)

app.get('/books/heresy_horus/:book_name', get_heresy_books)
app.post('/books/heresy_horus/add/:book_name', bookCreateValidator, add_heresy_books) 
app.patch('/books/heresy_horus/edit/:id', bookCreateValidator, edit_heresy_books)
app.delete('/books/heresy_horus/delete/:id', delete_heresy_books)

app.get('/credit/payments', get_payments)
app.patch('/credit/payments/:id', paymentCreateValidator, update_payment)
app.delete('/credit/payments/:id', delete_payment)

app.get('/books/write_books/:book_name', get_write_books)
app.patch('/books/write_books/edit/:id', edit_write_books)
app.post('/books/write_books/add/:book_name', add_write_books)
app.delete('/books/write_books/delete/:id', delete_write_books)

app.get('/games/library/:library_name',get_games)
app.post('/games/library/add', add_games)
app.patch('/games/library/edit/:id', edit_games)
app.delete('/games/library/delete/:id', delete_games)


app.post('/auth/register/', registerValidator, register);
app.post('/auth/login/', registerValidator, login)
app.get('/auth/me/', CheckAuth, me)

app.listen(process.env.PORT || 8080, (err)=> {
    if(err) {
        return console.log(err)
    }
    else console.log('Server run')
})

