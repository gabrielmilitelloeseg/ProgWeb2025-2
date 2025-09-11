const multiplicarPor2 = x => x * 2
const diferenteDeZero = x => x !== 0
const fazerSomatoria = (acc, x) => acc + x

const nums = [1,2,3,4,5,0,0,0]
const dobrados = nums.map(multiplicarPor2)
const filtrados = dobrados.filter(diferenteDeZero)
const somatoria = filtrados.reduce(fazerSomatoria)

const userId = 1
const data = [
    {nome: 'teste', id: 1}, 
    {nome: 'teste2', id:2}
]

const nomes = data.reduce((acc, x) => {
    const {nome} = x;
    return [...acc, nome];
}, [])










console.log(filtrados)