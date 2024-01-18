module.exports.createPost = async (request, response, next) => {
  if (!request.body.title) {
    request.flash("error", "Title must NOT be empty!");
    response.redirect("back");
    return;
  }

  next();
};
