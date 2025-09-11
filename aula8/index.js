const express = require("express")
const { readFile } = require('node:fs/promises');

const app = express()

const getMusicsForFile = () => {
    const contentPromise = readFile(
        './data.json',
        { encoding : 'utf-8'}
    )
    .then(x => JSON.parse(x))
    .then(x => x.musicas)

    return contentPromise
}

const orderByPopularidadeDesc = (a,b) => b.popularidade - a.popularidade

const createSimplifiedOrderedList = async (musicsPromise, orderFunction) => {

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

app.route('/music')
.get(async (req, res) => {

    const payload = await createSimplifiedOrderedList(
        getMusicsForFile(), 
        orderByPopularidadeDesc
    )
   
    res.json(payload)
})

.post((req, res) => {
    // Adicionar uma música
})

.put((req,res) => {
    // Alterar uma música *ID
})

.delete((req,res) => {
    //remover uma música *ID
})

app.listen(3000, (err) => {
    if(err) console.log(err);
    console.log('listening on 3000')
})