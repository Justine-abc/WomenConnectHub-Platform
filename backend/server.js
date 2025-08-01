// server.js
const app = require("./app");
const http = require("http");
const server = http.createServer(app);

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});