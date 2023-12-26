// [GET] /products/
module.exports.index = (request, response) => {
    response.render("client/pages/products/index.pug", {
        pageTitle: "Product List",
    });
};

// // [GET] /products/detail
// module.exports.detail = (request, response) => {
//     response.send("Product Detail");
// };

// // [GET] /products/edit
// module.exports.edit = (request, response) => {
//     response.send("Product Edit");
// };

// // [GET] /products/create
// module.exports.create = (request, response) => {
//     response.send("Product Create");
// };
