

import { Router } from "express";
import {
    create,
    getAll,
    getOne,
    update,
    remove
} from "../controllers/characterController";

import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getOne);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
