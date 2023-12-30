const Product = require("../../models/product.model");

// [GET] /admin/products
module.exports.index = async (request, response) => {
    // Feature: Filter by State
    const filterState = [
        {
            name: "All",
            status: "",
            class: "",
        },
        {
            name: "Active",
            status: "active",
            class: "",
        },
        {
            name: "Inactive",
            status: "inactive",
            class: "",
        },
    ];

    if (request.query.status) {
        const index = filterState.findIndex(
            (item) => (item.status = request.query.status)
        );
        filterState[index].class = "active";
    } else {
        filterState[0].class = "active";
    }

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
