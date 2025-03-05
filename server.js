const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const conectarBanco = require('./config/db')
const rotasProduto = require('./routes/rotasProduto')
const rotasEmpresa = require('./routes/rotasEmpresa')
const rotasUsuario = require('./routes/rotasUsuario')

const app = express()
const PORT = 5000

conectarBanco()

app.use(cors())
app.use(bodyParser.json())

app.use('/api/produtos', rotasProduto)
app.use('/api/empresas', rotasEmpresa)
app.use('/api/usuarios', rotasUsuario)

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})