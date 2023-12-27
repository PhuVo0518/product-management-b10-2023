const Product = require("../../models/product.model");

// [GET] /products/
module.exports.index = async (request, response) => {
    const products = await Product.find({
        status: "active",
        deleted: false,
    });

    for (const item of products) {
        item.priceNew = item.price * (1 - item.discountPercentage / 100);
        item.priceNew = item.priceNew.toFixed(0);
    }

    response.render("client/pages/products/index.pug", {
        pageTitle: "Product List",
        products: products,
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
