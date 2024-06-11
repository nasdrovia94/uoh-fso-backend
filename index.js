const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
require('dotenv').config();



const app = express();
app.use(cors());
app.use(express.json());



morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))  //morgan logger with the specified format, as the express official website says

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];


app.get("/", (req, res) => {
  res.send("what up");
});


app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  let person = persons.find((p) => p.id === id); // if this variable is declared as a const the post method doesnt complain but doesnt work anyway

  if (person) {
    res.json(person);
  } else {
    res.status(404).send({ error: "person not found" });
  }
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }

  if (persons.find((p) => p.name === body.name)) {
    return res.status(400).json({
      error: "that name already exists",
    });
  }

  const person = {
    id: Math.floor(Math.random() * 1000000),
    name: body.name,
    number: body.number,
  };

  persons.push(person);

  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const personIndex = persons.findIndex((p) => p.id === id);

  if (personIndex !== -1) {
    persons = persons.filter((p) => p.id !== id);
    res.status(204).end();
  } else {
    res.status(404).send({ error: "person not found" });
  }
});

app.get("/info", (req, res) => {
  const numberOfEntries = persons.length;
  const currentTime = new Date();
  res.send(`
    <p>Phonebook has info for ${numberOfEntries} people</p>
    <p>${currentTime}</p>
  `);
});

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
