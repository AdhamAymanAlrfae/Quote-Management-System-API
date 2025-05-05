exports.generateUniqueUsername = async (baseUsername, UserModel) => {
  // Sanitize the base username: keep only a-z, 0-9, and _
  baseUsername = baseUsername.toLowerCase().replace(/[^a-z0-9_]/g, "");

  // Ensure the base username is not empty after sanitization
  if (!baseUsername) {
    baseUsername = "user";
  }

  // Limit the base username length to avoid overly long usernames
  const MAX_USERNAME_LENGTH = 20;
  baseUsername = baseUsername.slice(0, MAX_USERNAME_LENGTH);

  // Check for existing usernames and generate a unique one
  let uniqueUsername = baseUsername;
  let counter = 0;

  while (
    await UserModel.exists({ username: new RegExp(`^${uniqueUsername}$`, "i") })
  ) {
    counter++;
    uniqueUsername = `${baseUsername}${counter}`;

    // Ensure the username doesn't exceed the max length
    if (uniqueUsername.length > MAX_USERNAME_LENGTH) {
      uniqueUsername =
        uniqueUsername.slice(
          0,
          MAX_USERNAME_LENGTH - counter.toString().length
        ) + counter;
    }
  }

  return uniqueUsername;
};
