const mongoose = require('mongoose')

const produtoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    categoria: { type: String, required: true },
    imagem: { type: String, required: false }, //colocar a URL da imagem
    empresas: [{
        empresa: { type: mongoose.Schema.Types.ObjectId, ref: 'Empresa', required: false },
        preco: { type: Number, required: false },
        estoque: { type: Number, required: false }
    }]
}, {
    timestamps: true, //Cria campos "createdAt" e "updateAt"
})

const Produto = mongoose.model('Produto', produtoSchema)

module.exports = Produto