import express, { Router, json } from "express";
const router = Router();
import cors from "cors";
import "dotenv/config";
import { readFile } from "fs/promises";
import path from "path";
import sendEmail from "./nodemailer.js";

const url = process.env.URL.length > 0 ? process.env.URL : "http://localhost:";
// server used to send send emails
const app = express();

// eslint-disable-next-line no-undef
app.use(express.static(path.join(path.resolve(), "./dist")));
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST, OPTIONS, PUT,DELETE");
  next();
});

app.use(json());
app.use(cors());

app.post("/contact", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;
  const phone = req.body.phone;
  const empresa = req.body.empresa;
  const mail = {
    from: `Contacto en Formulario <${process.env.USER}>`,
    to: `${process.env.EMAILLLEGADA}`,
    subject: "Contacto Formulario",
    html: `<p>Nombre: ${name}</p>
           <p>Email: ${email}</p>
           <p>Telefono: ${phone}</p>
           <p>Empresa: ${empresa}</p>
           <p>Mensaje: ${message}</p>`,
    replyTo: email,
  };
  const respuesta = {
    from: `Argentrade <${process.env.USER}>`,
    to: email,
    subject: "Gracias por contactarnos",
    html: `<p>Hola ${name},</p>
           <p>Gracias por contactarnos. Nos pondremos en contacto contigo pronto.</p>
           <p>Saludos,</p>
           <p>Equipo Argentrade</p>`,
    replyTo: `${process.env.EMAILLLEGADA}`,
  };
  try {
    await sendEmail(mail);
    await sendEmail(respuesta);
    res.json({ code: 200, status: "Message Sent", message: mail });
  } catch (e) {
    res.json({ code: 500, status: "Error", message: e });
  }
});
app.get("*", async (_req, res) => {
  try {
    const html = await readFile("./dist/index.html", "utf-8");
    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server corriendo en ${url}${PORT}`));
