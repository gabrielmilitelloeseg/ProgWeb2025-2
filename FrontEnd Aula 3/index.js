const replaceAll = (from, to, text) => text.split(from).join(to)
const trace = (x) => { console.log(x); return x; }

const memFetchJson = (url, method = 'GET') => {
    const localData = window.localStorage.getItem(url) //absolutas
    if(localData !==  null) return new Promise(
        (resolve, reject) => { 
            try{ resolve(JSON.parse(localData)) }
            catch (err) { reject(err) }
        })
    else return fetch(url)
    .then(res => res.json())
    .then(bodyAsJson => {
        window.localStorage.setItem(url, JSON.stringify(bodyAsJson)); 
        return bodyAsJson;
    })
}

const setup = async () => {

    let offset = 0
    const limit = 100
    const baseApiUrl = 'https://pokeapi.co/api/v2/pokemon'
    const url = `${baseApiUrl}?offset=${offset}&limit=${limit}`
    
    const requests = await memFetchJson(`${baseApiUrl}?offset=${1}&limit=${1}`)
        .then(json => {
            const {count, next, results} = json
            const qtdPages = parseInt(count / limit)
            const rest = count % limit
            console.log({count, next, results, qtdPages, rest})

            const offsetAndLimits = [
                ...new Array(qtdPages).fill(1).map((x, i) => { return {limit, offset: limit * (i+1)}}), 
                { limit: rest, offset: limit * qtdPages + rest}
            ]

            const requests = offsetAndLimits.map(x => `${baseApiUrl}?offset=${x.offset}&limit=${x.limit}`)
            console.log({offsetAndLimits, requests})
            return requests
        })

    const promises = requests.map(req => {
        return memFetchJson(req)
            .then(res => res.results)
    })

    const results = await Promise.all(promises)
    console.log({results})
    window.localStorage.setItem('pokemons', JSON.stringify(results.flatMap(x=>x)))
        
}

const run = async () => {
   await setup()

}

run()