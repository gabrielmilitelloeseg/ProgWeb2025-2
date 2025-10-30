const main = async () => {

    const data = await fetch('/data/data.json').then(res => res.json()).then(res => res.data)
    console.log(data)

}



main()