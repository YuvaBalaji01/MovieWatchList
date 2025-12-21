const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const authMiddleware = require("../middleware/authMiddleware");


// ➕ ADD MOVIE (logged-in user only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, rating, watched,posterPath } = req.body;
    const userId = req.user.userId;

    // 🔒 Duplicate check per user
    const exists = await Movie.findOne({ title, userId });
    if (exists) {
      return res.status(409).json({
        message: "Movie already exists in your list"
      });
    }

    const movie = await Movie.create({
      title,
      rating,
      watched,
      posterPath,
      userId
    });

    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ✅ GET - Get all movies
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const movies = await Movie.find({ userId: req.user.userId });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ✅ PUT - Update movie (watched / rating)
 */
router.put("/:id/toggle", authMiddleware, async (req, res) => {
  try {
    const movie = await Movie.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    movie.watched = !movie.watched;
    await movie.save();

    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * ✅ DELETE - Remove a movie
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

    if (!deletedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
