const express = require("express");
const dotenv = require("dotenv");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const database = require("./config/database");
const systemConfig = require("./config/system");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");

dotenv.config();

database.connect();

const routesAdmin = require("./routes/admin/index.route");
const routesClient = require("./routes/client/index.route");

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride(`_method`));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.use(express.static(`${__dirname}/public`));

// Express-flash
app.use(cookieParser("keyboard cat"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End Express-flash

// App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Routes Admin
routesAdmin(app);

// Routes Client
routesClient(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
