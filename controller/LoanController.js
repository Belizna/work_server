import LoanModel from "../models/Loan.js";

export const loan_add = async(req,res) => {
    try{

        const loanDoc = new LoanModel({
            summ_loan: req.body.summ_loan,
            bank: req.body.bank,
        })

        const loan = await loanDoc.save()

        res.status(200).json({loan})
}
catch(err){
    res.status(500).json({...err})
}
}

export const loan_get = async(req,res) => {
    try{

        const loan = await LoanModel.find().sort({'_id': -1})

        var summLoans = 0

        loan.map( l => summLoans+= l.summ_loan)

        res.status(200).json({loan, summLoans})
    }
    catch(err){
        res.status(500).json({...err})
    }
}

export const loan_edit = async(req,res) => {
    try{

        const loan = await LoanModel.findByIdAndUpdate(req.params.id, 
            {
                summ_loan: req.body.summ_loan,
                bank: req.body.bank,
            })

        res.status(200).json({loan})
    }
    catch(err){
        res.status(500).json({...err})
    }
}

export const loan_delete = async(req,res) => {
    try{

        const deleteloan = await LoanModel.findByIdAndDelete(req.params.id)
            if(!deleteloan) {
                return res.status(404).send({
                    message: 'Такого займа не найдено'
                })
            }

        res.status(200).json({deleteloan})
    }
    catch(err){
        res.status(500).json({...err})
    }
}