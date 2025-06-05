const { PRIORITY } = require('../utils/enums');

let ingestionStore = {}; 
let batchQueue = [];     

module.exports = {
  ingestionStore,
  batchQueue,
  PRIORITY
};
