import { Router } from "express";
import { crearPdf } from "../controllers/pdfController";

const router: Router = Router();

router.post("/generarPdf", crearPdf);

export default router;
