"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearPdf = void 0;
const pdfnet_node_1 = require("@pdftron/pdfnet-node");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crearPdf = async (req, res) => {
    /*  console.log(req.body); */
    const { nombre, cedula, edad, region, comuna, direccion, fechaInicio, fechaTermino, destino, } = req.body;
    /* console.log("req", req);
    console.log("req.body", req.body); */
    const inputPath = path_1.default.resolve(__dirname, __dirname.includes("dist")
        ? "../../files/permiso.pdf"
        : "../files/permiso.pdf");
    const outputPath = path_1.default.resolve(__dirname, __dirname.includes("dist")
        ? "../../files/permiso_replace.pdf"
        : "../files/permiso_replace.pdf");
    const replaceText = async () => {
        const pdfdoc = await pdfnet_node_1.PDFNet.PDFDoc.createFromFilePath(inputPath);
        await pdfdoc.initSecurityHandler();
        const replacer = await pdfnet_node_1.PDFNet.ContentReplacer.create();
        const page = await pdfdoc.getPage(1);
        await replacer.addString("NombreCompleto", nombre);
        await replacer.addString("Rut", cedula);
        await replacer.addString("Edad", edad);
        await replacer.addString("Region", region);
        await replacer.addString("Comuna", comuna);
        await replacer.addString("Direccion", direccion);
        await replacer.addString("InicioHora", fechaInicio);
        await replacer.addString("TerminoHora", fechaTermino);
        await replacer.addString("Destino", destino);
        await replacer.addString("FechaEmision", "12-12-2020");
        await replacer.addString("HoraEmision", "12:12:12");
        /* await replacer.addString("InicioHora", "11"); */
        await replacer.process(page);
        pdfdoc.save(outputPath, pdfnet_node_1.PDFNet.SDFDoc.SaveOptions.e_linearized);
    };
    try {
        await pdfnet_node_1.PDFNet.runWithCleanup(replaceText);
        fs_1.default.readFile(outputPath, (err, data) => {
            if (err) {
                return res.status(500).json({ msg: "Error al guardar pdf" });
            }
            else {
                res.setHeader("ContentType", "aplication/pdf");
                return res.download(outputPath);
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Error al convertir en pdf" });
    }
};
exports.crearPdf = crearPdf;
//# sourceMappingURL=pdfController.js.map