const express = require('express')
const Produto = require('../models/Produto')
const Empresa = require('../models/Empresa')

const router = express.Router();

//Criar uma empresa
router.post('/', async (req, res) => {
    try {
        const empresa = new Empresa(req.body)
        await empresa.save()
        res.status(201).json({ message: 'Empresa criada!' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Associar produto a uma empresa
router.post('/:id/produtos', async (req, res) => {
    try {
        const empresa = await Empresa.findById(req.params.id);
        if (!empresa) return res.status(404).json({ message: 'Empresa não encontrada' });

        const { produto, preco, estoque } = req.body;

        const produtoExistente = await Produto.findById(produto);
        if (!produtoExistente) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        
        produtoExistente.empresas.push({ empresa: empresa._id, preco, estoque });
        await produtoExistente.save();

        res.json(produtoExistente);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//Ver todas as empresas
router.get('/', async (req, res) => {
    try {
        const empresas = await Empresa.find()
        res.json(empresas)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

// Deletar uma empresa
router.delete('/:id', async (req, res) => {
    try {
        const empresa = await Empresa.findByIdAndDelete(req.params.id);
        if (!empresa) return res.status(404).json({ message: 'Empresa não encontrada' });

        res.json({ message: 'Empresa deletada com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router