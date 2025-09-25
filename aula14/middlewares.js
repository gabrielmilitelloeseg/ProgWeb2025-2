const logMiddleware = (req,res, next) => {

    // Antes do processamento
    const startTime = Date.now();
    
    // Hook para executar após o response ser enviado
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    });
    
    res.on('close', () => {
        console.log('Conexão fechada - usuário pode ter abandonado a requisição');
    });
  
    next()

}

const corsMiddleware = (req,res, next) => {
    // Headers CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Responde imediatamente para OPTIONS (PRÉ-FLIGHT)
    if (req.method === 'OPTIONS') {
        console.log('OPTIONS received - sending 200');
        return res.sendStatus(200);
    }
    next()
}

const authorizationMiddleware = (req,res, next) => {
    next()
}

module.exports = {
    corsMiddleware,
    logMiddleware,
    authorizationMiddleware
}