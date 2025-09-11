const { read } = require('node:fs');
const { readFile } = require('node:fs/promises');

(async () => {

    const contentPromise = readFile(
        './nomes.txt',
        { encoding : 'utf-8'})
    
    contentPromise.then(content => {
        const lines = content.split('\r\n')
        const data = lines.map(x => JSON.parse(x))
        const major = data.filter (x => x.idade >= 18)
        const result = major.map(x=>x.nome)
        console.log(result)
    }).catch(ex => console.log(ex))
    
    console.log("fim do main")
})();


/*
const file = await open('./nomes.txt');

  for await (const line of file.readLines()) {
    console.log(line);
  }
1*/