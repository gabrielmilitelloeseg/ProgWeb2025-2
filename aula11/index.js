const express = require("express")
const { readFile } = require('node:fs/promises');
const { STATUS_CODES } = require("node:http");

const app = express()

const getMusicsForFile = () => {
    return readFile(
        './data.json',
        { encoding : 'utf-8'}
    )
    .then(x => JSON.parse(x))
    .then(x => x.musicas)
}

const getMusicByID = (ID) => {
    return getMusicsForFile()
    .then(ms => 
        ms.reduce((result, item) => {
        if(item.id === ID) return item
        else return result
    }, undefined))
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

// .post((req, res) => {
//     // Adicionar uma música
// })

// .put((req,res) => {
//     // Alterar uma música *ID
// })

// .delete((req,res) => {
//     //remover uma música *ID
// })

app.listen(3000, (err) => {
    if(err) console.log(err);
    console.log('listening on 3000')
})