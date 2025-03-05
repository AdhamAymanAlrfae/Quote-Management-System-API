exports.generateUniqueUsername = async (baseUsername,UserModel) => {
  baseUsername = baseUsername.toLowerCase().replace(/[^a-z0-9_]/g, ""); // Keep only a-z, 0-9, _

  const count = await UserModel.countDocuments({
    username: new RegExp(`^${baseUsername}\\d*$`, "i"), // Matches baseUsername + number
  });

  return count === 0 ? baseUsername : `${baseUsername}${count + 1}`;
};

