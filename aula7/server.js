/*
const { createServer } = require('node:http');

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!\n');
});

// starts a simple http server locally on port 3000
server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});

// run with `node server.mjs`
*/


const { createServer } = require('node:http');
const server = createServer((req, res) =>{
  const {url, headers, method} = req
  console.log(`${method} for ${url}`)
  //console.log({headers})

  if(url === '/Clientes'){
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end(
      `[
        { "nome": "teste", "cpf": "000.000.000-00"},
         { "nome": "teste2", "cpf": "11.111.111-11"},
      ]`
    )
  }


  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello World!\n')
})

server.listen(3000, '127.0.0.1', ()=>{
  console.log('listening on 127.0.0.1:3000')
})
