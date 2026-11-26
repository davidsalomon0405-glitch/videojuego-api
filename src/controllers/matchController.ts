import { Request, Response } from "express";
import {
    createMatch,
    getAvailableMatches,
    joinMatch,
    getMatchesByPlayer,
    getMatchById,
    cancelMatch
} from "../services/matchService";
import {
    performAction,
    CombatAction
} from "../services/combatService";

// Crear partida
export const create = (req: Request, res: Response): void => {
    try {
        const { characterId } = req.body;

        if (!Number.isInteger(characterId) || characterId <= 0) {
            res.status(400).json({ mensaje: "ID de personaje inválido" });
            return;
        }

        const match = createMatch(req.userId!, characterId);

        res.status(201).json({
            mensaje: "Partida creada correctamente",
            partida: match
        });
    } catch (error) {
        res.status(400).json({
            mensaje: error instanceof Error ? error.message : "Error al crear partida"
        });
    }
};

// Listar partidas disponibles
export const getAvailable = (req: Request, res: Response): void => {
    res.status(200).json({
        partidas: getAvailableMatches(req.userId!)
    });
};

// Unirse a una partida
export const join = (req: Request, res: Response): void => {
    try {
        const { characterId } = req.body;
        const matchId = Number(req.params.id);

        if (!Number.isInteger(characterId) || characterId <= 0 || !Number.isInteger(matchId) || matchId <= 0) {
            res.status(400).json({ mensaje: "Datos inválidos" });
            return;
        }

        const match = joinMatch(matchId, req.userId!, characterId);

        res.status(200).json({
            mensaje: "Te has unido a la partida",
            partida: match
        });
    } catch (error) {
        res.status(400).json({
            mensaje: error instanceof Error ? error.message : "Error al unirse"
        });
    }
};

// Consultar partidas del usuario
export const getAll = (req: Request, res: Response): void => {
    res.status(200).json({
        partidas: getMatchesByPlayer(req.userId!)
    });
};

// Consultar partida por ID

export const getOne = (req: Request, res: Response): void => {
    const matchId = Number(req.params.id);

    if (!Number.isInteger(matchId) || matchId <= 0) {
        res.status(400).json({
            mensaje: "ID de partida inválido"
        });
        return;
    }

    const match = getMatchById(matchId);

    if (
        !match ||
        (match.player1Id !== req.userId && match.player2Id !== req.userId)
    ) {
        res.status(404).json({
            mensaje: "Partida no encontrada"
        });
        return;
    }

    res.status(200).json({ partida: match });
};


// Ejecutar acción de combate
export const action = (req: Request, res: Response): void => {
    try {
        const { action: combatAction } = req.body;
        const matchId = Number(req.params.id);

        const validActions: CombatAction[] = [
            "attack",
            "defend",
            "special",
            "heal"
        ];

        if (!Number.isInteger(matchId) || matchId <= 0) {
            res.status(400).json({ mensaje: "ID de partida inválido" });
            return;
        }

        if (!validActions.includes(combatAction)) {
            res.status(400).json({
                mensaje: "Acción inválida. Usa attack, defend, special o heal"
            });
            return;
        }

        const match = performAction(
            matchId,
            req.userId!,
            combatAction
        );

        res.status(200).json({
            mensaje: "Acción ejecutada correctamente",
            partida: match
        });
    } catch (error) {
        res.status(400).json({
            mensaje: error instanceof Error ? error.message : "Error al ejecutar acción"
        });
    }
};

// Cancelar partida
export const cancel = (req: Request, res: Response): void => {
    try {
        const match = cancelMatch(Number(req.params.id), req.userId!);

        res.status(200).json({
            mensaje: "Partida cancelada",
            partida: match
        });
    } catch (error) {
        res.status(400).json({
            mensaje: error instanceof Error ? error.message : "Error al cancelar partida"
        });
    }
};