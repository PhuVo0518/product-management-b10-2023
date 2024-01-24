const Account = require("../../models/account.model");

const md5 = require("md5");

const systemConfig = require("../../config/system");

// [GET] /admin/auth/login
module.exports.login = async (request, response) => {
  response.render("admin/pages/auth/login.pug", {
    pageTitle: "Login",
  });
};

// [POST] /admin/auth/login
module.exports.loginPost = async (request, response) => {
  const email = request.body.email;
  const password = request.body.password;

  const user = await Account.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    request.flash("error", "This email does not exist!");
    response.redirect("back");
    return;
  }

  if (md5(password) != user.password) {
    request.flash("error", "Incorrect password!");
    response.redirect("back");
    return;
  }

  if (user.status != "active") {
    request.flash("error", "Your account is currently locked!");
    response.redirect("back");
    return;
  }

  response.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
};
