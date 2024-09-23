const express = require('express');  // Import de Express
const cors = require('cors');  // Import de CORS
const mongoose = require('mongoose');  // Import de Mongoose

// Création de l'application Express
const app = express();

// Activation de CORS
app.use(cors());

// Middleware pour parser les requêtes HTTP avec un corps JSON
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb+srv://davidgallula14:David1234@cluster0.nmmyt.mongodb.net/myDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Définition du modèle Mongoose pour un "Record"
const recordSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true },
});

const Record = mongoose.model('Record', recordSchema);

// Routes API CRUD

// CREATE - Créer un nouvel enregistrement
app.post('/api/records', async (req, res) => {
  try {
    const { name, value } = req.body;  // Récupération des données du corps de la requête
    const newRecord = new Record({ name, value });
    const savedRecord = await newRecord.save();  // Sauvegarde du nouvel enregistrement
    res.status(201).json(savedRecord);  // Renvoie de l'enregistrement créé
  } catch (error) {
    res.status(400).json({ error: 'Error creating record' });
  }
});

// READ - Lire tous les enregistrements
app.get('/api/records', async (req, res) => {
  try {
    const records = await Record.find();  // Récupère tous les enregistrements
    res.status(200).json(records);  // Renvoie les enregistrements trouvés
  } catch (error) {
    res.status(500).json({ error: 'Error fetching records' });
  }
});

// READ - Lire un seul enregistrement par ID
app.get('/api/records/:id', async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);  // Recherche par ID
    if (record) {
      res.status(200).json(record);  // Renvoie l'enregistrement trouvé
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching record' });
  }
});

// UPDATE - Mettre à jour un enregistrement par ID
app.put('/api/records/:id', async (req, res) => {
  try {
    const { name, value } = req.body;  // Récupération des nouvelles données
    const updatedRecord = await Record.findByIdAndUpdate(
      req.params.id,
      { name, value },  // Mise à jour des champs
      { new: true }  // Renvoie l'enregistrement mis à jour
    );
    if (updatedRecord) {
      res.status(200).json(updatedRecord);  // Renvoie l'enregistrement mis à jour
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Error updating record' });
  }
});

// DELETE - Supprimer un enregistrement par ID
app.delete('/api/records/:id', async (req, res) => {
  try {
    const deletedRecord = await Record.findByIdAndDelete(req.params.id);  // Suppression par ID
    if (deletedRecord) {
      res.status(200).json({ message: 'Record deleted successfully' });
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting record' });
  }
});

// Démarrage du serveur
const port = 3000;  // Définition du port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


