const express = require("express")
const { readFile, writeFile } = require('node:fs/promises');
const { Musica } = require("./Musica");

const app = express()

app.use(express.json())

const fileName = './data.json'
const encodingOption = { encoding : 'utf-8'}

const getData = () => {
    return readFile(
        fileName,
        encodingOption
    )
    .then(x => JSON.parse(x))
}

const setData = (data) => {
    return writeFile(fileName, JSON.stringify(data), encodingOption)
}

const getMusicsForFile = () => {
    return getData().then(x => x.musicas)
}

const deleteMusic = async (ID) => {
    const data = await getData()

    const musics = data.musicas.filter(m => m.id != ID)

    data.musicas = musics

    return setData(data)
}

const trace = x => {console.log({trace: x}); return x;}

const getMusicByID = (ID) => {
    return getMusicsForFile()
    .then(ms => 
        ms.reduce((result, item) => {
        if(item.id === ID) return item
        else return result
    }, undefined))
}

const addMusic = async music => {
    const data = await getData()

    const {nextId, musicas} = data 
    
    music.id = nextId
    
    const newData = {
        nextId: nextId + 1,
        musicas: [...musicas, music]
    }

    return await setData(newData).then(() => music.id)

}

const insertMusic = async (id, music) => {
    const data = await getData()

    const {nextId, musicas} = data

    music.id = id
    
    const newData = {
        nextId,
        musicas: [...musicas, music]
    }

    return await setData(newData).then(() => music)
}

const orderByPopularidadeDesc = (a,b) => b.popularidade - a.popularidade

const createSimplifiedOrderedList = (musicsPromise, orderFunction) => {

    return musicsPromise
    .then(ms => ms.map(m => {
            const {id, titulo, artista, popularidade } = m
            const tratado = {
                id,
                descritivo: `${titulo} (${artista})`, //Bohemian Rhapsody (Queen)
                popularidade 
            }
            return tratado
        }))
        .then(ms => ms.sort(orderFunction))
}

app

.use((req,res, next) => {

    console.log(`${new Date().toString()} ${req.method} ${req.originalUrl}`)
    // Headers CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Responde imediatamente para OPTIONS (PRÉ-FLIGHT)
    if (req.method === 'OPTIONS') {
        console.log('OPTIONS received - sending 200');
        return res.sendStatus(200);
    }
    next()

})

.get('/music/:ID', (req, res) => {
    
    const {ID} = req.params
 
    getMusicByID(parseInt(ID))
        .then(payload => {
            if(payload) return res.json(payload)
            else return res.status(404).send('Não encontrado')
        })
        .catch(err => res.status(500).send('erro ao obter os dados'))
})

.get('/music', (req,res) => {
    createSimplifiedOrderedList(
        getMusicsForFile(), 
        orderByPopularidadeDesc
    )
    .then(payload => res.json(payload))
    .catch(err => res.status(500).send('erro ao obter os dados'))
})

.post('/music', (req, res) => {

    console.log(req.body)
    
    const {body} = req
    if(!body) return res.status(400).send('Request body expected')

    const {titulo, artista, album, ano, genero, duracao_segundos, popularidade} = body
    const music = new Musica(titulo, artista, album, ano, genero, duracao_segundos, popularidade)
    const valid = music.validate()

    if(Object.hasOwn(valid, 'error')){
        const message = valid.error.details.reduce((str, item) => str + item.message + "\n", "")
        return res.status(400).send(message)
    }

     addMusic(music).then((id) => {
         return res.status(200).json({id})
     }).catch((err) => {
         console.log(err)
         return res.status(500).send('error inserting music')
    })

})

 .put('/music/:ID', async (req,res) => {
 
    const {ID} = req.params
    const {body} = req

    if(!ID) return res.status(400).send('must provide ID')

    const music = await getMusicByID(parseInt(ID))

    if(!music) return res.status(404).send('music not found')
    if(!body) return res.status(400).send('Request body expected')

    const {titulo, artista, album, ano, genero, duracao_segundos, popularidade} = body
    const newMusic = new Musica(titulo, artista, album, ano, genero, duracao_segundos, popularidade)
    const valid = newMusic.validate()

    if(Object.hasOwn(valid, 'error')){
        const message = valid.error.details.reduce((str, item) => str + item.message + "\n", "")
        return res.status(400).send(message)
    }

    await deleteMusic(ID)

    insertMusic(ID, newMusic)
        .then(m => res.status(200).json(m))
        .catch(err => {
            console.log(err)
            res.status(500).send('error altering music ' + ID)
        })

})


.delete('/music/:ID', async (req, res) => {

    const {ID} = req.params

    if(!ID) return res.status(400).send('must provide ID')

    const music = await getMusicByID(parseInt(ID))

    if(!music) return res.status(404).send('music not found')

    deleteMusic(ID).then(() => res.status(200).send('music removed'))

})

app.listen(3000, (err) => {
    if(err) console.log(err);
    console.log('listening on 3000')
})
