import { RequestHandler } from "express";
import { db } from "../../prisma/db";

const getAllMovies: RequestHandler = async (req, res) => {
    const pageNum = Number(req.query.page) || 1;
    const pageSizeNum = Number(req.query.pageSize) || 10;

    const [movies, countResult] = await Promise.all([
        db.orm.public.Movie
            .offset((pageNum - 1) * pageSizeNum)
            .limit(pageSizeNum)
            .all(),
        db.orm.public.Movie.aggregate((a) => ({ total: a.count() })),
    ]);

    const total = countResult.total;
    const totalPages = Math.ceil(total / pageSizeNum);

    if (pageNum > totalPages) {
        res.status(404).json({
            status: 404,
            message: "Page number should be less than or equal to Total pages",
            data: null
        })
    }

    res.status(200).json({
        status: 200,
        message: "Movies fetched successfully!",
        data: {
            movies: movies.map(({ createdBy, ...rest }) => rest),
            totalPages,
            page: pageNum,
            pageSize: pageSizeNum,
        },
    });
};

const addMovie: RequestHandler = async (req, res) => {
    const { title, overview, releaseYear, genres, runtime, posterUrl } = req.body;

    const existingMovie = await db.orm.public.Movie
        .where({
            title,
            releaseYear,
        })
        .first();

    if (existingMovie) {
        return res.status(409).json({
            status: 409,
            message: "Movie already exists!",
            data: null,
        });
    }

    const movie = await db.orm.public.Movie.create({
        title,
        overview,
        releaseYear,
        genres,
        runtime,
        posterUrl,
        createdBy: req.user?.id
    });

    res.status(201).json({
        status: 201,
        message: "Movie created successfully!",
        data: {
            movie
        }
    });
}

const updateMovie: RequestHandler = async (req, res) => {
    const { genres, overview, posterUrl, runtime, releaseYear } = req.body;

    const movie = await db.orm.public.Movie.where({
        id: req.params.id as string,
    }).first();

    if (!movie) {
        res.status(404).json({
            status: 404,
            message: "Movie doesn't exists!",
            data: null
        })
    }

    if (movie?.createdBy !== req.user?.id) {
        return res.status(403).json({
            status: 403,
            message: "You are not authorized to update this movie!",
            data: null
        })
    }

    const updatedMovie = await db.orm.public.Movie.where({
        id: movie?.id
    }).update({
        genres,
        overview,
        posterUrl,
        runtime,
        releaseYear
    });

    res.status(200).json({
        status: 200,
        message: "Watchlist item updated successfully!",
        data: {
            movie: updatedMovie
        }
    });
}

const deleteMovie: RequestHandler = async (req, res) => {
    const movie = await db.orm.public.Movie.where({
        id: req.params.id as string
    }).first();

    if (!movie) {
        res.status(404).json({
            status: 404,
            message: "Movie doesn't exists!",
            data: null
        })
    }

    if (movie?.createdBy !== req.user?.id) {
        return res.status(403).json({
            status: 403,
            message: "You are not authorized to delete this movie!",
            data: null
        })
    }

    await db.orm.public.Movie.where({
        id: movie?.id
    }).delete();

    res.status(200).json({
        status: 200,
        message: "Movie deleted successfully!",
        data: null
    });
}

export { getAllMovies, addMovie, deleteMovie, updateMovie };