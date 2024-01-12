import BookModel from "../models/Book.js"
import PulseModel from "../models/Pulse.js"

export const get_heresy_books = async (req,res) => {
    try {
        
        const books = await BookModel.find({compilation: req.params.book_name})

        if(!books) {
            return res.status(404).send({
                message: 'Книги не найдены'
            })
        }

        res.status(200).json({
            books
        })
    }
    catch(err) {
        res.status(500).json({
            err
        }) 
    }
}

export const edit_heresy_books = async (req,res) => {
    try{

        const book = await BookModel.findById(req.params.id)

        if (req.body.presence === 'Есть' && book.presence ==='Нет') {
            const pulseDoc = new PulseModel({
                date_pulse: Date.now(),
                name_pulse: req.body.book_name,
                category_pulse: 'books_price',
                sum_pulse: req.body.summ_book
            })
            
            await pulseDoc.save()
        }

        const book_edit = await BookModel
        .findByIdAndUpdate(req.params.id, {
            book_name : req.body.book_name,
            summ_book : req.body.summ_book,
            presence : req.body.presence,
        })
        res.status(200).json({
            book_edit
        })
}
catch(err) {
    res.status(500).json({
        err
    })
}
}

export const delete_heresy_books = async (req,res) => {
    try{
        const deleteBooks = await BookModel.
        findByIdAndDelete(req.params.id)

        if(!deleteBooks) {
            return res.status(404).send({
                message:"Книга не найдена"
            })
        }

        return res.status(200).json({
            deleteBooks
        })

    }catch(err) {
        res.status(500).json({
            err
        })
    }
}

export const add_heresy_books = async (req,res) => {
    try{

        if (req.body.presence === 'Есть') {
            const pulseDoc = new PulseModel({
                date_pulse: Date.now(),
                name_pulse: req.body.book_name,
                category_pulse: 'books_price',
                sum_pulse: req.body.summ_book
            })
            
            await pulseDoc.save()
        }

        const bookDoc= new BookModel({
            book_name : req.body.book_name,
            summ_book : req.body.summ_book,
            presence : req.body.presence,
            compilation: req.params.book_name
        })

        const book = await bookDoc.save()

        res.status(200).json({
            ...book._doc
        })
    }
    catch(err) {
        res.status(500).json({
            err
        })
    }
}