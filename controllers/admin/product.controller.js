const Product = require("../../models/product.model");

// [GET] /admin/products
module.exports.index = async (request, response) => {
    const products = await Product.find({
        deleted: false,
    });

    response.render("admin/pages/products/index.pug", {
        pageTitle: "Product List",
        products: products,
    });
};
