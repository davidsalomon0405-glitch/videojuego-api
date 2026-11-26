


import { Request, Response } from "express";
import {
    createCharacter,
    getCharactersByUser,
    getCharacterById,
    updateCharacter,
    deleteCharacter
} from "../services/characterService";

import { CharacterClass } from "../models/Character";

// Crear personaje
export const create = (req: Request, res: Response): void => {
    try {
        const { name, class: characterClass } = req.body;

        if (!name || !["warrior", "mage", "archer"].includes(characterClass)) {
            res.status(400).json({
                mensaje: "Nombre y clase válida son obligatorios"
            });
            return;
        }

        const character = createCharacter(
            req.userId!,
            name,
            characterClass as CharacterClass
        );

        res.status(201).json({
            mensaje: "Personaje creado correctamente",
            personaje: character
        });

    } catch {
        res.status(500).json({ mensaje: "Error al crear personaje" });
    }
};

// Listar personajes del usuario
export const getAll = (req: Request, res: Response): void => {
    const characters = getCharactersByUser(req.userId!);

    res.status(200).json({ personajes: characters });
};

// Consultar personaje por ID
export const getOne = (req: Request, res: Response): void => {
    const id = Number(req.params.id);

    const character = getCharacterById(id, req.userId!);

    if (!character) {
        res.status(404).json({ mensaje: "Personaje no encontrado" });
        return;
    }

    res.status(200).json({ personaje: character });
};

// Actualizar personaje
export const update = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    const { name } = req.body;

    if (name !== undefined && (typeof name !== "string" || !name.trim())) {
        res.status(400).json({ mensaje: "Nombre inválido" });
        return;
    }

    const character = updateCharacter(id, req.userId!, { name });

    if (!character) {
        res.status(404).json({ mensaje: "Personaje no encontrado" });
        return;
    }

    res.status(200).json({
        mensaje: "Personaje actualizado correctamente",
        personaje: character
    });
};

// Eliminar personaje

export const remove = (req: Request, res: Response): void => {
    try {
        const id = Number(req.params.id);

        const deleted = deleteCharacter(id, req.userId!);

        if (!deleted) {
            res.status(404).json({ mensaje: "Personaje no encontrado" });
            return;
        }

        res.status(200).json({
            mensaje: "Personaje eliminado correctamente"
        });
    } catch (error) {
        res.status(400).json({
            mensaje: error instanceof Error
                ? error.message
                : "Error al eliminar personaje"
        });
    }
};
