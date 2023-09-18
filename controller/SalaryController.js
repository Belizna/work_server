import SalaryModel from "../models/Salary.js";

export const salary_add = async(req,res) => {
    try{

        const salaryDoc = new SalaryModel({
            date_salary: req.body.date_salary,
            summ_salary: req.body.summ_salary,
            company: req.body.company,
        })
        
        const salary = await salaryDoc.save()

        res.status(200).json({salary})
}
catch(err){
    res.status(500).json({...err})
}
}

export const salary_get = async(req,res) => {
    try{

        const salary = await SalaryModel.find().sort({'_id': -1})

        res.status(200).json({salary})
    }
    catch(err){
        res.status(500).json({...err})
    }
}

export const salary_edit = async(req,res) => {
    try{

        const salary = await SalaryModel.findByIdAndUpdate(req.params.id, 
            {
                date_salary: req.body.date_salary,
                summ_salary: req.body.summ_salary,
                company: req.body.company,
            })

        res.status(200).json({salary})
    }
    catch(err){
        res.status(500).json({...err})
    }
}

export const salary_delete = async(req,res) => {
    try{

        const deleteSalary = await SalaryModel.findByIdAndDelete(req.params.id)
            if(!deleteSalary) {
                return res.status(404).send({
                    message: 'Такого платежа нет'
                })
            }

        res.status(200).json({deleteSalary})
    }
    catch(err){
        res.status(500).json({...err})
    }
}