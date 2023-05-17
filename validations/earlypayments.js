import {body} from 'express-validator';

export const earlyPaymentsEditValidator = [
    body('date_earlyPayment').isLength({max:10, min:10}),
    body('summ_earlyPayment').isFloat()
]