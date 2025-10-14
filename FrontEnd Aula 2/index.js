const replaceAll = (from, to, text) => text.split(from).join(to)
const trace = (x) => { console.log(x); return x; }

( async () => {

    let offset = 10
    const limit = 10
    const baseApiUrl = 'https://pokeapi.co/api/v2/pokemon'
    const url = `${baseApiUrl}?offset=${offset}&limit=${limit}`
    
    // conferir esse pedaço
    const json = window.sessionStorage.getItem(url)
    if(!json){
        const result = await fetch(url).then(res => res.json())
        window.sessionStorage.setItem(url, result)
    }


    console.log(result)
    
})()