// Load the COMPILED Express app (CommonJS), not the TS source
const app = require('../backend/dist/index.js').default;

// Export for Vercel Serverless (CommonJS)
module.exports = app;
