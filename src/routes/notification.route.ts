import { getMyNotifications, markAllRead, markOneRead } from "../controllers/notification.controller";
import { Router } from "express";

const router = Router();


router.get("/", getMyNotifications);
router.put("/mark/:id", markOneRead);
router.put("/mark-all", markAllRead);
router.delete("/:id", markAllRead);

export default router;
