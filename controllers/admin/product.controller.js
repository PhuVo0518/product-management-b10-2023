const Product = require("../../models/product.model");
const filterStateHelper = require("../../helpers/filter-state.helper");
const paginationHelper = require("../../helpers/pagination.helper");
const systemConfig = require("../../config/system");

// [GET] /admin/products
module.exports.index = async (request, response) => {
    try {
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

        // Feature: Pagination
        const countProducts = await Product.countDocuments(find);
        const objectPagination = paginationHelper(
            4,
            request.query,
            countProducts
        );

        // End Feature: Pagination

        const products = await Product.find(find)
            .limit(objectPagination.limitItems)
            .skip(objectPagination.skip);

        response.render("admin/pages/products/index.pug", {
            pageTitle: "Product List",
            products: products,
            filterState: filterState,
            keyword: request.query.keyword,
            pagination: objectPagination,
        });
    } catch (error) {
        console.log(error);
        response.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
};
