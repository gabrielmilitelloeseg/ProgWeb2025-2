const express = require("express")
const { Musica } = require("./Musica")
const DB = require('./database')
const { orderByPopularidadeDesc, createSimplifiedOrderedList } = require('./utilities')
const { corsMiddleware, logMiddleware, authorizationMiddleware } = require('./middlewares')
const { generateJWTTokenForUser } = require('./jwt')

const app = express()

app.use(express.json())

app
    .use(corsMiddleware)
    .use(logMiddleware)
    .use('/music', authorizationMiddleware)

    .post('/authenticate', async (req, res) => {

        const { body } = req
        if (!body) return res.status(400).send('Request body expected')

        const { api_key } = body
        if (!api_key) return res.status(400).send('api_key expected')

        const user = await DB.getUserByApiKey(api_key)
        if (!user) return res.status(404).send('user not found for this api_key')

        generateJWTTokenForUser(user.id)
            .then(jwt => res.json({ jwt }))
            .catch(err => {
                console.log(err)
                return res.status(500).send('error generating token')
            })

    })

    .get('/music/:ID', (req, res) => {

        const { ID } = req.params

        DB.getMusicByID(parseInt(ID))
            .then(payload => {
                if (payload) return res.json(payload)
                else return res.status(404).send('Não encontrado')
            })
            .catch(err => res.status(500).send('erro ao obter os dados'))
    })

    .get('/music', (req, res) => {
        createSimplifiedOrderedList(
            DB.getMusics(),
            orderByPopularidadeDesc
        )
            .then(payload => res.json(payload))
            .catch(err => res.status(500).send('erro ao obter os dados'))
    })

    .post('/music', (req, res) => {

        const { body } = req
        if (!body) return res.status(400).send('Request body expected')

        const { titulo, artista, album, ano, genero, duracao_segundos, popularidade } = body
        const music = new Musica(titulo, artista, album, ano, genero, duracao_segundos, popularidade)
        const valid = music.validate()

        if (Object.hasOwn(valid, 'error')) {
            const message = valid.error.details.reduce((str, item) => str + item.message + "\n", "")
            return res.status(400).send(message)
        }

        DB.addMusic(music).then((id) => {
            return res.status(200).json({ id })
        }).catch((err) => {
            console.log(err)
            return res.status(500).send('error inserting music')
        })

    })

    .put('/music/:ID', async (req, res) => {

        const { ID } = req.params
        const { body } = req

        if (!ID) return res.status(400).send('must provide ID')

        const music = await DB.getMusicByID(parseInt(ID))

        if (!music) return res.status(404).send('music not found')
        if (!body) return res.status(400).send('Request body expected')

        const { titulo, artista, album, ano, genero, duracao_segundos, popularidade } = body
        const newMusic = new Musica(titulo, artista, album, ano, genero, duracao_segundos, popularidade)
        const valid = newMusic.validate()

        if (Object.hasOwn(valid, 'error')) {
            const message = valid.error.details.reduce((str, item) => str + item.message + "\n", "")
            return res.status(400).send(message)
        }

        await DB.deleteMusic(ID)

        DB.insertMusic(parseInt(ID), newMusic)
            .then(m => res.status(200).json(m))
            .catch(err => {
                console.log(err)
                res.status(500).send('error altering music ' + ID)
            })

    })


    .delete('/music/:ID', async (req, res) => {

        const { ID } = req.params

        if (!ID) return res.status(400).send('must provide ID')

        const music = await DB.getMusicByID(parseInt(ID))

        if (!music) return res.status(404).send('music not found')

        DB.deleteMusic(ID).then(() => res.status(200).send('music removed'))

    })

app.listen(3000, (err) => {
    if (err) console.log(err);
    console.log('listening on 3000')
})
