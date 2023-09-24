import GamesModel from '../models/Games.js'

export const delete_games = async (req,res) => {
    try {
        const delete_games = await GamesModel.
        findByIdAndDelete(req.params.id)

        res.status(200).json({delete_games})
        
    }catch(err) {
        res.status(500).json({
            err
        })
}
}

export const edit_games = async(req,res) => {
    try {

        const libraryGames = await GamesModel.findByIdAndUpdate(req.params.id, {
            game_name : req.body.game_name,
            summ_game: req.body.summ_game,
            compilation:req.body.compilation,
            date_game :((req.body.date_game).substr(0, 10)).split("-").reverse().join("-"),
            presence: req.body.presence
        })

        res.status(200).json({
            libraryGames
        })

    }catch(err) {
        res.status(500).json({
            err
        })
    }
}

export const add_games = async(req,res) => {
    try {

        const libraryGamesdoc = new GamesModel({
            game_name : req.body.game_name,
            summ_game: req.body.summ_game,
            compilation:req.body.compilation,
            date_game :((req.body.date_game).substr(0, 10)).split("-").reverse().join("-"),
            presence: req.body.presence
        })

        const libraryGames = await libraryGamesdoc.save()

        res.status(200).json({
            libraryGames
        })

    }catch(err) {
        res.status(500).json({
            err
        })
    }
}

export const get_games =  async (req,res) => {
    try {
        const libraryGames = await GamesModel.find({
            compilation: req.params.library_name
        })

        if(!libraryGames)
        {
            return res.status(404).send({message: 'Игр не найдено'})
        }

        res.status(200).json({
            libraryGames
        })
    }
    catch(err) {
        res.status(500).json({
            err
        })
    }
}