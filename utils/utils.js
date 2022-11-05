module.exports.readTime = (post) => {
  const totalWords = post.split(" ").length;

  //setting read_time that an average user takes a minutes to read of 200
  let wordsAMinute = totalWords / 200;
  if (Math.round(wordsAMinute) === 0) {
    return wordsAMinute = +1;
  } else {
    Math.round(wordsAMinute);
  }
};
