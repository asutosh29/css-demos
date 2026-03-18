import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;

// Serve static assets from src and root public correctly
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'public')));

// Clean Routes to HTML files
const pages = [
  'positioning',
  'font-sizing',
  'display',
  'box-model',
  'flexbox',
  'grid',
  'specificity',
  'animations'
];

pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', `${page}.html`));
  });
});

// Home Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 Fallback
app.use((req, res) => {
  res.status(404).send('Demo not found.');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Lecture Demo Server running at http://localhost:${PORT}`);
});
