import express from 'express'
import mongoose from 'mongoose'
import {validationResult} from 'express-validator'
import moment from 'moment/moment.js'
import cors from 'cors'
import dotenv from 'dotenv'

import { creditCreateValidator } from './validations/credit.js'
import { registerValidator } from './validations/auth.js'
import { paymentCreateValidator } from './validations/payments.js'
import { earlyPaymentsEditValidator } from './validations/earlypayments.js'
import { bookCreateValidator } from './validations/book.js'

import CreditModel from './models/Credit.js'

import { register, login, me } from './controller/authController.js'
import { delete_payment, get_payments, update_payment } from './controller/paymentsController.js'
import { get_early_payment, add_early_payment,edit_early_payment,delete_early_payment  } from './controller/earlyPaymentsController.js'
import {other_books_add,other_books_get,other_books_edit,other_books_delete} from './controller/OrherBooksController.js'
import { get_heresy_books, edit_heresy_books,delete_heresy_books,add_heresy_books } from './controller/heresy_horusConstroller.js'
import { delete_games, edit_games,add_games,get_games } from './controller/gamesController.js'
import { book_static, credit_static, games_static, salary_chart, hobby_static, main_static } from './controller/chartsController.js'
import { get_write_books, edit_write_books, add_write_books, delete_write_books } from './controller/writeBooksController.js'
import { bonus_get , bonus_add, bonus_delete, bonus_edit } from './controller/weekendController.js'
import { salary_add, salary_delete, salary_edit, salary_get } from './controller/SalaryController.js'
import { miniatures_get,miniatures_add, miniatures_edit, miniatures_delete} from './controller/miniaturesController.js'
import { colors_add, colors_get, colors_edit, colors_delete } from './controller/colorController.js'
import { repair_add, repair_get, repair_edit, repair_delete } from './controller/repaircontroller.js'

import CheckAuth from './utils/CheckAuth.js'

dotenv.config()

mongoose.connect(process.env.MONGO_CONNECTION_STRING,
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

app.get('/hobby/miniatures/',miniatures_get)
app.post('/hobby/miniatures/add', miniatures_add)
app.patch('/hobby/miniatures/edit/:id', miniatures_edit)
app.delete('/hobby/miniatures/delete/:id', miniatures_delete)

app.get('/hobby/colors/',colors_get)
app.post('/hobby/colors/add', colors_add)
app.patch('/hobby/colors/edit/:id', colors_edit)
app.delete('/hobby/colors/delete/:id', colors_delete)

app.get('/repair/outlay/',repair_get)
app.post('/repair/outlay/add', repair_add)
app.patch('/repair/outlay/edit/:id', repair_edit)
app.delete('/repair/outlay/delete/:id', repair_delete)

app.get('/weekend/bonus/',bonus_get)
app.post('/weekend/bonus/add', bonus_add)
app.patch('/weekend/bonus/edit/:id', bonus_edit)
app.delete('/weekend/bonus/delete/:id', bonus_delete)

app.get('/weekend/salary', salary_get)
app.post('/weekend/salary/add', salary_add)
app.patch('/weekend/salary/edit/:id', salary_edit)
app.delete('/weekend/salary/delete/:id', salary_delete)

app.get('/credit/early_payment/', get_early_payment)
app.post('/credit/early_payment/' , earlyPaymentsEditValidator , add_early_payment)
app.patch('/credit/early_payment/:id', earlyPaymentsEditValidator, edit_early_payment )
app.delete('/credit/early_payment/:id', delete_early_payment)

app.get('/books/static/:book_name', book_static)
app.get('/carts/static', credit_static)
app.get('/games/static', games_static)
app.get('/weekend/work/charts', salary_chart)
app.get('/hobby/static/', hobby_static)
app.get('/main/static/:year', main_static)


app.get('/books/heresy_horus/:book_name', get_heresy_books)
app.post('/books/heresy_horus/add/:book_name', bookCreateValidator, add_heresy_books) 
app.patch('/books/heresy_horus/edit/:id', bookCreateValidator, edit_heresy_books)
app.delete('/books/heresy_horus/delete/:id', delete_heresy_books)

app.get('/books/other_books', other_books_get)
app.post('/books/other_books/add', other_books_add) 
app.patch('/books/other_book/edit/:id', other_books_edit)
app.delete('/books/other_book/delete/:id', other_books_delete)

app.get('/credit/payments', get_payments)
app.patch('/credit/payments/:id', paymentCreateValidator, update_payment)
app.delete('/credit/payments/:id', delete_payment)

app.get('/books/write_books/:book_name', get_write_books)
app.post('/books/write_books/add/:book_name', add_write_books)
app.patch('/books/write_books/edit/:id', edit_write_books)
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

