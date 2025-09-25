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

module.exports = { orderByPopularidadeDesc, createSimplifiedOrderedList}