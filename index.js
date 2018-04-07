require('dotenv').config();

const app = require('./src/config/server');
const db = require('./src/config/db');

const port = process.env.PORT || 3000;

db.sequelize.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running in port ${port}`);
      console.log(`Access http://localhost:${port}`);
    });
  });
