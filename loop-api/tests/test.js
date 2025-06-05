const axios = require('axios');

async function testAPI() {
  try {
    const ingestRes = await axios.post('http://localhost:5000/ingest', {
      ids: [1, 2, 3, 4, 5, 6],
      priority: 'HIGH'
    });

    const ingestion_id = ingestRes.data.ingestion_id;
    console.log('Ingestion ID:', ingestion_id);

    const interval = setInterval(async () => {
      const statusRes = await axios.get(`http://localhost:5000/status/${ingestion_id}`);
      console.log(JSON.stringify(statusRes.data, null, 2));

      if (statusRes.data.status === 'completed') {
        clearInterval(interval);
        console.log('✅ Test Passed: All batches completed!');
      }
    }, 3000);
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

testAPI();
