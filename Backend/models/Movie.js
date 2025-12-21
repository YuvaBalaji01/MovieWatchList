const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: String,
    rating: Number,
    watched: {
      type: Boolean,
      default: false
    },

    posterPath: {
     type: String
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
