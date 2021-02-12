import express, { Application } from "express";
import pdfRoutes from "./routes/pdf";
import { isTimeBetween } from "./utils/utils";

const app: Application = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/", pdfRoutes);

const PORT: string | number = process.env.PORT || 4000;

console.log(isTimeBetween("20:50:00", "22:00:00", "22:50:00"));

console.log(isTimeBetween("00:00:00", "05:00:00", "06:00:00"));

app.listen(PORT, () => console.log(`Listen in the port ${PORT}`));
