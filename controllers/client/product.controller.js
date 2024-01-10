const Product = require("../../models/product.model");

// [GET] /products/
module.exports.index = async (request, response) => {
    const products = await Product.find({
        status: "active",
        deleted: false,
    }).sort({ position: "desc" });

    for (const item of products) {
        item.priceNew = item.price * (1 - item.discountPercentage / 100);
        item.priceNew = item.priceNew.toFixed(0);
    }

    response.render("client/pages/products/index.pug", {
        pageTitle: "Product List",
        products: products,
    });
};

// [GET] /products/:slug
module.exports.detail = async (request, response) => {
    try {
        const slug = request.params.slug;

        const product = await Product.findOne({
            slug: slug,
            deleted: false,
            status: "active",
        });

        response.render("client/pages/products/detail.pug", {
            pageTitle: product.title,
            product: product,
        });
    } catch (error) {
        response.redirect("/");
    }
};
