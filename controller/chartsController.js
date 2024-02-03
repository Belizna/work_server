import 'core-js'
import BookModel from '../models/Book.js'
import PulseModel from '../models/Pulse.js'
import WriteBooksModel from '../models/WriteBooks.js'
import PaymentsModel from '../models/Payments.js'
import EarlyPaymentsModel from '../models/EarlyPayments.js'
import CreditModel from '../models/Credit.js'
import Games from '../models/Games.js'
import Book from '../models/Book.js'
import SalaryModel from '../models/Salary.js'
import BonusModel from '../models/Bonus.js'
import ColorModel from "../models/Color.js"
import MiniatureModel from "../models/Miniature.js"

export const book_static = async (req,res ) => {

    try {
        const write_books_novel = await WriteBooksModel.find({compilation: req.params.book_name, format : 'роман'})
    const write_books_story = await WriteBooksModel.find({compilation: req.params.book_name, format : 'рассказ'})
    const write_books_big_story = await WriteBooksModel.find({compilation: req.params.book_name,format : 'повесть' })

    const books = await Book.aggregate([{$match: {compilation: req.params.book_name}}, 
        {$group: {_id: null, count: {$sum : 1}, sum: {$sum: "$summ_book"}}}]) 

    const books_count = await Book.aggregate([{$match: {compilation: req.params.book_name, presence: 'Есть'}}, 
            {$group: {_id: null, count: {$sum: 1}}}]) 

    const books_summ = books[0]?.sum || 0
    const books_there_is_count = books_count[0]?.count || 0
    const books_all_there_is_count = books[0]?.count || 0

    var read_novel = 0
    var read_story = 0
    var read_big_story = 0
    var data_books_novel = []
    var data_books_story = []
    var data_books_big_story = []
    var dataDemoLine = []

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

    //рассказы
    if (write_books_story.length === 0) {
        data_books_story = null
    }else {
        data_books_story = [{type: 'Прочитано',value: read_story},
            {type: 'Осталось',value: not_read_story}];
        dataDemoLine.push({key: 'Рассказов',name: 'Всего',value: read_story + not_read_story},
          {key: 'Рассказов',name: 'Прочитано',value: read_story},
          {key: 'Рассказов',name: 'Осталось',value: not_read_story})    
    }
      //повесть
      if (write_books_big_story.length === 0){
            data_books_big_story = null
        }else {
            data_books_big_story = [{type: 'Прочитано',value: read_big_story},
        {type: 'Осталось',value: not_read_big_story}];
        dataDemoLine.push({key: 'Повестей',name: 'Всего',value: not_read_big_story + read_big_story},
          {key: 'Повестей',name: 'Прочитано',value: read_big_story},
          {key: 'Повестей',name: 'Осталось',value: not_read_big_story})
        }
//романы
    if (write_books_novel.length === 0){
        data_books_novel = null
    }else {
        data_books_novel = [{type: 'Прочитано',value: read_novel},
            {type: 'Осталось',value: not_read_novel}];
        dataDemoLine.push({key: 'Романов',name: 'Всего',value: not_read_novel + read_novel},
          {key: 'Романов',name: 'Прочитано',value: read_novel},
            {key: 'Романов',name: 'Осталось',value: not_read_novel})
    }

        dataDemoLine.push({key: 'Общее количество',name: 'Всего',value: read_all_books + not_read_all_books},
          {key: 'Общее количество',name: 'Прочитано',value: read_all_books},
          {key: 'Общее количество',name: 'Осталось',value: not_read_all_books})

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
            books_summ,
            books_there_is_count,
            books_all_there_is_count,
            data_books_novel,
            data_books_story,
            data_books_big_story, 
            dataDemoLine
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
        earlyPay
    })
    }
    catch(err)
    {
        res.status(500).json({...err})
    }
}

export const hobby_static = async (req, res) => {
    try{
        const miniatures = await MiniatureModel.aggregate([{$group: {_id: null, sum: {$sum: "$price_miniature"}}}]) 
        const color = await ColorModel.aggregate([{$group: {_id: null, sum: {$sum: "$summ_color"}}}]) 
        const count_miniatures = await MiniatureModel.aggregate([{$group: {_id: null, sum: {$sum: "$count_miniatures"}}}]) 
        const count_miniatures_color = await MiniatureModel.aggregate([{$group: {_id: null, sum: {$sum: "$count_miniatures_color"}}}]) 
        const procent_color_all = await MiniatureModel.aggregate([
            {$group: {_id: "$collection_miniature",
            sum_count: {$sum: "$count_miniatures"},
            sum_count_color: {$sum: "$count_miniatures_color"}
        }}])

        var test = []
        var columnHobby = []

        procent_color_all.map((obj) => test.push([{name : obj._id, type: 'Покрашено', value : obj.sum_count_color}, 
        {type: 'Осталось', name : obj._id,value : obj.sum_count -obj.sum_count_color }]))

        procent_color_all.map((obj) => columnHobby.push({key: obj._id, name: 'Всего', value: obj.sum_count},
        {key: obj._id, name: 'Покрашено', value: obj.sum_count_color},
        {key: obj._id, name: 'Осталось', value: obj.sum_count -obj.sum_count_color}))
        const summ_hobby = miniatures[0].sum + color[0].sum
        const summ_miniatures = miniatures[0].sum
        const summ_color = color[0].sum
        const procent_miniatures_colors = (count_miniatures_color[0].sum * 100 / count_miniatures[0].sum).toFixed(2)

        res.status(200).json({
            summ_hobby,
            summ_miniatures,
            summ_color,
            procent_miniatures_colors,
            test,
            columnHobby,
        })
    }
    catch(err)
    {
        res.status(500).json({...err})
    }
}

export const main_static = async (req, res) => {
    try{

            const diff = [`${req.params.year}-01`, `${req.params.year}-02`,`${req.params.year}-03`,`${req.params.year}-04`,`${req.params.year}-05`,
            `${req.params.year}-06`,`${req.params.year}-07`,`${req.params.year}-08`,`${req.params.year}-09`,`${req.params.year}-10`,
            `${req.params.year}-11`,`${req.params.year}-12`]
            let dataPieCount = [];
            let dataPiePrice = [];
            let games = []
            let games_date = []
            let books = []
            let books_date = []
            let miniature = []
            let miniature_date = []
            let payments = []
            let payments_date = []
            let salary = []
            let salary_date = []
            let sum_games_nowyear = 0
            let sum_books_nowyear = 0
            let sum_color_nowyear = 0
            let sum_miniatures_nowyear = 0
            let time_games_nowyear = 0
            let count_games_price = 0
            let count_miniatures_price = 0
            let summ_delta
            var books_pulse =[]
            var miniature_pulse =[]
            var games_pulse =[]
            var books_price_pulse =[]
            var games_price_pulse = []
            var miniatures_price_pulse = []
            var books_list_count = 0
            var books_price =[]
            var game_over = []
            var game_over_count = 0
            var books_write = []
            var books_write_count = 0
            let count_books_price = 0

            //покупка книг и количество
        const books_list_price  = await BookModel.aggregate([
            {$match: {presence: 'Нет'}},
            { $group : { 
                _id : "$compilation", children: { $push: {title: "$book_name"} }
                        } }
          ])
          books_list_price.map((obj) => books_price.push({title : obj._id, children: obj.children}))

          const books_list_price_count  = await BookModel.aggregate([
            {$match: {presence: 'Нет'}},
            { $group : { 
                _id : null, count : {$sum: 1}
                        } }
          ])
          books_list_count = books_list_price_count[0].count

          //пройти игр и количество
          const games_list  = await Games.aggregate([
            {$match: {presence: 'Не Пройдено'}},
            { $group : { 
                _id : "$compilation", children: { $push: {title: "$game_name"} }
                        } }
          ])
          games_list.map((obj) => game_over.push({title : obj._id, children: obj.children}))

          const games_list_count  = await Games.aggregate([
            {$match: {presence: 'Не Пройдено'}},
            { $group : { 
                _id : null, count : {$sum: 1}
                        } }
          ])
          game_over_count = games_list_count[0].count

          //прочитать книг и количество
          const books_write_list  = await WriteBooksModel.aggregate([
            {$match: {presence: 'Не Прочитано'}},
            { $group : { 
                _id : "$compilation", children: { $push: {title: "$book_name"} }
                        } }
          ])
          books_write_list.map((obj) => books_write.push({title : obj._id, children: obj.children}))

          const books_writes_count  = await WriteBooksModel.aggregate([
            {$match: {presence: 'Не Прочитано'}},
            { $group : { 
                _id : null, count : {$sum: 1}
                        } }
          ])
          books_write_count = books_writes_count[0].count


          //лист по движениям покрашено миниатюр, прочитано книг, пройдекно игр, приобретено игр
        const books_list  = await PulseModel.aggregate([
            {$match: { date_pulse: { $gte: new Date(`${req.params.year}-01-01T00:00:00.000Z`), 
                $lte: new Date(`${req.params.year}-12-31T23:59:59.000Z`)
            }}},
            { $group : { _id : "$category_pulse", children: { $push: {title: "$name_pulse"}}}}
          ])

        books_list.map((obj) => {obj._id === 'miniature' ? 
                miniature_pulse.push({title : 'Миниатюры', children: obj.children}) : 
                obj._id === 'games' ? games_pulse.push({title : 'Игры', children: obj.children}) :
                obj._id === 'books' ? books_pulse.push({title : 'Книги', children: obj.children}) :
                obj._id === 'books_price' ? books_price_pulse.push({title : 'Купленные книги', children: obj.children}) :
                console.log()
            })
            //заработок за год
            const salary_year = await SalaryModel.aggregate([
                {$match: { date_salary: {$regex: req.params.year}
            
            }},
                {
                    $group: {_id: {date_salary: {$substr : ["$date_salary",6,4]}},
                            sum: {$sum: "$summ_salary"},
                            }
            }
            ]) 
            //подработки за год
            const bonus_year = await BonusModel.aggregate([
                {$match: { date_bonus: {$regex: req.params.year}
            
            }},
                {
                    $group: {_id: {date_bonus: {$substr : ["$date_bonus",6,4]}},
                            sum: {$sum: "$summ_bonus"},
                            }
            }
            ]) 

            // заработок по месяцам в течение года
            

            //группировка из движений для формирования графиков по месяцам
            const pulse_group_charts = await PulseModel.aggregate([
                {$match: { date_pulse: { $gte: new Date(`${req.params.year}-01-01T00:00:00.000Z`), 
                $lte: new Date(`${req.params.year}-12-31T23:59:59.000Z`)
            }}},
                {
                    $group: {_id: {
                    category_pulse: "$category_pulse", date_pulse: {$substr : ["$date_pulse",0,7]}
                },
                sum: {$sum: 1},
                time_pulse: {$sum: "$time_pulse"}}
            }, {$sort: {_id: 1}}
            ])  
            const pulse_group_payments = await PulseModel.aggregate([
                {$match: { date_pulse: { $gte: new Date(`${req.params.year}-01-01T00:00:00.000Z`), 
                $lte: new Date(`${req.params.year}-12-31T23:59:59.000Z`)
            }}},
                {
                    $group: {_id: {
                    category_pulse: "$payments", date_pulse: {$substr : ["$date_pulse",0,7]}
                },
                count_pulse: {$sum: "$sum_pulse_credit"}}
            }, {$sort: {_id: 1}}
            ])

            const pulse_group_salary = await PulseModel.aggregate([
                {$match: { date_pulse: { $gte: new Date(`${req.params.year}-01-01T00:00:00.000Z`), 
                $lte: new Date(`${req.params.year}-12-31T23:59:59.000Z`)
            }}},
                {
                    $group: {_id: {
                    category_pulse: "$salary", date_pulse: {$substr : ["$date_pulse",0,7]}
                },
                count_pulse: {$sum: "$sum_pulse_salary"}}
            }, {$sort: {_id: 1}}
            ])
            
            const games_static = await Games.aggregate([
                {$match: { date_game: {$regex: req.params.year}
            
            }},
                {
                    $group: {_id: {
                    date_game: {$substr : ["$date_game",6,10]},
                },
                children: { $push: {title: "$game_name"}},
                sum: {$sum: "$summ_game"},
                count: {$sum: 1}},
            }, {$sort: {_id: 1}}
            ]) 

            games_static.map((obj) => 
            games_price_pulse.push({title : 'Купленные игры', children: obj.children}))

            const miniatures_static = await MiniatureModel.aggregate([
                {$match: { date_buy_miniature: {$regex: req.params.year}
            
            }},
                {
                    $group: {_id: {
                        date_buy_miniature: {$substr : ["$date_buy_miniature",6,10]}
                },
                children: { $push: {title: "$miniature_name"}},
                sum: {$sum: "$price_miniature"},
                count: {$sum: 1}}
            }, {$sort: {_id: 1}}
            ])  

            miniatures_static.map((obj) => 
            miniatures_price_pulse.push({title : 'Купленные миниатюры', children: obj.children}))

            const color_static = await ColorModel.aggregate([
                {$match: { date_buy_miniature: {$regex: req.params.year}
            
            }},
                {
                    $group: {_id: {
                        date_color: {$substr : ["$date_color",6,10]}
                },
                sum: {$sum: "$summ_color"},
            }
            }, {$sort: {_id: 1}}
            ]) 

            const books_static = await PulseModel.aggregate([
                {$match: 
                    {category_pulse: "books_price"}},
                {
                    $group: {_id: {date_books: {$substr : ["$date_pulse",0,4]}},
                            sum: {$sum: "$sum_pulse"},
                            count: {$sum: 1}
                            }
            }, {$sort: {_id: 1}}
            ]) 

            const early_payment = await EarlyPaymentsModel.aggregate([
                {$match: { date_earlyPayment: {$regex: req.params.year}
            
            }},
                {
                    $group: {_id: {date_earlyPayment: {$substr : ["$date_earlyPayment",6,10]}},
                            sum: {$sum: "$summ_earlyPayment"},
                            }
            }
            ]) 

            const payment = await PaymentsModel.aggregate([
                {$match: { date_payment: {$regex: req.params.year}, status_payment : "Оплачено"
            
            }},
                {
                    $group: {_id: {date_payment: {$substr : ["$date_payment",6,10]}},
                            sum: {$sum: "$summ_payment"},
                            }
            }
            ]) 

            books_static.forEach((obj) => {
                if (obj._id.date_books === req.params.year) {
                    sum_books_nowyear = obj.sum
                    count_books_price = obj.count
                }
            })

            games_static.forEach((obj) => {
                if (obj._id.date_game === req.params.year) {
                    sum_games_nowyear = obj.sum,
                    count_games_price = obj.count
                }
            })

            miniatures_static.forEach((obj) => {
                if (obj._id.date_buy_miniature === req.params.year) {
                    sum_miniatures_nowyear = obj.sum
                    count_miniatures_price = obj.count
                }
            })

            color_static.forEach((obj) => {
                if (obj._id.date_color === req.params.year) {
                    sum_color_nowyear = obj.sum
                }
            })

            pulse_group_payments.forEach((obj) => {
                payments.push({date_pulse: obj._id.date_pulse, count_pulse: obj.count_pulse})
                payments_date.push(obj._id.date_pulse)
            })

            pulse_group_salary.forEach((obj) => {
                salary.push({date_pulse: obj._id.date_pulse, count_pulse: obj.count_pulse})
                salary_date.push(obj._id.date_pulse)
            })

            for (let i = 0; i< pulse_group_charts.length; i ++)
            {
                if (pulse_group_charts[i]._id.category_pulse === 'games')
                {
                    games.push({date_pulse: pulse_group_charts[i]._id.date_pulse,count_pulse: pulse_group_charts[i].sum})
                    games_date.push(pulse_group_charts[i]._id.date_pulse)
                    time_games_nowyear+=pulse_group_charts[i].time_pulse
                }
                else if (pulse_group_charts[i]._id.category_pulse === 'books')
                {
                    books.push({date_pulse: pulse_group_charts[i]._id.date_pulse,count_pulse: pulse_group_charts[i].sum})
                    books_date.push(pulse_group_charts[i]._id.date_pulse)
                }
                else if (pulse_group_charts[i]._id.category_pulse === 'miniature')
                {
                    miniature.push({date_pulse: pulse_group_charts[i]._id.date_pulse,count_pulse: pulse_group_charts[i].sum})
                    miniature_date.push(pulse_group_charts[i]._id.date_pulse)
                }
                else continue
            }
            
            let diff_games = diff.filter(date => ! games_date.includes(date))
            diff_games.map((obj) => games.push({date_pulse: obj,count_pulse: 0}))

            let diff_books = diff.filter(date => ! books_date.includes(date))
            diff_books.map((obj) => books.push({date_pulse: obj,count_pulse: 0}))

            let diff_miniature = diff.filter(date => ! miniature_date.includes(date))
            diff_miniature.map((obj) => miniature.push({date_pulse: obj,count_pulse: 0}))

            let diff_payments = diff.filter(date => ! payments_date.includes(date))
            diff_payments.map((obj) => payments.push({date_pulse: obj,count_pulse: 0}))

            let diff_salary = diff.filter(date => ! salary_date.includes(date))
            diff_salary.map((obj) => salary.push({date_pulse: obj,count_pulse: 0}))

            let sortedGames = games.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
            let sortedBooks = books.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
            let sortedMiniatures = miniature.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
            let sortedPayments = payments.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
            let sortedSalary = salary.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)

            let summGames = 0
            sortedGames.forEach(x => {summGames+=x.count_pulse})

            let summBooks = 0
            sortedBooks.forEach(x => {summBooks+=x.count_pulse})

            let summMiniatures = 0
            sortedMiniatures.forEach(x => {summMiniatures+=x.count_pulse})

            let summPayments = 0
            sortedPayments.forEach(x => summPayments+=x.count_pulse)

            let summ_early_payment = 0
            early_payment.forEach(x => {summ_early_payment+=x.sum})

            let summ_payments = 0
            payment.forEach(x => summ_payments+=x.sum)

            let summ_salary_year = 0
            salary_year.forEach(x => summ_salary_year+=x.sum)

            let summ_bonus_year = 0
            bonus_year.forEach(x => summ_bonus_year+=x.sum)
            

            if (summ_salary_year === 0 && summ_bonus_year > 0)
                summ_salary_year += summ_bonus_year
            
            summ_salary_year - summ_bonus_year < 0 ? summ_delta = 0 : summ_delta = summ_salary_year - summ_bonus_year

            dataPieCount.push({type: 'Потрачено на игры', value: sum_games_nowyear},
            {type: 'Потрачено на хобби', value: sum_miniatures_nowyear+sum_color_nowyear},
            {type: 'Потрачено на книги', value: sum_books_nowyear})

            dataPiePrice.push({type: 'Пройдено игр', value: summGames},
            {type: 'Покрашено миниатюр', value: summMiniatures},
            {type: 'Прочитано книг', value: summBooks})

        res.status(200).json({
            sortedGames,
            sortedBooks,
            sortedMiniatures,
            sortedPayments,
            sortedSalary,
            summGames,
            summBooks,
            summMiniatures,
            summPayments,
            sum_games_nowyear,
            sum_miniatures_nowyear,
            sum_color_nowyear,
            sum_books_nowyear,
            time_games_nowyear,
            summ_early_payment,
            summ_payments,
            summ_salary_year,
            summ_bonus_year,
            summ_delta,
            count_books_price,
            count_games_price,
            count_miniatures_price,
            dataPieCount,
            dataPiePrice,
            miniature_pulse,
            books_pulse,
            games_pulse,
            games_price_pulse,
            books_price_pulse,
            miniatures_price_pulse,
            count_miniatures_price,
            books_price,
            books_list_count,
            game_over,
            game_over_count,
            books_write,
            books_write_count
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
    var summ_time_games = 0
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
        summ_time_games+=all_games[i].time_game
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
        summ_time_games,
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

                
            const salary_month = await SalaryModel.find().sort({'_id': 1})
            
            const bonus_month = await BonusModel.aggregate([
                {$group: {_id: { $substr : ["$date_bonus",3,7]},
                sum: {$sum: "$summ_bonus"}}},
                {$sort: {_id: -1}}])
                
                const bonus_year = await BonusModel.aggregate([
                    {$group: {_id: { $substr : ["$date_bonus",6,4]},
                    sum: {$sum: "$summ_bonus"}}}
                ])
                
                const bonus_not = await BonusModel.aggregate([{$match: {status_bonus: "Не Выплачено"}}, 
                    {$group: {_id: null, sum: {$sum: "$summ_bonus"}}}]) 

                    var summ_bonus = 0
                    bonus_not.length === 0 ? summ_bonus = 0 : summ_bonus = bonus_not[0].sum

                    res.status(200).json({salary_year,salary_company,
                    salary_month,bonus_month,bonus_year, summ_bonus})
            
    }
    catch(err){
        res.status(500).json({...err})
    }
}