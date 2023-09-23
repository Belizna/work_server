import WriteBooksModel from '../models/WriteBooks.js'
import PaymentsModel from '../models/Payments.js'
import EarlyPaymentsModel from '../models/EarlyPayments.js'
import CreditModel from '../models/Credit.js'
import Games from '../models/Games.js'
import Book from '../models/Book.js'
import SalaryModel from '../models/Salary.js'
import BonusModel from '../models/Bonus.js'

export const book_static = async (req,res ) => {

    try {
        const write_books_novel = await WriteBooksModel.find({compilation: req.params.book_name, format : 'роман'})
    const write_books_story = await WriteBooksModel.find({compilation: req.params.book_name, format : 'рассказ'})
    const write_books_big_story = await WriteBooksModel.find({compilation: req.params.book_name,format : 'повесть' })

    const books = await Book.aggregate([{$match: {compilation: req.params.book_name}}, 
        {$group: {_id: null, sum: {$sum: "$summ_book"}}}]) 

    const books_summ = books[0].sum

    var read_novel = 0
    var read_story = 0
    var read_big_story = 0

    for(var i = 0; i< write_books_novel.length; i++)
    {
        if (write_books_novel[i].presence=='Прочитано')
            read_novel++
        else continue
    }
    for(var i = 0; i< write_books_story.length; i++)
    {
        if (write_books_story[i].presence=='Прочитано')
            read_story++
        else continue
    }
    for(var i = 0; i< write_books_big_story.length; i++)
    {
        if (write_books_big_story[i].presence=='Прочитано')
            read_big_story++
        else continue
    }

    const procentStaticBooks = 
    Number(((read_novel+read_story+read_big_story)*100/
    (write_books_novel.length+write_books_story.length+write_books_big_story.length)).toFixed(2))

    const not_read_novel = write_books_novel.length - read_novel
    const not_read_big_story = write_books_big_story.length - read_big_story
    const not_read_story = write_books_story.length - read_story
    const all_books = write_books_big_story.length + write_books_novel.length+ write_books_story.length
    const read_all_books = read_big_story+read_novel+read_story
    const not_read_all_books = not_read_big_story+not_read_novel+not_read_story

    res.status(200).json({
            procentStaticBooks,
            not_read_novel,
            not_read_big_story,
            not_read_story,
            read_novel,
            read_story ,
            read_big_story,
            all_books,
            read_all_books,
            not_read_all_books,
            books_summ 
    })
    }
    catch(err)
    {
        res.status(500).json({...err})
    }
}

export const credit_static = async (req,res) => {

    try{
    const earlyPay = await EarlyPaymentsModel.find()
    const credit = await CreditModel.find()
    var early_sum = 0
    
    const payments = await PaymentsModel.aggregate([{$match: {status_payment: 'Оплачено'}}, 
        {$group: {_id: null, count_month_paid: { "$sum": 1 }, paid_fix: {$sum: "$summ_payment"}}}]) 

    const not_payments = await PaymentsModel.aggregate([{$match: {status_payment: 'Не оплачено'}}, 
        {$group: {_id: null, count_month_remainder: { "$sum": 1 }, remainder: {$sum: "$summ_payment"}}}]) 

    for(var i = 0; i < earlyPay.length; i++)
    {
        early_sum += earlyPay[i].summ_earlyPayment
    }

    const procentStatic = (((payments[0].paid_fix+early_sum)*100) /
    (payments[0].paid_fix+early_sum+not_payments[0].remainder)).toFixed(4)
    const count_month_remainder = not_payments[0].count_month_remainder
    const count_month_paid = payments[0].count_month_paid
    const saving = Number((credit[0].duty - (not_payments[0].remainder + payments[0].paid_fix + early_sum)).toFixed(2))
    const overpayment = Number((credit[0].duty - (credit[0].summ_credit + saving)).toFixed(2))
    const paid= Number((payments[0].paid_fix+early_sum).toFixed(2))
    const remainder = not_payments[0].remainder

    res.status(200).send({
        paid,
        remainder,
        procentStatic,
        count_month_paid,
        count_month_remainder,
        saving,
        overpayment,
        early_sum,
    })
    }
    catch(err)
    {
        res.status(500).json({...err})
    }
}

export const games_static = async (req,res) => {
    try {
        const games_steam = await Games.find({compilation: 'Steam'})
    const games_ubi = await Games.find({compilation: 'Ubisoft Connect'})
    var games_steam_not_passed = 0
    var games_ubi_not_passed = 0
    var all_games = games_steam.concat(games_ubi)
    var summ_all_games = 0
    for(var i = 0; i < games_steam.length; i++)
    {
        if (games_steam[i].presence == 'Не Пройдено'){
            games_steam_not_passed++
        }
    }
    for(var i = 0; i < games_ubi.length; i++)
    {
        if (games_ubi[i].presence == 'Не Пройдено'){
            games_ubi_not_passed++
        }
    }

    for(var i = 0; i < all_games.length; i++)
    {
        summ_all_games+=all_games[i].summ_game
    }

    const games_steam_passed = games_steam.length-games_steam_not_passed
    const games_ubi_passed = games_ubi.length-games_ubi_not_passed
    const games_not_all_passed = games_steam_not_passed + games_ubi_not_passed
    const games_all_passed = games_ubi.length+ games_steam.length - games_not_all_passed
    const games_all_steam = games_steam.length
    const games_ubi_steam = games_ubi.length
    const games_all_library = games_all_steam + games_ubi_steam
    const procentStaticGames  = Number(((games_steam_passed+games_ubi_passed) * 100 / (games_ubi.length+games_steam.length)).toFixed(2))
    
    res.status(200).send({
        games_steam_not_passed,
        games_steam_passed,
        games_ubi_not_passed,
        games_ubi_passed,
        games_not_all_passed,
        games_all_passed,
        games_all_steam,
        games_ubi_steam,
        games_all_library,
        procentStaticGames,
        summ_all_games,
    })
    }
    catch(err)
    {
        res.status(500).json({...err})
    }
}

export const salary_chart = async(req,res) => {
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
                sum: {$sum: "$summ_bonus"}}},
                {$sort: {_id: -1}}])

                const bonus_year = await BonusModel.aggregate([
                    {$group: {_id: { $substr : ["$date_bonus",6,4]},
                    sum: {$sum: "$summ_bonus"}}}
                ])

        res.status(200).json({salary_year,salary_company,
            salary_month,bonus_month,bonus_year})
    }
    catch(err){
        res.status(500).json({...err})
    }
}