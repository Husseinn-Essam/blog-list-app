const _ = require("lodash");
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const sum = blogs.reduce((acc, curr) => {
    return acc + curr.likes;
  }, 0);
  return sum;
};

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? null
    : blogs.reduce((max, curr) => {
        return curr.likes > max.likes ? curr : max;
      }, blogs[0]);
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;
  const authorCounts = _.countBy(blogs, "author");
  const authorWMax = _.maxBy(_.entries(authorCounts), ([, count]) => count);
  return { author: authorWMax[0], blogs: authorWMax[1] };
};

const mostLikes = (blogs) => {
  const likesByAuthor = _.groupBy(blogs, "author");

  const authorsWithLikes = _.map(likesByAuthor, (blogs, author) => {
    const totalLikes = _.sumBy(blogs, "likes");
    return { author, likes: totalLikes };
  });

  const topAuthor = _.maxBy(authorsWithLikes, "likes");

  return topAuthor;
};
module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
