const md5 = require("md5");

const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

const generateHelper = require("../../helpers/generate.helper");

const systemConfig = require("../../config/system");

// [GET] /admin/accounts/
module.exports.index = async (request, response) => {
  // Find
  let find = {
    deleted: false,
  };
  // End Find

  const records = await Account.find(find);

  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
    });
    record.role = role;
  }

  response.render("admin/pages/accounts/index.pug", {
    pageTitle: "Account List",
    records: records,
  });
};

// [GET] /admin/accounts/create
module.exports.create = async (request, response) => {
  const roles = await Role.find({
    deleted: false,
  });

  response.render("admin/pages/accounts/create.pug", {
    pageTitle: "Add a new account",
    roles: roles,
  });
};

// [POST] /admin/accounts/create
module.exports.createPost = async (request, response) => {
  request.body.token = generateHelper.generateRandomString(30);
  request.body.password = md5(request.body.password);

  const record = new Account(request.body);
  await record.save();

  request.flash("success", "Add a new account successfully!");

  response.redirect(`/${systemConfig.prefixAdmin}/accounts`);
};

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (request, response) => {
  const find = {
    _id: request.params.id,
    deleted: false,
  };

  try {
    const data = await Account.findOne(find);

    const roles = await Role.find({
      deleted: false,
    });

    response.render("admin/pages/accounts/edit.pug", {
      pageTitle: "Edit an account",
      data: data,
      roles: roles,
    });
  } catch (error) {
    response.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  }
};

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (request, response) => {
  const id = request.params.id;

  if (request.body.password) {
    request.body.password = md5(request.body.password);
  } else {
    delete request.body.password;
  }

  await Account.updateOne(
    {
      _id: id,
    },
    request.body
  );

  response.redirect("back");
};
