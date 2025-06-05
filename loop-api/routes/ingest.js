const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { ingestionStore, batchQueue, PRIORITY } = require('../storage/datastore');

router.post('/ingest', (req, res) => {
  const { ids, priority } = req.body;
  const ingestion_id = uuidv4();

  ingestionStore[ingestion_id] = { status: "yet_to_start", batches: [] };

  for (let i = 0; i < ids.length; i += 3) {
    const batch = {
      ids: ids.slice(i, i + 3),
      status: "yet_to_start",
      created_time: Date.now(),
      priority: PRIORITY[priority],
      ingestion_id,
      batch_id: uuidv4()
    };
    batchQueue.push(batch);
  }

  batchQueue.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.created_time - b.created_time;
  });

  res.json({ ingestion_id });
});

router.get('/status/:id', (req, res) => {
  const ingestion_id = req.params.id;
  const data = ingestionStore[ingestion_id];

  if (!data) return res.status(404).json({ error: "Invalid ingestion_id" });

  const statuses = data.batches.map(b => b.status);
  let overall = "yet_to_start";
  if (statuses.every(s => s === "completed")) overall = "completed";
  else if (statuses.some(s => s === "triggered" || s === "completed")) overall = "triggered";

  res.json({
    ingestion_id,
    status: overall,
    batches: data.batches.map(b => ({
      batch_id: b.batch_id,
      ids: b.ids,
      status: b.status
    }))
  });
});

module.exports = router;
