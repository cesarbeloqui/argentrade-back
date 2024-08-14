import express, { Router, json } from "express";
const router = Router();
import cors from "cors";
import "dotenv/config";
import sgMail from "@sendgrid/mail";
import { readFile } from "fs/promises";
import path from "path";

// server used to send send emails
const app = express();

// eslint-disable-next-line no-undef
app.use(express.static(path.join(path.resolve(), "./dist3")));
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

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
app.post("/contact", async (req, res) => {
  const name = req.body.firstName + " " + req.body.lastName;
  const email = req.body.email;
  const message = req.body.message;
  const phone = req.body.phone;
  const mail = {
    from: `${process.env.EMAIL_USER}`,
    to: "beloqui.cesar@gmail.com",
    subject: "Contacto Formulario - Portfolio",
    html: `<p>Nombre: ${name}</p>
           <p>Email: ${email}</p>
           <p>Telefono: ${phone}</p>
           <p>Mensaje: ${message}</p>`,
  };
  try {
    await sgMail.send(mail);
    res.json({ code: 200, status: "Message Sent" });
  } catch (e) {
    res.json(e);
  }
});
app.get("*", async (_req, res) => {
  try {
    const html = await readFile("./dist3/index.html", "utf-8");
    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server corriendo en ${PORT}`));
