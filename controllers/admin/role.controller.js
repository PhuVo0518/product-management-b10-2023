const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

// [GET] /admin/roles/
module.exports.index = async (request, response) => {
  const records = await Role.find({
    deleted: false,
  });

  response.render("admin/pages/roles/index.pug", {
    pageTitle: "Roles",
    records: records,
  });
};

// [GET] /admin/roles/create
module.exports.create = (request, response) => {
  response.render("admin/pages/roles/create.pug", {
    pageTitle: "Add a new role",
  });
};

// [POST] /admin/roles/create
module.exports.createPost = async (request, response) => {
  const record = new Role(request.body);

  await record.save();

  request.flash("success", "Add a new role successfully!");

  response.redirect(`/${systemConfig.prefixAdmin}/roles`);
};

// [GET] /admin/roles/edit/:id
module.exports.edit = async (request, response) => {
  try {
    const id = request.params.id;
    const record = await Role.findOne({
      _id: id,
      deleted: false,
    });

    response.render("admin/pages/roles/edit.pug", {
      pageTitle: "Edit a role",
      record: record,
    });
  } catch (error) {
    response.redirect(`/${systemConfig.prefixAdmin}/roles`);
  }
};

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (request, response) => {
  try {
    const id = request.params.id;

    await Role.updateOne(
      {
        _id: id,
        deleted: false,
      },
      request.body
    );

    request.flash("success", "Update the role successfully!");

    response.redirect("back");
  } catch (error) {
    request.redirect(`/${systemConfig.prefixAdmin}/roles`);
  }
};

// [GET] /admin/roles/permissions
module.exports.permissions = async (request, response) => {
  const records = await Role.find({
    deleted: false,
  });

  response.render(`admin/pages/roles/permissions.pug`, {
    pageTitle: "Permissions",
    records: records,
  });
};

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (request, response) => {
  const roles = JSON.parse(request.body.roles);

  try {
    for (const item of roles) {
      await Role.updateOne(
        {
          _id: item.id,
        },
        {
          permissions: item.permissions,
        }
      );
    }

    request.flash("success", "Update permissions successfully!");
  } catch (error) {
    request.flash("error", "Update permissions unsuccessfully!");
  }

  response.redirect("back");
};
