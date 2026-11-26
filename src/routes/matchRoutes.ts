import { Router } from "express";
import {
    create,
    getAvailable,
    join,
    getAll,
    getOne,
    action,
    cancel
} from "../controllers/matchController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.use(authenticateToken);

router.post("/", create);
router.get("/available", getAvailable);
router.get("/", getAll);
router.get("/:id", getOne);
router.post("/:id/join", join);
router.post("/:id/action", action);
router.post("/:id/cancel", cancel);

export default router;