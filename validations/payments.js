import {body} from 'express-validator';

export const paymentCreateValidator = [
    body('date_payment').isLength({min:10}),
    body('summ_payment').isFloat(),
    body('status_payment').isLength({max:12}),
]