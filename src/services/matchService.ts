
import { Match } from "../models/Match";
import { getMatches, saveMatches } from "../config/database";
import { getCharacterById } from "./characterService";

export const createMatch = (
    playerId: number,
    characterId: number
): Match => {
    const character = getCharacterById(characterId, playerId);

    if (!character) {
        throw new Error("El personaje no existe o no te pertenece");
    }

    const matches = getMatches();

    const newMatch: Match = {
        id: matches.length > 0
            ? Math.max(...matches.map(m => m.id)) + 1
            : 1,
        player1Id: playerId,
        player2Id: null,
        character1Id: characterId,
        character2Id: null,
        status: "pending",
        currentTurn: playerId,
        winnerId: null,
        defendingPlayerId: null,
        createdAt: new Date().toISOString()
    };

    matches.push(newMatch);
    saveMatches(matches);

    return newMatch;
};

// Listar partidas disponibles
export const getAvailableMatches = (playerId: number): Match[] => {
    return getMatches().filter(
        match => match.status === "pending" && match.player1Id !== playerId
    );
};

// Unirse a una partida
export const joinMatch = (
    matchId: number,
    playerId: number,
    characterId: number
): Match => {
    const matches = getMatches();
    const match = matches.find(m => m.id === matchId);

    if (!match) throw new Error("Partida no encontrada");
    if (match.status !== "pending") throw new Error("La partida no está disponible");
    if (match.player1Id === playerId) throw new Error("No puedes unirte a tu propia partida");

    const character = getCharacterById(characterId, playerId);

    if (!character) {
        throw new Error("El personaje no existe o no te pertenece");
    }

    match.player2Id = playerId;
    match.character2Id = characterId;
    match.status = "in_progress";
    match.currentTurn = match.player1Id;
    match.defendingPlayerId = null;

    saveMatches(matches);

    return match;
};

// Consultar partidas de un jugador
export const getMatchesByPlayer = (playerId: number): Match[] => {
    return getMatches().filter(
        m => m.player1Id === playerId || m.player2Id === playerId
    );
};

// Consultar partida por ID
export const getMatchById = (matchId: number): Match | undefined => {
    return getMatches().find(m => m.id === matchId);
};

// Finalizar partida
export const finishMatch = (
    matchId: number,
    playerId: number,
    winnerId: number
): Match => {
    const matches = getMatches();
    const match = matches.find(m => m.id === matchId);

    if (!match) throw new Error("Partida no encontrada");
    if (match.status !== "in_progress") {
        throw new Error("La partida no está en curso");
    }

    if (match.player1Id !== playerId && match.player2Id !== playerId) {
        throw new Error("No perteneces a esta partida");
    }

    if (winnerId !== match.player1Id && winnerId !== match.player2Id) {
        throw new Error("El ganador no pertenece a esta partida");
    }

    match.status = "finished";
    match.winnerId = winnerId;

    saveMatches(matches);

    return match;
};

// Cancelar partida
export const cancelMatch = (
    matchId: number,
    playerId: number
): Match => {
    const matches = getMatches();
    const match = matches.find(m => m.id === matchId);

    if (!match) throw new Error("Partida no encontrada");
    if (match.status !== "pending") {
        throw new Error("Solo se pueden cancelar partidas pendientes");
    }

    if (match.player1Id !== playerId) {
        throw new Error("No puedes cancelar esta partida");
    }

    match.status = "cancelled";

    saveMatches(matches);

    return match;
};
