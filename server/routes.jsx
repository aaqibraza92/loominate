const FeedPage = require("../src/pages/feed");
const PostPage = require("../src/pages/post");

module.exports = [
  {
    path: "/",
    exact: true,
    component: FeedPage,
  },
  {
    path: "/post/:id",
    exact: true,
    component: PostPage,
  },
];
