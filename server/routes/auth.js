import express from "express";
import { login, login2 } from "../controllers/auth.js";
//import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

//router.post("/login", login);
router.post("/login", login2);

//router.get("/verifyToken", verifyToken);

export default router;