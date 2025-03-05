const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/Usuario')
const { body, validationResult } = require('express-validator')

const router = express.Router()

//Cadastro de usuário
router.post('/cadastro', [
    body('nome').not().isEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('senha').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres')
], async (req, res) => {
    const erros = validationResult(req)
    if (!erros.isEmpty()) {
        return res.status(400).json({ erros: erros.array() })
    }

    const { nome, email, senha } = req.body
    console.log("Senha recebida: ", senha)

    try {
        let usuario = await Usuario.findOne({ email })
        if (usuario) return res.status(400).json({ msg: 'Usuário já existe' })

        if (typeof senha !== 'string' || senha.trim().length === 0) {
            return res.status(400).json({ msg: 'Senha inválida' })
        }
        const senhaHash = await bcrypt.hash(senha, 10)
        usuario = new Usuario({ nome, email, senha: senhaHash })
        await usuario.save()
        res.status(201).json({ msg: 'Usuário criado com sucesso!' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Erro no servidor', erro: error.message })
    }
})

//Login do usuário
router.post('/login', [
    body('email').isEmail().withMessage('Email inválido'),
    body('senha').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres'),
], async (req, res) => {
    const erros = validationResult(req)
    if (!erros.isEmpty()) {
        return res.status(400).json({ erros: erros.array() })
    }

    const { email, senha } = req.body

    try {
        let usuario = await Usuario.findOne({ email })
        if (!usuario) {
            console.log("Usuário não encontrado: ", email)
            return res.status(400).json({ msg: 'Usuário não encontrado' })
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida){
            console.log("Senha inválida para o email: ", email)
            return res.status(400).json({ msg: 'Senha inválida' })
        } 

        const entrar = { usuarioId: usuario._id }
        const token = jwt.sign(entrar, 'secreta', { expiresIn: '1h' })

        res.json({ token })
    } catch (error) {
        console.log("Erro no login: ", error)
        res.status(500).json({ msg: 'Erro no servidor', erro: error.message })
    }
})

//Autentificar usuário
const autenticar = (req, res, next) => {
    const token = req.header('x-auth-token')
    if (!token) return res.status(401).json({ msg: 'Token não encontrado' })

    try {
        const decoded = jwt.verify(token, 'secreta')
        req.usuario = decoded.usuarioId
        next()
    } catch (error) {
        res.status(401).json({ msg: 'Token inválido' })
    }
}

module.exports = router