import GamesModel from '../models/Games.js'
import PulseModel from '../models/Pulse.js'

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
        
        const games = await GamesModel.findById(req.params.id)
        
        if(games.presence === 'Не Пройдено' && req.body.presence === 'Пройдено')
        {
            const pulseDoc = new PulseModel({
                date_pulse: Date.now(),
                name_pulse: req.body.game_name,
                category_pulse: 'games',
                time_pulse: req.body.time_game

            })
            
            await pulseDoc.save()
        }

        const libraryGames = await GamesModel.findByIdAndUpdate(req.params.id, {
            game_name : req.body.game_name,
            summ_game: req.body.summ_game,
            compilation:req.body.compilation,
            date_game :((req.body.date_game).substr(0, 10)).split("-").reverse().join("-"),
            presence: req.body.presence,
            time_game: Number(req.body.time_game)
        })

        res.status(200).json({
            libraryGames,
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
            presence: req.body.presence,
            time_game: req.body.time_game
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