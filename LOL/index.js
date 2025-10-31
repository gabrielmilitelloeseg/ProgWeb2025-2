const replaceAll = (from, to) => text => text.split(from).join(to)
const make_splash_image = img => {
    const [file, _] = img.split('.')
    return 'img/tiles/' + file + '_0.jpg'
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
    }
})

const main = async () => {

    const data = await fetch('data/data.json').then(res => res.json()).then(res => res.data)
    const championsData = Object.values(data)

    const existingTags = [... new Set(championsData.flatMap(c => c.tags))].sort()
    const existingPartypes = [... new Set(championsData.map(c => c.partype))].sort()

    const champions = championsData.map(championDataToChampion)
    const cardTemplate = document.querySelector('#card-template').innerHTML

    const htmls = champions.map(champ => cardTemplate
        .replaceAll('{{NAME}}', champ.name)
        .replaceAll('{{TITLE}}', champ.title)
        .replaceAll('{{IMAGE}}', champ.img_nice)
        .replaceAll('{{ATT}}', champ.info.attack)
        .replaceAll('{{DEF}}', champ.info.defense)
        .replaceAll('{{MAG}}', champ.info.magic)
        .replaceAll('{{DIF}}', champ.info.difficulty))

    document.querySelector('#main').innerHTML = htmls.join('\n')

    const cards = [...document.querySelectorAll('.card')]
    cards.forEach(c =>
        c.addEventListener('click', e => e.currentTarget.classList.toggle('flipped'))
    )


}

main()