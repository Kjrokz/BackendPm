import { PDFNet } from "@pdftron/pdfnet-node";
import express, { Application, Request, Response } from "express";
import path from "path";
import fs from "fs";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT: string | number = process.env.PORT || 4000;

app.post("/generarPdf", async (req: Request, res: Response) => {
  /*  console.log(req.body); */

  const {
    nombre,
    cedula,
    edad,
    region,
    comuna,
    direccion,
    fechaInicio,
    fechaTermino,
    destino,
  }: {
    nombre: string;
    cedula: string;
    edad: string;
    region: string;
    comuna: string;
    direccion: string;
    fechaInicio: string;
    fechaTermino: string;
    destino: string;
  } = req.body;

  const inputPath: string = path.resolve(
    __dirname,
    __dirname.includes("dist") ? "../files/permiso.pdf" : "./files/permiso.pdf"
  );

  const outputPath: string = path.resolve(
    __dirname,
    __dirname.includes("dist")
      ? "../files/permiso_replace.pdf"
      : "./files/permiso_replace.pdf"
  );

  const replaceText = async () => {
    const pdfdoc = await PDFNet.PDFDoc.createFromFilePath(inputPath);
    await pdfdoc.initSecurityHandler();

    const replacer = await PDFNet.ContentReplacer.create();

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

    pdfdoc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
  };

  try {
    await PDFNet.runWithCleanup(replaceText);

    fs.readFile(outputPath, (err, data) => {
      if (err) {
        return res.status(500).json({ msg: "Error al guardar pdf" });
      } else {
        res.setHeader("ContentType", "aplication/pdf");
        return res.end(data);
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error al convertir en pdf" });
  }
});

app.listen(PORT, () => console.log(`Listen in the port ${PORT}`));
