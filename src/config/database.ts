
import fs from "fs";
import path from "path";
import { User } from "../models/User";
import { Character } from "../models/Character";
import { Match } from "../models/Match";

const dataDirectory = path.join(process.cwd(), "data");

const usersFile = path.join(dataDirectory, "users.json");
const charactersFile = path.join(dataDirectory, "characters.json");
const matchesFile = path.join(dataDirectory, "matches.json");

// Crear carpeta de almacenamiento
if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
}

// Crear archivos si no existen
if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
}

if (!fs.existsSync(charactersFile)) {
    fs.writeFileSync(charactersFile, JSON.stringify([], null, 2));
}

if (!fs.existsSync(matchesFile)) {
    fs.writeFileSync(matchesFile, JSON.stringify([], null, 2));
}

// Usuarios
export const getUsers = (): User[] => {
    const data = fs.readFileSync(usersFile, "utf-8");
    return JSON.parse(data) as User[];
};

export const saveUsers = (users: User[]): void => {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

// Personajes
export const getCharacters = (): Character[] => {
    const data = fs.readFileSync(charactersFile, "utf-8");
    return JSON.parse(data) as Character[];
};

export const saveCharacters = (characters: Character[]): void => {
    fs.writeFileSync(charactersFile, JSON.stringify(characters, null, 2));
};

// Partidas
export const getMatches = (): Match[] => {
    const data = fs.readFileSync(matchesFile, "utf-8");
    return JSON.parse(data) as Match[];
};

export const saveMatches = (matches: Match[]): void => {
    fs.writeFileSync(matchesFile, JSON.stringify(matches, null, 2));
};
