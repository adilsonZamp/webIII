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


app.listen(3001);