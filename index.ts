import express, { Application } from "express";
import pdfRoutes from "./routes/pdf";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/", pdfRoutes);

const PORT: string | number = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Listen in the port ${PORT}`));
