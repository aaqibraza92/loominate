const api = {

  // SIGN_IN: '/gateway/users/login',
  SIGN_UP: "/auth/signup",
  // CHECK_EMAIL: '/gateway/users/check_email',
  // CHECK_USERNAME: '/gateway/users/check_username',
  VERIFY_CODE: "/auth/verify",
  GET_SECURITY_CODE: "/auth/sercuritycode",
  // CHECK_SECURITY_CODE: '/gateway/users/check_security_code',
  // CHANGE_PASSWORD: '/gateway/users/change_password',

  TENANT: "/tenant/username",

  GET_USER: "/gateway/user/:id",
  UPDATE_USER: "/user",
  DELETE_USER: "/gateway/user/:id",
  GATEWAY_BASE_URL: "/gateway",
  GET_CATEGORIES: "/gateway/category",
  GET_CATEGORY_DETAIL: "/gateway/category/:id",
  CATEGORIES: "/categories",
  CATEGORY_DETAIL: "/categories/:id",
  CATEGORY_FOLLOW: "/gateway/follows",
  CATEGORY_UNFOLLOW: "/gateway/follows/unfollow",
  CATEGORY_FOLLOW_MANY: "/gateway/follows/follow_many_categories",
  CATEGORY_UNFOLLOW_MANY: "/gateway/follows/unfollow_many_categories",

  COMPANY_SIGN_UP: "/gateway/companies",
  COMPANY_GET_LIST: "/gateway/companies",
  COMPANY_UPDATE: "/gateway/companies/:id",

  ADD_FEED: "/gateway/feed/add",
  RECENT_ACTIVITIES: "/activity/user",
  // Content

  // Reaction

  //

  POST: "/gateway/content",
  PUT: "gateway/put/content",
  DELETE: "gateway/delete/content",
  POST_DETAIL: "/gateway/posts/:id",
  POST_IN_REVIEW: "/gateway/posts/in_reviews",
  POST_CANCEL_REVIEW: "/gateway/posts/:id/cancel_review",
  POST_APPROVE_REVIEW: "/gateway/posts/:id/approve_review",
  POST_REMOVE_REVIEW: "/gateway/posts/:id/remove_content",
  VOTE: "/gateway/vote",
  POST_LIKE: "/gateway/posts/:id/like",
  POST_UNLIKE: "/gateway/posts/:id/unlike",
  POST_DISLIKE: "/gateway/posts/:id/dislike",
  POST_UNDISLIKE: "/gateway/posts/:id/undislike",
  POST_VOTE: "/gateway/posts/:id/vote",
  POST_VOTE_INITIATIVE: "/gateway/posts/:id/vote_initiative",

  COMMENTS: "/gateway/comments",
  COMMENT_EDIT: "/gateway/comments/:id",
  COMMENT_DELETE: "/gateway/comments/:id",
  COMMENT_LIKE: "/gateway/comments/:id/like",
  COMMENT_UNLIKE: "/gateway/comments/:id/unlike",
  COMMENT_DISLIKE: "/gateway/comments/:id/dislike",
  COMMENT_UNDISLIKE: "/gateway/comments/:id/undislike",

  BLOCK_USER: "/gateway/block_users/block",
  UNBLOCK_USER: "/gateway/xyz/blockUser/unblock",
  BLOCKED_USERS: "/gateway/xyz/blockUser/",
  IS_BLOCKED_USER : "/gateway/xyz/blockUser/isBlocked",

  CHAT_GET_LIST: "/gateway/chats",
  CHAT_GET_ROOM_FIREBASE: "/gateway/chats/get_room_firebase",
  CHAT_SEND_MESSAGE: "/gateway/chats/messages",
  CHAT_DETAIL: "/gateway/chats/:id",
  CHAT_DELETE: "/gateway/delete/chat",
  REPORT_SEND: "/gateway/reports",

  //admin
  REPORT_GET_ANALYTICS: "/gateway/reports",
  REPORT_GET_POSTS: "/gateway/reports/report_posts",
  REPORT_GET_HIDDEN_POSTS: "/gateway/reports/hidden_posts",
  REPORT_UPDATE_REPORTED_POST: "/gateway/reports/:id/update_post",
  REPORT_REPUBLISH_POST: "/gateway/posts/:id/republish",
  REPORT_GET_USERS: "/gateway/reports/report_users",
  REPORT_GET_HIDDEN_USERS: "/gateway/reports/hidden_users",
  REPORT_REPUBLISH_USER: "/gateway/users/:id/republish",
  REPORT_GET_MUTE_USERS: "/gateway/mute_users",
  REPORT_UPDATE_REPORTED_USER: "/gateway/reports/:id/update_user",

  NOTIFICATION_GET_LIST: "/gateway/notifications",
  NOTIFICATION_READ: "/gateway/notifications/read_notifications",

  MUTE_GET_USERS: "/gateway/mute_users",
  MUTE_USER: "/gateway/mute_users",
  MUTE_USER_UPDATE: "/gateway/mute_users/:id",

  LEADERBOARD_GET_LIST: "/gateway/l6/user/leaderboard",

  NOTIFICATION_EVENT_LOCAL_API : "http://localhost:3003/notification/subscribe",
  NOTIFICATION_EVENT_API : "https://notification.loominate.org/notification/subscribe",
  NOTIFICATION_API : "https://notification.loominate.org",
  NOTIFICATON_API_LOCAL : "http://localhost:3003"
};

export default api;
