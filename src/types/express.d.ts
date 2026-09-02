import { FieldInputTypes } from "../../prisma/contract";

declare global {
    namespace Express {
        interface Request {
            user?: FieldInputTypes["public"]["User"];
        }
    }
}