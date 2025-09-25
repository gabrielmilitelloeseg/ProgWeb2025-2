const { readFile, writeFile } = require('node:fs/promises')
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

const getMusics = () => {
    return getData().then(x => x.musicas)
}

const deleteMusic = async (ID) => {
    const data = await getData()

    const musics = data.musicas.filter(m => m.id != ID)

    data.musicas = musics

    return setData(data)
}

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

module.exports = { 
    getMusics, 
    deleteMusic, 
    addMusic, 
    insertMusic, 
    getMusicByID
}