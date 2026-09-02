import { RequestHandler } from "express";
import { db } from "../../prisma/db";

const addToWatchlist: RequestHandler = async (req, res) => {
    const { movieId, rating, notes, status } = req.body;

    const movie = await db.orm.public.Movie.where({
        id: movieId
    }).first();

    if (!movie) {
        return res.status(404).json({
            statsu: 404,
            message: "Movie not found!",
            data: null
        })
    }

    const existingInWatchlist = await db.orm.public.WatchlistItem.first({
        userId: req.user?.id,
        movieId
    });

    if (existingInWatchlist) {
        return res.status(409).json({
            status: 409,
            message: "Movie already exists in your watchlist!",
            data: null,
        });
    }

    const watchlistItem = await db.orm.public.WatchlistItem.create({
        movieId,
        userId: req.user?.id,
        status: status || "PLANNED",
        rating,
        notes
    });

    res.status(201).json({
        status: 201,
        message: "WatchItem created successfully!",
        data: {
            watchlistItem
        }
    })
}

const removeFromWatchlist: RequestHandler = async (req, res) => {
    const watchlistItem = await db.orm.public.WatchlistItem.where({
        id: req.params.id as string
    }).first();


    if (!watchlistItem) {
        return res.status(404).json({
            status: 404,
            message: "Watchlist item not found!",
            data: null
        })
    }

    if (watchlistItem.userId !== req.user?.id) {
        return res.status(403).json({
            status: 403,
            message: "You are not authorized to delete this watchlist item!",
            data: null
        })
    }

    await db.orm.public.WatchlistItem.where({
        id: watchlistItem.id
    }).delete();

    res.status(200).json({
        status: 200,
        message: "Watchlist item deleted successfully!",
        data: null
    });
}

const updateWatchlistItem: RequestHandler = async (req, res) => {
    const { rating, notes, status } = req.body;

    const watchlistItem = await db.orm.public.WatchlistItem.where({
        id: req.params.id as string
    }).first();

    if (!watchlistItem) {
        return res.status(404).json({
            status: 404,
            message: "Watchlist item not found!",
            data: null
        })
    }

    if (watchlistItem.userId !== req.user?.id) {
        return res.status(403).json({
            status: 403,
            message: "You are not authorized to update this watchlist item!",
            data: null
        })
    }

    await db.orm.public.WatchlistItem.where({
        id: watchlistItem.id
    }).update({
        rating,
        notes,
        status
    });

    res.status(200).json({
        status: 200,
        message: "Watchlist item updated successfully!",
        data: {
            watchlistItem
        }
    });
}


export { addToWatchlist, removeFromWatchlist, updateWatchlistItem }