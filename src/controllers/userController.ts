

import { Request, Response } from "express";
import {
    registerUser,
    loginUser,
    getUserById,
    updateUser
} from "../services/userService";



// Registrar usuario

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;

        if (
            typeof username !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !username.trim() ||
            !email.trim() ||
            !password
        ) {
            res.status(400).json({
                mensaje: "Todos los campos son obligatorios y deben ser válidos"
            });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({
                mensaje: "La contraseña debe tener mínimo 6 caracteres"
            });
            return;
        }

        const user = await registerUser(username, email, password);

        res.status(201).json({
            mensaje: "Usuario registrado correctamente",
            usuario: {
                id: user.id,
                username: user.username,
                email: user.email,
                victories: user.victories,
                defeats: user.defeats,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        res.status(400).json({
            mensaje: error instanceof Error
                ? error.message
                : "Error al registrar usuario"
        });
    }
};

// Iniciar sesión
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                mensaje: "El correo y la contraseña son obligatorios"
            });
            return;
        }

        const result = await loginUser(email, password);

        res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            token: result.token,
            usuario: {
                id: result.user.id,
                username: result.user.username,
                email: result.user.email,
                victories: result.user.victories,
                defeats: result.user.defeats
            }
        });

    } catch (error) {
        res.status(401).json({
            mensaje: error instanceof Error
                ? error.message
                : "Error al iniciar sesión"
        });
    }
};

// Consultar perfil
export const getProfile = (req: Request, res: Response): void => {
    const user = getUserById(req.userId!);

    if (!user) {
        res.status(404).json({
            mensaje: "Usuario no encontrado"
        });
        return;
    }

    res.status(200).json({
        usuario: {
            id: user.id,
            username: user.username,
            email: user.email,
            victories: user.victories,
            defeats: user.defeats
        }
    });
};

// Actualizar perfil
export const updateProfile = (req: Request, res: Response): void => {
    try {
        const { username, email } = req.body;

        if (!username && !email) {
            res.status(400).json({
                mensaje: "Debes proporcionar un nombre o correo para actualizar"
            });
            return;
        }

        if (
            (username !== undefined && (typeof username !== "string" || !username.trim())) ||
            (email !== undefined && (typeof email !== "string" || !email.trim()))
        ) {
            res.status(400).json({
                mensaje: "Los datos proporcionados no son válidos"
            });
            return;
        }

        const user = updateUser(req.userId!, {
            username: username?.trim(),
            email: email?.trim()
        });

        res.status(200).json({
            mensaje: "Perfil actualizado correctamente",
            usuario: {
                id: user.id,
                username: user.username,
                email: user.email,
                victories: user.victories,
                defeats: user.defeats
            }
        });

    } catch (error) {
        res.status(400).json({
            mensaje: error instanceof Error
                ? error.message
                : "Error al actualizar perfil"
        });
    }
};