import BookModel from "../models/Book.js"
import PulseModel from "../models/Pulse.js"

export const get_heresy_books = async (req, res) => {
    try {

        const books = await BookModel.find({ compilation: req.params.book_name })

        if (!books) {
            return res.status(404).send({
                message: 'Книги не найдены'
            })
        }

        res.status(200).json({
            books
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const edit_heresy_books = async (req, res) => {
    try {

        const book = await BookModel.findById(req.params.id)

        if (req.body.presence === 'Есть' && book.presence === 'Нет') {
            const pulseDoc = new PulseModel({
                date_pulse: Date.now(),
                name_pulse: req.body.book_name,
                category_pulse: 'books_price',
                sum_pulse: req.body.summ_book,
                id_object: req.params.id
            })

            await pulseDoc.save()
        }
        else if (req.body.presence === 'Нет' && book.presence === 'Есть') {
            await PulseModel.deleteMany({ id_object: req.params.id })
        }
        else {
            await PulseModel.updateMany({ id_object: req.params.id },
                {
                    name_pulse: req.body.book_name,
                    sum_pulse: req.body.summ_book
                })
        }

        const book_edit = await BookModel
            .findByIdAndUpdate(req.params.id, {
                book_name: req.body.book_name,
                summ_book: req.body.summ_book,
                presence: req.body.presence,
            })
        res.status(200).json({
            book_edit
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const delete_heresy_books = async (req, res) => {
    try {

        const deleteBooks = await BookModel.
            findByIdAndDelete(req.params.id)

        await PulseModel.deleteMany({ id_object: req.params.id })

        if (!deleteBooks) {
            return res.status(404).send({
                message: "Книга не найдена"
            })
        }

        return res.status(200).json({
            deleteBooks
        })

    } catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const add_heresy_books = async (req, res) => {
    try {

        const bookDoc = new BookModel({
            book_name: req.body.book_name,
            summ_book: req.body.summ_book,
            presence: req.body.presence,
            compilation: req.params.book_name
        })

        const book = await bookDoc.save()

        if (req.body.presence === 'Есть') {
            const pulseDoc = new PulseModel({
                date_pulse: Date.now(),
                name_pulse: req.body.book_name,
                category_pulse: 'books_price',
                sum_pulse: req.body.summ_book,
                id_object: String(book._doc._id)
            })

            await pulseDoc.save()
        }

        res.status(200).json({
            ...book._doc
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const get_books_listgroup = async (req, res) => {
    try {

        var booksListGroup = []

        const filters = [
            { compilation: 'Ересь Хоруса', key: 'https://wiki.warpfrog.wtf/images/thumb/3/39/HH_book_%281%29.jpg/220px-HH_book_%281%29.jpg' },
            { compilation: 'Осада Терры', key: 'https://wiki.warpfrog.wtf/images/thumb/1/10/EndDeath3.jpg/220px-EndDeath3.jpg' },
            { compilation: 'Примархи', key: 'https://wiki.warpfrog.wtf/images/thumb/0/0c/Primarchs.jpg/220px-Primarchs.jpg' },
            { compilation: 'Персонажи', key: 'https://wiki.warpfrog.wtf/images/thumb/c/c6/ValdorIB.jpg/220px-ValdorIB.jpg' },
            { compilation: 'Ариман', key: 'https://wiki.warpfrog.wtf/images/thumb/d/de/Ahriman1.jpg/220px-Ahriman1.jpg' },
            { compilation: 'Черный Легион', key: 'https://wiki.warpfrog.wtf/images/thumb/9/9b/TalonOfHorus1.jpg/220px-TalonOfHorus1.jpg' },
            { compilation: 'Фабий Байл', key: 'https://www.moscowbooks.ru/image/book/657/orig/i657031.jpg?cu=20190603172509' },
            { compilation: 'Пришествие зверя', key: 'https://img4.labirint.ru/rc/bb356e596ca01dc3834aa6d785d982f2/363x561q80/books68/678184/cover.jpg?1564169317' },
            { compilation: 'Инквизитор', key: 'https://img4.labirint.ru/rc/4b4b75092b1d4b8316d0ae090eaca948/363x561q80/books81/809384/cover.jpg?1625207319' },
            { compilation: 'Крестовый поход Махариуса', key: 'https://img3.labirint.ru/rc/0aacc48e85ded07eed45c480473dd5d7/363x561q80/books64/633767/cover.jpg?1564082986' },
            { compilation: 'Вольный Торговец', key: 'https://img3.labirint.ru/rc/c07e9d09e76f220cbf6ef72efe77305f/363x561q80/books87/869741/cover.jpg?1657722309' },
            { compilation: 'Кархародоны', key: 'https://static.insales-cdn.com/images/products/1/2579/170043923/RU_Carcharodons_cover-1.jpg' },
            { compilation: 'Армагеддон', key: 'https://img3.labirint.ru/rc/095deb9d87aae23d40196024d9a1a5d9/363x561q80/books74/735649/cover.jpg?1583162749' },
            { compilation: 'Комиссар Каин', key: 'https://content.img-gorod.ru/pim/products/images/62/4a/018ee5fa-ffbd-774f-8a69-a163d3f1624a.jpg?width=0&height=1200&fit=bounds' },
            { compilation: 'Арбитр', key: 'https://img3.labirint.ru/rc/16a454ec1cf4fe4c26aac6ba17fa6f9f/363x561q80/books68/677329/cover.jpg?1564167126' },
            { compilation: 'Кузницы Марса', key: 'https://content.img-gorod.ru/pim/products/images/b9/ba/018ee8d0-21c2-7f8c-ac57-06544e4cb9ba.jpg?width=336&height=480&fit=bounds' },
            { compilation: 'Северина Рейн', key: 'https://woody-comics.ru/images/thumbnails/1704/1256/detailed/74/7e690b60c6d7f18163c6f8d397e59a86.jpg' },
            { compilation: 'Испивающие Души', key: 'https://img4.labirint.ru/rc/a4db0294125b06c70c9cfe8eab99f714/363x561q80/books74/731838/cover.jpg?1580124305' },
            { compilation: 'Люций', key: 'https://static.insales-cdn.com/images/products/1/1306/437413146/315183.jpg' },
            { compilation: 'Тёмная Ересь', key: 'https://img3.labirint.ru/rc/e60e6bdf540e0a943f6728092b25b307/363x561q80/books83/823639/cover.jpg?1633710314' },
            { compilation: 'Несущие Слово', key: 'https://warhammergames.ru/_ld/9/87585186.jpg' },
            { compilation: 'Караул Смерти', key: 'https://fantlab.ru/images/editions/orig/327083?r=1630266210' },
            { compilation: 'Саламандры', key: 'https://static.insales-cdn.com/images/products/1/2014/476882910/Salamanders_cover_ru.jpg' },
            { compilation: 'Железные Воины', key: 'https://img3.labirint.ru/rc/a28e12430154e69bcbc607fa21d44dcb/363x561q80/books80/790579/cover.jpg?1614756306' },
            { compilation: 'Сёстры Битвы', key: 'https://img4.labirint.ru/rc/6aec485ee2af6bfc4e85ba6b29fb91f2/363x561q80/books82/817780/cover.jpg?1631877915' },
            { compilation: 'Кровь Асахейма', key: 'https://img3.labirint.ru/rc/6bfd3ecf82bc0a07c072dadc1710727f/220x340q80/books57/563863/cover.jpg?1482492475' },
            { compilation: 'Война за Фенрис', key: 'https://content.img-gorod.ru/pim/products/images/31/e4/018ee318-bff4-70aa-9e9d-5867662931e4.jpg?width=0&height=1200&fit=bounds' },
            { compilation: 'Мефистон', key: 'https://img4.labirint.ru/rc/3ebcfc652ecab27c7658ff3278e5a312/363x561q80/books73/726814/cover.jpg?1575901716' },
            { compilation: 'Повелители Ночи', key: 'https://img3.labirint.ru/rc/fbbdefddfc5295b40eedfbca59946d1d/363x561q80/books82/819675/cover.jpg?1631431507' },
            { compilation: 'Огненная Заря', key: 'https://cdn1.ozone.ru/s3/multimedia-8/6356196608.jpg' },
            { compilation: 'Хорусианские Войны', key: 'https://static.insales-cdn.com/images/products/1/1622/479643222/RU_Horusian_Wars_Divination_cover_new.jpg' },
            { compilation: 'Крипты Терры', key: 'https://fantlab.ru/images/editions/big/225195?r=1629184919' },
            { compilation: 'Хранители Трона', key: 'https://img3.labirint.ru/rc/35f737ce131d9434c2983b0603a67126/363x561q80/books84/831239/cover.jpg?1639506321' },
            { compilation: 'Кадия', key: 'https://warhammergames.ru/_ld/17/07675870.jpg' },
            { compilation: 'Криг', key: 'https://s1.livelib.ru/boocover/1008781099/200x305/a7f9/boocover.jpg' },
            { compilation: 'Темный Империум', key: 'https://img4.labirint.ru/rc/69347eac06371014dddc5e32bd66bc72/363x561q80/books73/725668/cover.jpg?1575894341' },
            { compilation: 'Дважды мёртвый царь', key: 'https://wiki.warpfrog.wtf/images/e/eb/Ruin.jpg' },
            { compilation: 'Завоевания Космодесанта', key: 'https://www.rulit.me/data/programs/images/pepel-prospero-warhammer-40-000_773348.jpg' },
            { compilation: 'Уфтхак Чёрный Гребень', key: 'https://uknig.com/covers/741314_200x300.jpg?t=1716205505' },
            { compilation: 'Ассасинорум', key: 'https://img4.labirint.ru/rc/5cbaf81e02283d5027e9754879aa31c3/363x561q80/books97/966694/cover.jpg?1702909541' },
            { compilation: 'Отдельные романы', key: 'https://warhammergames.ru/_ld/18/79813885.jpg' },
            { compilation: 'Warhammer Crime', key: 'https://knigofan.ru/upload/iblock/4f9/0a65d9zc29emy35opu9q2y1f5ew295an.jpg' },
        ]

        const books_list = await BookModel.aggregate([
            {
                $group: {
                    _id: "$compilation",
                    children: { $push: { status: "$presence", title: "$book_name" } },
                    count: { $sum: 1 }
                }
            }
        ])

        for (var i = 0; i < books_list.length; i++) {
            var items = []
            var keyBooks = ''
            var procent = 0

            filters.map((obj) => {
                if (obj.compilation === books_list[i]._id) {
                    keyBooks = obj.key
                } else
                    obj
            })

            books_list[i].children.map(obj => obj.status === 'Нет' ? items.push(obj.title) : obj)

            procent = (100 - (items.length * 100 / books_list[i].count)).toFixed(2)

            var countNotBooks = items.length
            booksListGroup.push({
                nameCompilation: books_list[i]._id, keyBooks: keyBooks,
                procent: procent, countNotBooks: countNotBooks, items: items
            })
        }

        booksListGroup.sort((a, b) => b.procent - a.procent)

        res.status(200).json({
            booksListGroup,
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}