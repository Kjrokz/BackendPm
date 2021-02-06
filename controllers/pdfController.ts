import { PDFNet } from "@pdftron/pdfnet-node";
import { Request, Response } from "express";
import moment from "moment";
import path from "path";
import fs from "fs";

export const crearPdf = async (req: Request, res: Response) => {
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

  /* console.log("req", req);
  console.log("req.body", req.body); */
  const inputPath: string = path.resolve(
    __dirname,
    __dirname.includes("dist")
      ? "../../files/permiso.pdf"
      : "../files/permiso.pdf"
  );

  const outputPath: string = path.resolve(
    __dirname,
    __dirname.includes("dist")
      ? "../../files/permiso_replace.pdf"
      : "../files/permiso_replace.pdf"
  );

  const replaceText = async () => {
    const pdfdoc = await PDFNet.PDFDoc.createFromFilePath(inputPath);
    await pdfdoc.initSecurityHandler();

    const replacer = await PDFNet.ContentReplacer.create();

    const page = await pdfdoc.getPage(1);

    const fechaHoy = moment();

    const minutos = "00:15:00";

    const nuevaHora = moment(fechaInicio, "HH:mm:ss");

    /* console.log(nuevaHora); */

    nuevaHora.subtract(moment.duration(minutos));

    /* console.log(nuevaHora.format("HH:mm:ss")); */

    await replacer.addString("NombreCompleto", nombre);
    await replacer.addString("Rut", cedula);
    await replacer.addString("Edad", edad);
    await replacer.addString("Region", region);
    await replacer.addString("Comuna", comuna);
    await replacer.addString("Direccion", direccion);
    await replacer.addString("InicioHora", fechaInicio);
    await replacer.addString("TerminoHora", fechaTermino);
    await replacer.addString("Destino", destino);
    await replacer.addString("FechaEmision", fechaHoy.format("DD-MM-YYYY"));
    await replacer.addString("Hem", nuevaHora.format("HH:mm:ss"));

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
        return res.download(outputPath);
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error al convertir en pdf" });
  }
};
