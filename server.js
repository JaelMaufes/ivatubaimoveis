require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const PORT = process.env.PORT || 3000;
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado ao MongoDB com sucesso!');
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}).catch(err => {
  console.error('Erro ao conectar ao MongoDB:', err);
  process.exit(1);
});

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', 'C:\\Users\\Samuel Jafé\\Documents\\GitHub\\ivatubaimoveis\\views\\pages');

// Middleware para processar dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));

// Definição do esquema e modelo do Mongoose
const Schema = mongoose.Schema;

const imovelSchema = new Schema({
  nome: { type: String, required: true },
  endereco: { type: String, required: true },
  valor: { type: Number, required: true },
  descricao: String,
  // Outros campos conforme necessário
});

const Imovel = mongoose.model('Imovel', imovelSchema);

// Rota para a página index
app.get('/', (req, res) => {
  res.render('index');
});

// Rota para a página listings com consulta ao banco de dados
app.get('/listings', (req, res) => {
  Imovel.find({}, (err, imoveis) => {
    if (err) throw err;
    res.render('pages/listings', { imoveis });
  });
});

// Rota para a página contact
app.get('/contact', (req, res) => {
  res.render('pages/contact');
});

// Rota para cadastrar um novo imóvel
app.post('/cadastrar', (req, res) => {
  const { tipo, nome, endereco, valor, whatsapp, email, descricao } = req.body;

  const novoImovel = new Imovel({
    tipo,
    nome,
    endereco,
    valor,
    whatsapp,
    email,
    descricao,
  });

  novoImovel.save((err) => {
    if (err) {
      console.error('Erro ao cadastrar imóvel:', err);
      res.status(500).send('Erro ao cadastrar imóvel. Por favor, tente novamente mais tarde.');
    } else {
      res.redirect('/success');
    }
  });
});

// Rota para a página de sucesso
app.get('/success', (req, res) => {
  res.render('pages/success');
});
