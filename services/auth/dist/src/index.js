"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const controller_1 = require("./controller");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.get("/health", (_req, res) => {
    res.status(200).send("UP");
});
//routes
app.post("/auth/registion", controller_1.userRegistion);
app.post("/auth/login", controller_1.userLogin);
app.post("auth/verify-token", controller_1.userVerify);
app.post("/auth/verify-email", controller_1.verifyEmail);
//404
app.use((_req, res) => {
    res.status(404).json({ error: "Endpoint not found" });
});
//error handler
app.use((err, _req, res, _next) => {
    res.status(err.status || 500).json({ error: err.message });
});
const port = process.env.PORT || 4005;
const SERVICE_NAME = process.env.SERVICE_NAME || "EMAIL SERVICE";
app.listen(port, () => {
    console.log(`${SERVICE_NAME} listening on port ${port}`);
});
//# sourceMappingURL=index.js.map