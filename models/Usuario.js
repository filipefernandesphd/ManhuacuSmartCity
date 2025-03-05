const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },

}, {
    timestamps: true,
})

usuarioSchema.methods.compararSenha = async function (senha) {
    return await bcrypt.compare(senha, this.senha)
}

usuarioSchema.pre('save', async function(next){
    if (!this.isModified('senha')) return next()
    this.senha = await bcrypt.hash(this.senha, 10)
    next()
})

const Usuario = mongoose.model('Usuario', usuarioSchema)
module.exports = Usuario