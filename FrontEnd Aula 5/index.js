const replaceAll = (from, to) =>  text => text.split(from).join(to)

const championDataToChampion = cd => ({
    name: cd.name,
    title: cd.title,
    img: cd.image.full,
    info: cd.info
})

const main = async () => {

    const data = await fetch('/data/data.json').then(res => res.json()).then(res => res.data)
    const championsData = Object.values(data)

    const existingTags = [... new Set(championsData.flatMap(c => c.tags))].sort()
    const existingPartypes = [... new Set(championsData.map(c => c.partype))].sort()
    const champions = championsData.map(championDataToChampion)


    const cardTemplate = document.querySelector('#card-template').innerHTML
    const champ = champions[0]

    const htmls = champions.map(champ => cardTemplate
        .replaceAll('{{NAME}}', champ.name)
        .replaceAll('{{TITLE}}', champ.title)
        .replaceAll('{{IMAGE}}', champ.img)
        .replaceAll('{{ATT}}', champ.info.attack)
        .replaceAll('{{DEF}}', champ.info.defense)
        .replaceAll('{{MAG}}', champ.info.magic)
        .replaceAll('{{DIF}}', champ.info.difficulty))

    
    document.querySelector('#main').innerHTML = htmls.join('\n')

}



main()