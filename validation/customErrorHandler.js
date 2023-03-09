// handle errors
const handleErrors = (err) => {
  let error;
  //incorrect email when loggin in
  if (err.message === "incorrect email") {
    return (error = "That email is not registered ");
  }
  //incorrect password when loggin in
  if (err.message === "incorrect password") {
    return (error = "That password is not registered");
  }

  if (err.code === 11000) {
    if (err.message.includes("index: email_1 ")) {
      return (error = "Email is already registered");
    }
    if (err.message.includes("index: username_1")) {
      return (error = "username already exist, try another");
    }
  }
  return error;
};

const handleBlogErrors = (err) => {
  let errors = {
    title: "",
    body: "",
  };

  if (err.code === 11000) {
    if (err.message.includes("test.articles index: title_1 dup key")) {
      errors.title = "Title already exist";
      return errors;
    }
  }
  if (err.message.includes("Article validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

module.exports = { handleErrors, handleBlogErrors };
