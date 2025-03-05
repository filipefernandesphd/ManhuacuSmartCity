const express = require('express')
const Produto = require('../models/Produto')
const Empresa = require('../models/Empresa')

const router = express.Router()

// Criando Produto
router.post('/', async (req, res) => {
    try {
        const produto = new Produto(req.body);
        await produto.save();
        res.status(201).json(produto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Ler produtos por nome ou descrição
router.get('/', async (req, res) => {
    try {
        const { pesquisa } = req.query;
        const filter = pesquisa ? { $or: [{nome: new RegExp(pesquisa, 'i')}, {descricao: new RegExp(pesquisa, 'i')}] } : {}
        const produtos = await Produto.find(filter).populate('empresas.empresa').select('-empresas._id').exec()
        res.json(produtos)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

// Ler um produto específico
router.get('/:id', async (req, res) => {
    try {
        const produto = await Produto.findById(req.params.id).populate('empresas.empresa')
        if (!produto) return res.status(404).json({ message: 'Produto não encontrado' })
        res.json(produto) 
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

// Deleta os produtos
router.delete('/:id', async(req, res) => {
    try {
        await Produto.findByIdAndDelete(req.params.id)
        res.json({ message: 'Produto removido!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router;