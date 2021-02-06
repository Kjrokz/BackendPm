"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pdfController_1 = require("../controllers/pdfController");
const router = express_1.Router();
router.post("/generarPdf", pdfController_1.crearPdf);
exports.default = router;
//# sourceMappingURL=pdf.js.map