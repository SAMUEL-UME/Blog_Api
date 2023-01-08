// handle errors
const handleErrors = (err) => {
    let errors = {
      username: "",
      email: "",
      password: "",
    };
    //incorrect email when loggin in
    if (err.message === "incorrect email") {
      errors.email = "That email is not registered ";
    }
    //incorrect password when loggin in
    if (err.message === "incorrect password") {
      errors.password = "That password is not registered";
    }
  
  
    if (err.code === 11000) {
      if (err.message.includes("index: email_1 ")) {
        errors.email = "Email is already registered";
      }
      if (err.message.includes("index: username_1")) {
        errors.username = "username already exist, try another";
      }
  
    }
    // validation errors
    if (err.message.includes("User validation failed")) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
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

  
module.exports = {handleErrors, handleBlogErrors};