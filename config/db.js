const mongoose = require('mongoose')

const conectarBanco = async() => {
    try {
        await mongoose.connect('mongodb://localhost:27017/produtos', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('MongoDB conectado!')
    } catch (error) {
        console.error('Erro ao conectar o MongoDB:', error.message)
        process.exit(1)
    }
}

module.exports = conectarBanco;