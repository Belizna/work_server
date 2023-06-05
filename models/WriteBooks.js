import mongoose from "mongoose";


const WriteBooksSchema = new mongoose.Schema({
    book_name :{
        type: String,
        required: true,
        unique: true
    },
    format: {
        type: String,
    },
    collection_book: {
        type: String,
    },
    presence: {
        type: String,
        required: true
    },
    compilation:
    {
        type: String,
        required: true
    }
})

export default mongoose.model('WriteBooks', WriteBooksSchema);
