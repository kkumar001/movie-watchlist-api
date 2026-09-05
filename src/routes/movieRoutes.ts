import express from "express";
import { getAllMovies, addMovie, deleteMovie, updateMovie } from "../controllers/movieController";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateRequestMiddleware } from "../middleware/validateRequestMiddleware";
import { addMovieValidator, updateMovieValidator } from "../validators/movieValidators";

const router = express.Router();
router.use(authMiddleware);

router.get("/", getAllMovies);

router.post("/", validateRequestMiddleware(addMovieValidator), addMovie);

router.put("/:id", validateRequestMiddleware(updateMovieValidator), updateMovie);

router.delete("/:id", deleteMovie);

export default router;