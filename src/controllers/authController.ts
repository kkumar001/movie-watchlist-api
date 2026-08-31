import { RequestHandler } from 'express';
import { db } from '../../prisma/db';
import bcrypt from "bcrypt";
import { generateToken } from '../utils/generateToken';

const register: RequestHandler = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            status: 400,
            message: "Name, email and password are required!",
            data: null,
        });
    }

    const userExists = await db.orm.public.User
        .where({
            email,
        })
        .first();

    if (userExists) {
        return res.status(409).json({
            status: 409,
            message: "User already exists with this email!",
            data: null
        })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await db.orm.public.User.create({
        email,
        name,
        password: hashedPassword
    });

    const token = generateToken(user.id, res);

    res.status(201).json({
        status: 201,
        message: "User created successfully!",
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            },
            token
        }
    });
};

const login: RequestHandler = async (req, res) => {
    const { email, password } = req.body;

    const user = await db.orm.public.User
        .where({
            email,
        })
        .first();

    if (!user) {
        return res.status(401).json({
            status: 401,
            message: "Invalid email or password!",
            data: null
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({
            status: 401,
            message: "Invalid email or password!",
            data: null
        });
    }

    const token = generateToken(user.id, res);

    res.status(201).json({
        status: 201,
        message: "User logged in successfully!",
        data: {
            user: {
                id: user.id,
                email: user.email
            },
            token
        }
    });
}

const logout: RequestHandler = async (_, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({
        status: 200,
        message: "Logout successfully!",
        data: null
    })
}

export { register, login, logout };