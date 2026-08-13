const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

// Define your routes here
app.get('/api/mensagem', (req, res) => {
    res.send('Hello World!');
});

app.get('/cep/:tipo/:uf/:cidade/:rua', async (req, res) => {
    const {uf, cidade, rua, tipo} = req.params;

    try {
        //validações de acordo com que a viacep espera para esse endpoint
        if (tipo !== "json" && tipo !== "xml") {
            throw new Error("Tipo de retorno inválido");
        } 
        if (uf.length != 2 || cidade.length < 4 || rua.length < 4) {
            throw new Error("Quantidade de caracteres insuficiente");
        }

        const consulta = await axios.get(`https://viacep.com.br/ws/${uf}/${cidade}/${rua}/${tipo}/`);

        res.send(consulta.data);
    } catch (error) {
        res.status(400).send({erro: error.message});
    }
});

app.get('/cep/:cep', async (req, res) => {
    const { cep } = req.params;
    
    try {
        const resposta = await axios.get(`http://viacep.com.br/ws/${cep}/json/`);

        const dados = resposta.data;

        if (resposta.status != 200) return res.status(resposta.status).json({erro: dados});

        res.status(200).json(dados);
    } catch (error) {
        console.error(error);
        res.status(500).json({erro: "erro no servidor!"});
    }
});

app.get('/cep/:cep/xml', async (req, res) => {
    const { cep } = req.params;
    
    try {
        const resposta = await axios.get(`http://viacep.com.br/ws/${cep}/xml/`);

        const dados = resposta.data;

        if (resposta.status != 200) return res.status(resposta.status).json({erro: dados});

        res.status(200).send(dados);
    } catch (error) {
        console.error(error);
        res.status(500).json({erro: "erro no servidor!"});
    }
});

app.listen(3001);