const Joi = require('joi')

const MusicaSchema = Joi.object({
    id: Joi.number().integer(),
    titulo : Joi.string().required(),
    artista: Joi.string().required(),
    album: Joi.string().required(),
    ano: Joi.number().integer().min(1900).max(2025).required(),
    genero: Joi.string().required(),
    duracao_segundos: Joi.number().integer().required(),
    popularidade: Joi.number().min(0).max(100).required()
})


class Musica{
    constructor(titulo, artista, album, ano, genero, duracao_segundos, popularidade){
        this.id = undefined
        this.titulo = titulo
        this.artista = artista
        this.album = album
        this.ano = ano
        this. genero = genero
        this.duracao_segundos = duracao_segundos
        this.popularidade = popularidade
    }

    validate(){

        return MusicaSchema.validate(this, { abortEarly: false })
    }
}


/*
"id": 1,
      "titulo": "Bohemian Rhapsody",
      "artista": "Queen",
      "album": "A Night at the Opera",
      "ano": 1975,
      "genero": "Rock",
      "duracao_segundos": 354,
      "popularidade": 98.7
*/

module.exports = { Musica }