export type MatchStatus =
    | "pending"
    | "in_progress"
    | "finished"
    | "cancelled";

export interface Match {
    id: number;
    player1Id: number;
    player2Id: number | null;
    character1Id: number;
    character2Id: number | null;
    status: MatchStatus;
    currentTurn: number;
    winnerId: number | null;
    defendingPlayerId?: number | null;

    // Estado del combate
    character1Health?: number;
    character2Health?: number;
    specialUsedPlayer1?: boolean;
    specialUsedPlayer2?: boolean;
    healUsedPlayer1?: boolean;
    healUsedPlayer2?: boolean;

    createdAt: string;
}