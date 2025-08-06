const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;

// Middleware para processar dados do formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir arquivos estáticos (CSS, JS, imagens)
app.use(express.static('public'));

// Função para classificar IMC
function classificarIMC(imc) {
    if (imc < 16) {
        return 'Baixo peso (grau I)';
    } else if (imc >= 16 && imc <= 16.99) {
        return 'Baixo peso (grau II)';
    } else if (imc >= 17 && imc <= 18.49) {
        return 'Baixo peso (grau III)';
    } else if (imc >= 18.50 && imc <= 24.99) {
        return 'Peso adequado';
    } else if (imc >= 25 && imc <= 29.99) {
        return 'Sobrepeso';
    } else if (imc >= 30 && imc <= 34.99) {
        return 'Obesidade (grau I)';
    } else if (imc >= 35 && imc <= 39.99) {
        return 'Obesidade (grau II)';
    } else {
        return 'Obesidade (grau III)';
    }
}

// Rota para carregar a página HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para processar os dados do formulário
app.post('/calcular-imc', (req, res) => {
    try {
        const { nome, altura, peso } = req.body;
        
        // Validação dos dados
        if (!nome || !altura || !peso) {
            return res.status(400).json({
                erro: 'Todos os campos são obrigatórios'
            });
        }
        
        // Converter para números
        const alturaNum = parseFloat(altura);
        const pesoNum = parseFloat(peso);
        
        // Validação dos valores
        if (alturaNum <= 0 || pesoNum <= 0) {
            return res.status(400).json({
                erro: 'Altura e peso devem ser valores positivos'
            });
        }
        
        // Calcular IMC (altura deve estar em metros)
        const imc = pesoNum / (alturaNum * alturaNum);
        const classificacao = classificarIMC(imc);
        
        // Retornar resultado
        res.json({
            nome: nome,
            altura: alturaNum,
            peso: pesoNum,
            imc: imc.toFixed(2),
            classificacao: classificacao
        });
        
    } catch (error) {
        res.status(500).json({
            erro: 'Erro interno do servidor'
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});