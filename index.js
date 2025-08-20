import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

import { registerValidator } from './validations/auth.js'

import { register, login, me } from './controller/authController.js'
import { assignment_add, assignment_get, assignment_edit, assignment_delete } from './controller/assignmentController.js'

import CheckAuth from './utils/CheckAuth.js'

dotenv.config()

mongoose.connect(process.env.MONGODB_URI,
    { useNewUrlParser: true, minPoolSize: 10 })
    .then(() => console.log('db connection'))
    .catch((err) => console.log('error db connection', err))

const app = express();
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).json(
        'server run'
    )
});

app.post('/assignment/add/:assignment_employee', assignment_add);
app.get('/assignment/:assignment_employee', assignment_get)
app.delete('/assignment/delete/:id', assignment_delete);
app.patch('/assignment/edit/:id', assignment_edit)

app.post('/auth/register/', registerValidator, register);
app.post('/auth/login/', registerValidator, login)
app.get('/auth/me/', CheckAuth, me)

app.listen(process.env.PORT || 8080, (err) => {
    if (err) {
        return console.log(err)
    }
    else {
        console.log('Server run')
    }
})

