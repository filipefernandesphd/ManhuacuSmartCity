const mongoose = require('mongoose')

const empresaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    site: { type: String, required: true }, //url da loja oficial, onde o cliente pode comprar o produto
    endereco: { type: String, required: false }, //local da loja física
}, {
    timestamps: true, // criando campos createdAt e updateAt
})

const Empresa = mongoose.model('Empresa', empresaSchema)
module.exports = Empresa