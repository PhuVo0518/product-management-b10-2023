const Product = require("../../models/product.model");
const filterStateHelper = require("../../helpers/filter-state.helper");

// [GET] /admin/products
module.exports.index = async (request, response) => {
    // Feature: Filter by State
    const filterState = filterStateHelper(request.query);
    // End Feature: Filter by State

    const find = {
        deleted: false,
    };

    if (request.query.status) {
        find.status = request.query.status;
    }

    // Feature: Search
    if (request.query.keyword) {
        const regex = new RegExp(request.query.keyword, "i");
        find.title = regex;
    }
    // End Feature: Search

    const products = await Product.find(find);

    response.render("admin/pages/products/index.pug", {
        pageTitle: "Product List",
        products: products,
        filterState: filterState,
        keyword: request.query.keyword,
    });
};
