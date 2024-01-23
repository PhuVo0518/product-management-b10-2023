const Account = require("../../models/account.model");

// [GET] /admin/accounts/
module.exports.index = async (request, response) => {
  // Find
  let find = {
    deleted: false,
  };
  // End Find

  const records = await Account.find(find);

  response.render("admin/pages/accounts/index.pug", {
    pageTitle: "Account List",
    records: records,
  });
};
