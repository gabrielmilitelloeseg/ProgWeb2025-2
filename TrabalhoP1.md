# Trabalho P1

### PARA AMBAS AS OPÇÕES

* Implementar middleware para CORS (AULA 11)
* Implementar middleware de LOGS (anteriores aos handlers e posteriores ao handler) (AULA 14)
* Implementar middleware de Autenticação (AULA 14)

### OPÇÃO 1 - Fazer uma API REST para 2 recursos

Pré-requisito:

* Ser diferente do domínio feito em aula (Músicas)
* Ter ao menos 2 recursos (isso significa dois conjuntos de rotas / urls)
* Ter implementados os métodos GET (listagem + detalhes), POST (inserção), PUT (alteração), DELETE (remoção)
* Ter os devidos tratamentos de erros usando os códigos HTTP devidos e com as boas práticas discutidas em aula

  ### OPÇÃO 2 - Implementar na API feita em aula um banco de dados em arquivo SQLITE

  Pré-requisito:

  * Isolar toda a lógica do acesso a dados em um módulo separado
  ```js
  module.exports = { Database } // no arquivo do módulo
  const { Database } = require('./database.js') // no arquivo que for usar
  ```

  * Usar o Módulo `sqlite3` (apartir da aula14 está no package.json)
    ```> npm i sqlite3```
  * Se necessário fazer IDS como GUID usar o módulo `uuid` (apartir da aula14 está no package.json)
     ```> npm i uuid```
  * Fazer a conexão com o banco antes dos handlers de requisição (assim que o servidor sobe)
  * Fazer a criação / verificação da existência das tabelas necessárias antes dos handlers (assim que o servidor sobe)
  * Fazer as consultas e operações necessárias nos handlers
 
  Exemplo de código SQLITE e uso do UUID no arquivo `sqlite.js` na pasta aula14.
 
  
