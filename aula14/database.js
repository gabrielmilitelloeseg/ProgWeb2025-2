const { readFile, writeFile } = require('node:fs/promises')
const fileName = './data.json'
const usersFile = './users.json'
const encodingOption = { encoding: 'utf-8' }

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

const getUsers = () => {
    return readFile(
        usersFile,
        encodingOption
    ).then(x => JSON.parse(x))
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
    return getMusics()
        .then(ms =>
            ms.reduce((result, item) => {
                if (item.id === ID) return item
                else return result
            }, undefined))
}

const addMusic = async music => {
    const data = await getData()

    const { nextId, musicas } = data

    music.id = nextId

    const newData = {
        nextId: nextId + 1,
        musicas: [...musicas, music]
    }

    return await setData(newData).then(() => music.id)

}

const insertMusic = async (id, music) => {
    const data = await getData()

    const { nextId, musicas } = data

    music.id = id

    const newData = {
        nextId,
        musicas: [...musicas, music]
    }

    return await setData(newData).then(() => music)
}

const getUserByApiKey = async (api_key) => {

    return getUsers().then(us => us.reduce((result, item) => {
        if (item.api_key === api_key) return item
        else return result
    }, undefined))

}

module.exports = {
    getMusics,
    deleteMusic,
    addMusic,
    insertMusic,
    getMusicByID,
    getUserByApiKey
}