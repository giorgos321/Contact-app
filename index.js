const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config({ path: './config/config.env' });

app.use(express.json({ extended: false }));
app.use(cors());

connectDB();

app.use('/api/contacts', require('./routes/contacts'));

//Serve Static assets in production

app.use(express.static('contact-app/dist/contact-app'));

app.get('*', (req, res) => {
  res.sendFile(
    path.resolve(__dirname, 'contact-app', 'dist', 'contact-app', 'index.html')
  );
});

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
