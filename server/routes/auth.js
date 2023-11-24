import express from "express";
import { login, login2 } from "../controllers/auth.js";

const router = express.Router();

// this runs tutorial code
//router.post("/login", login);

// this runs my custom login
router.post("/login", login2);


export default router;