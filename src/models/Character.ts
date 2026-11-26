

export type CharacterClass = "warrior" | "mage" | "archer";

export interface Character {
    id: number;
    userId: number;
    name: string;
    class: CharacterClass;
    level: number;
    health: number;
    maxHealth: number;
    attack: number;
    defense: number;
    speed: number;
    createdAt: string;
}
