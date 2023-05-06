const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

morgan.token('body', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);
app.use(express.static('build'));

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/info', (req, res) => {
  const contents = `Phonebook has info for ${persons.length} people`;
  const currentDate = new Date();
  const dateOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  };
  const formattedDate = currentDate.toLocaleDateString(undefined, dateOptions);
  const timeZoneName = currentDate
    .toLocaleTimeString(undefined, {
      timeZoneName: 'long',
    })
    .split(' ')
    .slice(1)
    .join(' ');
  const info = `${contents} <br><br> ${formattedDate} (${timeZoneName})`;
  res.send(info);
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

const generateId = () => {
  return Math.floor(Math.random() * 1e9);
};

app.post('/api/persons', (request, response) => {
  const body = request.body;
  console.log('post');

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing',
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'number missing',
    });
  }
  const existingPerson = persons.find((person) => person.name === body.name);
  if (existingPerson) {
    return response.status(422).json({
      error: 'name must be unique',
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).json({
      error: 'id not found',
    });
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((note) => note.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
