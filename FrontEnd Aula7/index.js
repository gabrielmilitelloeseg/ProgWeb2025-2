const replaceAll = (from, to) => text => text.split(from).join(to)
const make_splash_image = img => {
    const [file, _] = img.split('.')
    return 'img/tiles/' + file + '_0.jpg'
}

const useState = (initialValue) => {
    let state = initialValue

    const getState = () => state
    const setState = newState => {
        state = newState
    }

    return [getState, setState]
} 

// const [getNome, setNome] = useState('teste')
// console.log(getNome())
// setNome('teste2')
// console.log(getNome())

// const [getRa, setRa] = useState(1)
// console.log(getRa())
// setRa(2)
// console.log(getRa())

const championStatAdapter = stat => {
    console.log([...Object.entries(stat)])
    return [...Object.entries(stat)].reduce((res, [chave, valor]) => {
        const objs = res.filter(x=>x[chave.replaceAll('perlevel', '')])
        let result;
        if(objs.length > 0){
            const obj = objs[0]
            result = [...res, Object.assign(obj, {[chave]: valor})]
        }
        else result = [...res, {[chave]: valor}]
        console.log(result)
        return result
    }, [])
}



const championDataToChampion = cd => ({
    name: cd.name,
    title: cd.title,
    img: '../LOL/img/champion/' + cd.image.full,
    img_nice: make_splash_image(cd.image.full),
    info: {
        attack: String(cd.info.attack).padStart(2, '0'),
        defense: String(cd.info.defense).padStart(2, '0'),
        magic: String(cd.info.magic).padStart(2, '0'),
        difficulty: String(cd.info.difficulty).padStart(2, '0'),
    },
    tags: cd.tags.join(' | ')
})

const orderByAttack = (a,b) => parseInt(b.info.attack) - parseInt(a.info.attack)
const orderByDefense = (a,b) => parseInt(b.info.defense) - parseInt(a.info.defense)
const orderByMagic = (a,b) => parseInt(b.info.magic) - parseInt(a.info.magic)
const filterByTag = tag => champion => champion.tags.indexOf(tag) > -1

const orderFunctions = {
    Attack: orderByAttack,
    Defence: orderByDefense,
    Magic: orderByMagic
}

const getDataEffect = async () => {
    const data = await fetch('data/data.json').then(
        res => res.json()
    ).then(res => res.data)
    const championsData = Object.values(data)
    const existingTags = [... new Set(championsData.flatMap(c => c.tags))].sort()
    const existingPartypes = [... new Set(championsData.map(c => c.partype))].sort()
    console.log({stats: championsData.map(c=> championStatAdapter(c.stats))})
    const champions = championsData.map(championDataToChampion)
    return { existingPartypes, existingTags, champions }
}

const makeCardFactory = cardTemplate => champ => cardTemplate
        .replaceAll('{{NAME}}', champ.name)
        .replaceAll('{{TITLE}}', champ.title)
        .replaceAll('{{IMAGE}}', champ.img_nice)
        .replaceAll('{{ATT}}', champ.info.attack)
        .replaceAll('{{DEF}}', champ.info.defense)
        .replaceAll('{{MAG}}', champ.info.magic)
        .replaceAll('{{DIF}}', champ.info.difficulty)
        .replaceAll('{{TAGS}}', champ.tags)

const renderFactory = makeCard => champions => {
    const htmls = champions.map(makeCard)
    document.querySelector('#main').innerHTML = htmls.join('\n')

    const cards = [...document.querySelectorAll('.card')]
    cards.forEach(c =>
        c.addEventListener('click', e => e.currentTarget.classList.toggle('flipped'))
    )
}

const tagToHtmlOption = tag => `<option value='${tag}'>${tag}</option>` 


const filterAndSortCardsFactory = champions => (filterFunction, orderFunction) =>  {
    const ff = filterFunction ? filterFunction : () => true
    const filtered = champions.filter(ff)
    return orderFunction ? filtered.sort(orderFunction) : filtered
}

const main = async () => {
    const cardTemplate = document.querySelector('#card-template').innerHTML
    const TagsSelect = document.querySelector('#tag')

    const {champions, existingTags, existingPartypes} = await getDataEffect()
    const filterAndSort = filterAndSortCardsFactory(champions)

    TagsSelect.innerHTML += existingTags.map(tagToHtmlOption).join('\n')
    const makeCard = makeCardFactory(cardTemplate)
    const render = renderFactory(makeCard)
    render(champions)

    const tagOrOderChangeEvent = () => {
        const selectedOrder = document.querySelector('#order').value
        const selectedFilter = document.querySelector('#tag').value

        const filterFn = selectedFilter ? filterByTag(selectedFilter) : null
        const orderFn  = selectedOrder ? orderFunctions[selectedOrder] : null

        const filteredAndOrderedChampions = filterAndSort(filterFn, orderFn)
        render(filteredAndOrderedChampions)
    }
    
    document.querySelector('#tag').addEventListener('change', tagOrOderChangeEvent)
    document.querySelector('#order').addEventListener('change', tagOrOderChangeEvent)

    


}

main()