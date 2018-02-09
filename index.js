
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())

const http = require ('http')

const generateId = () => {
    min = Math.ceil(1000);
    max = Math.floor(100000000);
    return Math.floor(Math.random() * (max - min)) + min;
}

app.get('/', (req,res) => {
    res.send('<h1>Jee</h1>')
})

app.get('/api/persons', (req, res) => {
    Person
    .find({})
    .then(persons => {
        res.json(persons.map(Person.Format))
    })
})

app.get('/api/persons/:id', (req,res) => {
    Person
    .findById(req.params.id)
    .then(person => {
        if (person) {
            res.json(Person.Format(person))
        } else {
            res.status(404).end()
        }
    })
    .catch(error => {
        console.log(error)
        res.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (req, res) => {
    console.log(req.body)
    const body = req.body
    if (body.name === undefined) {
        return res.status(400).json({error: 'Nimi puuttuu!'})
    }
    if (body.number === undefined) {
        return res.status(400).json({error: 'Numero puuttuu!'})
    }

    const person = new Person ({
            name: body.name,
            number: body.number
        }
    )
    person
    .save()
    .then(savedPerson => {
        res.json(Person.Format(savedPerson))
    })
    .catch(error => {
        console.log(error)
    })
})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person
    .findOneAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
        res.json(Person.Format(updatedPerson))
    })
    .catch(error => {
        console.log(error)
        response.status(400).send({error: 'malformatted id'})
    })
})

app.delete('/api/persons/:id', (req,res) => {  
    Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
        res.status(204).end() 
    })
    .catch(error => {
        res.status(400).send({error: 'malformatted id'})
    })
})

app.get('/info', (req, res) => {
    res.send(`<p>puhelinluettelossa ${numbers.length} henkilön tiedot</p><p>${Date()}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})