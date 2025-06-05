require('dotenv').config();
const express = require('express');
const app = express();
const ingestRoute = require('./routes/ingest');
const processJobs = require('./services/processor');

app.use(express.json());
app.use('/', ingestRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  processJobs(); 
});
