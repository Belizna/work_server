import WriteBooksModel from "../models/WriteBooks.js";
import PulseModel from "../models/Pulse.js"

export const get_write_books = async (req, res) => {
    try{
        const write_books = await WriteBooksModel.find({
            compilation: req.params.book_name})

        if(!write_books) {
            return res.status(404).send({
                message:'Книги не найдены'
            })
        }
        
        res.status(200).json({
            write_books
        })
    }
    catch(err) {
        res.status(500).json({
            err
        })
    }
}

export const edit_write_books = async (req, res) => {
    try {

        const book = await WriteBooksModel.findById(req.params.id)

        if(book.presence === 'Не Прочитано' && req.body.presence === 'Прочитано')
        {
            const pulseDoc = new PulseModel({
                date_pulse: Date.now(),
                name_pulse: req.body.book_name,
                category_pulse: 'books'
            })
            
            await pulseDoc.save()
        }

        const write_books_edit = await WriteBooksModel.
        findByIdAndUpdate(req.params.id, {
            book_name: req.body.book_name,
            format: req.body.format,
            collection_book: req.body.collection_book,
            presence: req.body.presence
        })

        res.status(200).json({
            write_books_edit
        })

    }catch(err) {
        res.status(500).json({
            err
        })
    }
}

export const add_write_books = async (req, res) => {
    try {
        const write_books_doc = new WriteBooksModel({

            book_name: req.body.book_name,
            format: req.body.format,
            collection_book: req.body.collection_book,
            presence: req.body.presence,
            compilation: req.params.book_name,
        })

        const writeBooks = await write_books_doc.save()

        res.status(200).json({
            writeBooks
        })
    }
    catch(err) {
        res.status(500).json({
            err
        })
    }
}

export const delete_write_books = async (req, res) => {
    try {
        const deleteWriteBooks = await WriteBooksModel.
        findByIdAndDelete(req.params.id)

        res.status(200).json({
            deleteWriteBooks
        })
    }
    catch(err) {
        res.status(500).json({
            err
        })
    }
}