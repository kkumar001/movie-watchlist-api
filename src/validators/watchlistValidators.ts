import { z } from 'zod';

export const addToWatchlistSchema = z.object({
    movieId: z.uuid(),
    status: z.enum(['PLANNED', 'WATCHING', 'COMPLETED', 'DROPPED'], {
        error: () => ({
            message: 'Status must be one of the following: PLANNED, WATCHING, COMPLETED, DROPPED'
        })
    }).optional(),
    rating: z.coerce.number().int("Rating must be an integer").min(0).max(10).optional(),
    notes: z.string().optional(),
})