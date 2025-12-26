import express from "express";
import { sendContactMail } from "../controller/contactController.js";

const router = express.Router();

router.post("/", sendContactMail);

export default router;
