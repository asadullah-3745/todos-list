require("dotenv").config();
const app = require("./app");
const db = require("./models/index.js");

const PORT = process.env.PORT || 5000;

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Database sync error:", err);
});
