
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { getUsers, saveUsers } from "../config/database";

// Registrar usuario
export const registerUser = async (
    username: string,
    email: string,
    password: string
): Promise<User> => {

    username = username.trim();
    email = email.trim().toLowerCase();

    const users = getUsers();

    const existingUser = users.find(
        user => user.email === email
    );

    if (existingUser) {
        throw new Error("El correo electrónico ya está registrado");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
        id: users.length > 0
            ? Math.max(...users.map(user => user.id)) + 1
            : 1,
        username,
        email,
        password: hashedPassword,
        victories: 0,
        defeats: 0,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    return newUser;
};

// Iniciar sesión
export const loginUser = async (
    email: string,
    password: string
) => {

    email = email.trim().toLowerCase();

    const users = getUsers();

    const user = users.find(
        user => user.email === email
    );

    if (!user) {
        throw new Error("Correo o contraseña incorrectos");
    }

    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatch) {
        throw new Error("Correo o contraseña incorrectos");
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("No se ha configurado la clave JWT");
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        secret,
        { expiresIn: "24h" }
    );

    return {
        user,
        token
    };
};

// Consultar usuario por ID
export const getUserById = (id: number): User | undefined => {
    const users = getUsers();

    return users.find(user => user.id === id);
};

// Actualizar perfil
export const updateUser = (
    userId: number,
    updates: { username?: string; email?: string }
): User => {

    const users = getUsers();

    const user = users.find(u => u.id === userId);

    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    if (updates.email !== undefined) {
        const normalizedEmail = updates.email.trim().toLowerCase();

        const emailExists = users.some(
            u => u.email === normalizedEmail && u.id !== userId
        );

        if (emailExists) {
            throw new Error("El correo ya está registrado");
        }

        user.email = normalizedEmail;
    }

    if (updates.username !== undefined) {
        user.username = updates.username.trim();
    }

    saveUsers(users);

    return user;
};
