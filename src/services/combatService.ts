
import { Match } from "../models/Match";
import { getMatches, saveMatches, getUsers, saveUsers } from "../config/database";
import { getCharacterById } from "./characterService";

export type CombatAction = "attack" | "defend" | "special" | "heal";

export const performAction = (
    matchId: number,
    playerId: number,
    action: CombatAction
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

    if (match.currentTurn !== playerId) {
        throw new Error("No es tu turno");
    }

    if (!match.player2Id || !match.character2Id) {
        throw new Error("La partida todavía no tiene dos jugadores");
    }

    const isPlayer1 = playerId === match.player1Id;

    const ownCharacterId = isPlayer1
        ? match.character1Id
        : match.character2Id;

    const enemyCharacterId = isPlayer1
        ? match.character2Id
        : match.character1Id;

    const ownCharacter = getCharacterById(ownCharacterId, playerId);
    const enemyPlayerId = isPlayer1 ? match.player2Id : match.player1Id;
    const enemyCharacter = getCharacterById(enemyCharacterId, enemyPlayerId);

    if (!ownCharacter || !enemyCharacter) {
        throw new Error("No se encontraron los personajes de la partida");
    }

    // Inicializar la vida propia de esta partida
    if (match.character1Health === undefined) {
        match.character1Health = getCharacterById(
            match.character1Id,
            match.player1Id
        )!.maxHealth;
    }

    if (match.character2Health === undefined) {
        match.character2Health = getCharacterById(
            match.character2Id,
            match.player2Id
        )!.maxHealth;
    }

    const ownHealth = isPlayer1
        ? match.character1Health
        : match.character2Health;

    const enemyHealth = isPlayer1
        ? match.character2Health
        : match.character1Health;

    if (ownHealth <= 0) throw new Error("Tu personaje está derrotado");
    if (enemyHealth <= 0) throw new Error("El personaje rival está derrotado");

    if (!["attack", "defend", "special", "heal"].includes(action)) {
        throw new Error("Acción no válida");
    }

    let message = "";

    switch (action) {
        case "attack": {
            let damage = Math.max(
                1,
                ownCharacter.attack - enemyCharacter.defense
            );

            if (match.defendingPlayerId === enemyPlayerId) {
                damage = Math.ceil(damage / 2);
                match.defendingPlayerId = null;
            }

            if (isPlayer1) {
                match.character2Health = Math.max(0, enemyHealth - damage);
            } else {
                match.character1Health = Math.max(0, enemyHealth - damage);
            }

            message = `Ataque realizado. Daño causado: ${damage}`;
            break;
        }

        case "defend": {
            match.defendingPlayerId = playerId;
            message = "Te has preparado para reducir el próximo ataque";
            break;
        }

        case "special": {
            const alreadyUsed = isPlayer1
                ? match.specialUsedPlayer1
                : match.specialUsedPlayer2;

            if (alreadyUsed) {
                throw new Error("Ya utilizaste tu habilidad especial");
            }

            const damage = Math.max(
                1,
                Math.floor(
                    (ownCharacter.attack * 1.5) - enemyCharacter.defense
                )
            );

            if (isPlayer1) {
                match.character2Health = Math.max(0, enemyHealth - damage);
                match.specialUsedPlayer1 = true;
            } else {
                match.character1Health = Math.max(0, enemyHealth - damage);
                match.specialUsedPlayer2 = true;
            }

            message = `Habilidad especial utilizada. Daño causado: ${damage}`;
            break;
        }

        case "heal": {
            const alreadyUsed = isPlayer1
                ? match.healUsedPlayer1
                : match.healUsedPlayer2;

            if (alreadyUsed) {
                throw new Error("Ya utilizaste tu curación");
            }

            const healing = 30;
            const newHealth = Math.min(
                ownCharacter.maxHealth,
                ownHealth + healing
            );

            if (isPlayer1) {
                match.character1Health = newHealth;
                match.healUsedPlayer1 = true;
            } else {
                match.character2Health = newHealth;
                match.healUsedPlayer2 = true;
            }

            message = `Te has curado. Vida actual: ${newHealth}`;
            break;
        }
    }

    // Comprobar si el rival fue derrotado
    const updatedEnemyHealth = isPlayer1
        ? match.character2Health!
        : match.character1Health!;

    if (updatedEnemyHealth <= 0) {
        match.status = "finished";
        match.winnerId = playerId;

        const users = getUsers();
        const winner = users.find(user => user.id === playerId);
        const loser = users.find(user => user.id === enemyPlayerId);

        if (winner) winner.victories++;
        if (loser) loser.defeats++;

        saveUsers(users);
    } else {
        // Pasar el turno al otro jugador
        match.currentTurn = enemyPlayerId;
    }

    saveMatches(matches);

    return match;
};