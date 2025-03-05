const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ["credential", "google", "discord", "github"],
    },
    providerId: {
      type: String,
    },
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: [true, "Username must be unique."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: [true, "Email must be unique."],
      trim: true,
    },

    password: {
      type: String,
      required: function () {
        return this.provider === "credential"; 
      },
    },
    submittedQuotes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Quote",
      },
    ],
    boards: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Board",
      },
    ],
    role: {
      type: String,
      enum: {
        values: ["admin", "manger", "user"],
        message: "Role NOT valid.",
      },
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    resetCode: String,
    resetCodeExpiration: Date,
    verified: Boolean,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: String,
    verifyExpiration: Date,
  },
  { timestamps: true }
);

// Pre-save hook for hashing password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-findOneAndUpdate hook for hashing password
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update && update.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
    } catch (error) {
      return next(error);
    }
  }

  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
