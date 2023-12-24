const express = require("express");
const app = express();
const port = 3000;

app.set("views", "./views");
app.set("view engine", "pug");

app.get("/", (request, response) => {
    response.render("client/pages/home/index.pug");
});

app.get("/products", (request, response) => {
    response.render("client/pages/products/index.pug");
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
