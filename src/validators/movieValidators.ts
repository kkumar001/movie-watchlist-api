import { z } from "zod";

export const addMovieValidator = z.object({
    title: z
        .string({
            error: "Movie title is required",
        })
        .min(3, "Movie title must be at least 3 characters long"),

    overview: z
        .string()
        .optional(),

    releaseYear: z
        .number({
            error: "Release year is required",
        })
        .int("Release year must be a whole number")
        .min(1888, "Release year must be 1888 or later")
        .max(new Date().getFullYear(), "Release year cannot be in the future"),

    genres: z
        .array(z.string().min(1, "Genre cannot be empty"), {
            error: "Genres must be an array of strings",
        })
        .min(1, "At least one genre is required"),

    runtime: z
        .number({
            error: "Runtime must be a number",
        })
        .int("Runtime must be a whole number")
        .positive("Runtime must be greater than 0")
        .optional(),

    posterUrl: z
        .url("Please provide a valid poster URL")
        .optional(),
});

export const updateMovieValidator = z.object({
    overview: z
        .string()
        .optional(),

    releaseYear: z
        .number({
            error: "Release year is required",
        })
        .int("Release year must be a whole number")
        .min(1888, "Release year must be 1888 or later")
        .max(new Date().getFullYear(), "Release year cannot be in the future"),

    genres: z
        .array(z.string().min(1, "Genre cannot be empty"), {
            error: "Genres must be an array of strings",
        })
        .min(1, "At least one genre is required"),

    runtime: z
        .number({
            error: "Runtime must be a number",
        })
        .int("Runtime must be a whole number")
        .positive("Runtime must be greater than 0")
        .optional(),

    posterUrl: z
        .url("Please provide a valid poster URL")
        .optional(),
});