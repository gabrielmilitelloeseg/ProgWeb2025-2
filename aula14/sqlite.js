const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

class DatabaseManager {
  constructor(dbPath = './meu_banco.db') {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
      } else {
        console.log('Conectado ao banco de dados SQLite.');
        this.createTable();
      }
    });
  }

  createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS objetos (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        apiKey TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    this.db.run(sql, (err) => {
      if (err) {
        console.error('Erro ao criar tabela:', err.message);
      } else {
        console.log('Tabela criada/verificada com sucesso.');
      }
    });
  }

  insertObject(obj) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO objetos (id, name, apiKey) VALUES (?, ?, ?)`;
      
      this.db.run(sql, [obj.id, obj.name, obj.apiKey], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  }

  getObjectById(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM objetos WHERE id = ?`;
      
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  getAllObjects() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM objetos`;
      
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  close() {
    this.db.close((err) => {
      if (err) {
        console.error('Erro ao fechar conexão:', err.message);
      } else {
        console.log('Conexão com o banco de dados fechada.');
      }
    });
  }
}

// Exemplo de uso
async function exemplo() {
  const dbManager = new DatabaseManager();
  
  const objeto = {
    name: 'teste',
    id: 1,
    apiKey: '3a5c315e-699e-437f-abbe-0fb2a39a460d'
  };

  try {
    // Inserir objeto
    await dbManager.insertObject(objeto);
    console.log('Objeto inserido com sucesso!');

    // Buscar objeto por ID
    const objetoRecuperado = await dbManager.getObjectById(1);
    console.log('Objeto recuperado:', objetoRecuperado);

    // Buscar todos os objetos
    const todosObjetos = await dbManager.getAllObjects();
    console.log('Todos os objetos:', todosObjetos);

  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    dbManager.close();
  }
}

// Executar exemplo
exemplo();