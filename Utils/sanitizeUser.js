function sanitizeUser(user) {
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    active: user.active,
    submittedQuotes: user.submittedQuotes,
    boards: user.boards,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
module.exports = sanitizeUser;

