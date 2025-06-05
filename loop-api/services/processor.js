const { batchQueue, ingestionStore } = require('../storage/datastore');

function simulateFetch(id) {
  return new Promise(res => setTimeout(() => res({ id, data: "processed" }), 1000));
}

async function processJobs() {
  while (true) {
    if (batchQueue.length > 0) {
      const job = batchQueue.shift();
      const { ingestion_id, ids, batch_id } = job;

      job.status = 'triggered';
      ingestionStore[ingestion_id].batches.push(job);

      for (let id of ids) {
        await simulateFetch(id);
      }

      job.status = 'completed';

      await new Promise(res => setTimeout(res, 5000)); 
    } else {
      await new Promise(res => setTimeout(res, 1000));
    }
  }
}

module.exports = processJobs;
