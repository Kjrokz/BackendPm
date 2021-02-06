"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pdf_1 = __importDefault(require("./routes/pdf"));
const app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/api/", pdf_1.default);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Listen in the port ${PORT}`));
//# sourceMappingURL=index.js.map