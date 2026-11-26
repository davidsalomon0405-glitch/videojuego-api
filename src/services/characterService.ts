
import { Character, CharacterClass } from "../models/Character";
import { getCharacters, saveCharacters, getMatches } from "../config/database";

export const createCharacter = (
    userId: number,
    name: string,
    characterClass: CharacterClass
): Character => {
    const characters = getCharacters();

    const attributes = {
        warrior: { health: 150, attack: 25, defense: 20, speed: 10 },
        mage: { health: 100, attack: 35, defense: 10, speed: 15 },
        archer: { health: 120, attack: 30, defense: 15, speed: 20 }
    };

    const stats = attributes[characterClass];

    const newCharacter: Character = {
        id: characters.length > 0
            ? Math.max(...characters.map(c => c.id)) + 1
            : 1,
        userId,
        name: name.trim(),
        class: characterClass,
        level: 1,
        health: stats.health,
        maxHealth: stats.health,
        attack: stats.attack,
        defense: stats.defense,
        speed: stats.speed,
        createdAt: new Date().toISOString()
    };

    characters.push(newCharacter);
    saveCharacters(characters);

    return newCharacter;
};

export const getCharactersByUser = (userId: number): Character[] => {
    return getCharacters().filter(c => c.userId === userId);
};

export const getCharacterById = (
    id: number,
    userId: number
): Character | undefined => {
    return getCharacters().find(
        c => c.id === id && c.userId === userId
    );
};

export const updateCharacter = (
    id: number,
    userId: number,
    updates: Partial<Pick<Character, "name">>
): Character | undefined => {
    const characters = getCharacters();

    const character = characters.find(
        c => c.id === id && c.userId === userId
    );

    if (!character) return undefined;

    if (updates.name !== undefined) {
        character.name = updates.name.trim();
    }

    saveCharacters(characters);
    return character;
};

export const deleteCharacter = (
    id: number,
    userId: number
): boolean => {
    const characters = getCharacters();

    const character = characters.find(
        c => c.id === id && c.userId === userId
    );

    if (!character) return false;

    const matches = getMatches();

    const characterInActiveMatch = matches.some(match =>
        match.status === "in_progress" &&
        (
            match.character1Id === id ||
            match.character2Id === id
        )
    );

    if (characterInActiveMatch) {
        throw new Error("No puedes eliminar un personaje que participa en una partida en curso");
    }

    const filtered = characters.filter(c => c.id !== id);

    saveCharacters(filtered);
    return true;
};
