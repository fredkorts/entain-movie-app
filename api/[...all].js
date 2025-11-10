// CommonJS serverless function that loads compiled Express app
const app = require('../backend/dist/index.js').default;
module.exports = app;
