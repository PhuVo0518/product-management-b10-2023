const express = require("express");
const dotenv = require("dotenv");
const database = require("./config/database");

dotenv.config();

database.connect();

const routesAdmin = require("./routes/admin/index.route");
const routesClient = require("./routes/client/index.route");

const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

// Routes Admin
routesAdmin(app);

// Routes Client
routesClient(app);

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
