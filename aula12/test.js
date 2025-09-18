const {Musica} = require('./Musica')

const validMusic = new Musica(
    "Tempo Perdido",
    "Legião Urbana",
    "Dois",
    1986,
    "Rock Nacional",
    308,
    94.9
)

console.log(JSON.stringify(validMusic))
console.log({valid: validMusic.validate()})

/*
{
  "id": 16,
  "titulo": "Tempo Perdido",
  "artista": "Legião Urbana",
  "album": "Dois",
  "ano": 1986,
  "genero": "Rock Nacional",
  "duracao_segundos": 308,
  "popularidade": 94.9
}
*/

const invalidMusic = new Musica(
    "Tempo Perdido",
    "Legião Urbana",
    "Dois",
    2026,
    "Rock Nacional",
    308,
    101
)

console.log(JSON.stringify(invalidMusic))
const isValid = invalidMusic.validate()
console.log({details : isValid.error.details})