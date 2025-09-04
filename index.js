import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

import { registerValidator } from './validations/auth.js'

import { register, login, me } from './controller/authController.js'
import { assignment_add, assignment_get, assignment_edit, assignment_delete } from './controller/assignmentController.js'
import { daily_add, daily_get, daily_edit, daily_delete } from './controller/dailyController.js'
import { meeting_add, meeting_get, meeting_edit, meeting_delete } from './controller/meetingController.js'
import { meetingCalendar_add, meetingCalendar_get, meetingCalendar_edit, meetingCalendar_delete } from './controller/meetingCalendarController.js'
import { gantt_get, gantt_edit, gantt_add } from './controller/ganttController.js'

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

app.get('/gantt/:assignment_employee', gantt_get)
app.patch('/gantt/edit/:id', gantt_edit)
app.post('/gantt/add/:assignment_employee', gantt_add);

app.post('/daily/add', daily_add);
app.get('/daily', daily_get)
app.delete('/daily/delete/:id', daily_delete);
app.patch('/daily/edit/:id', daily_edit)

app.post('/meeting/add', meeting_add);
app.get('/meeting', meeting_get)
app.delete('/meeting/delete/:id', meeting_delete);
app.patch('/meeting/edit/:id', meeting_edit)

app.post('/meetingCalendar/add', meetingCalendar_add);
app.get('/meetingCalendar', meetingCalendar_get)
app.delete('/meetingCalendar/delete/:id', meetingCalendar_delete);
app.patch('/meetingCalendar/edit/:id', meetingCalendar_edit)

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

