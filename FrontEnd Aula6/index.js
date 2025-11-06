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

const [getNome, setNome] = useState('teste')
console.log(getNome())
setNome('teste2')
console.log(getNome())

const [getRa, setRa] = useState(1)
console.log(getRa())
setRa(2)
console.log(getRa())

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
}

const main = async () => {
    const cardTemplate = document.querySelector('#card-template').innerHTML
    
    const {champions} = await getDataEffect()
    const makeCard = makeCardFactory(cardTemplate)
    const render = renderFactory(makeCard)
    render(champions)


    const cards = [...document.querySelectorAll('.card')]
    cards.forEach(c =>
        c.addEventListener('click', e => e.currentTarget.classList.toggle('flipped'))
    )

    document.querySelector('#tag').addEventListener('change', (e) => {
        
        const selectedOrder = document.querySelector('#order').value
        const selectedValue = e.target.value
        if(selectedValue){
            const filteredChampions = champions.filter(
                c => c.tags.indexOf(e.target.value) !== -1
            )

            const orderFn = orderFunctions[selectedOrder]
            if(orderFn){
                render(filteredChampions.sort(orderFn))
            }
            else render(filteredChampions)
        }
    })

    document.querySelector('#order').addEventListener('change', (e) => {
        
        const  selectedValue = document.querySelector('#tag').value
        const  selectedOrder = e.target.value

        console.log(selectedOrder, selectedValue)

            const filteredChampions = selectedValue ? champions.filter(
                c => c.tags.indexOf(e.target.value) !== -1
            ) : champions

            const orderFn = orderFunctions[selectedOrder]
            if(orderFn){
                render(filteredChampions.sort(orderFn))
            }
            else render(filteredChampions)
    })

    


}

main()