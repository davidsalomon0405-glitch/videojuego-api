

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import characterRoutes from "./routes/characterRoutes";
import matchRoutes from "./routes/matchRoutes";

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());


// Rutas
app.use("/api/users", userRoutes);

app.use("/api/characters", characterRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
    res.json({
        mensaje: "API del videojuego funcionando correctamente"
    });
});

app.use("/api/matches", matchRoutes);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
