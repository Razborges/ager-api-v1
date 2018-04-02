require('dotenv').config();

const app = require('./src/config/server');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running in port ${port}`);
  console.log(`Access http://localhost:${port}`);
});
