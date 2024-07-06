// Prueba de conocimientos WebTrack - Backend - Pablo Zamora

const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const dbConfig = {'./db.js'};

// Inicializar la aplicación Express
const app = express();
app.use(bodyParser.json());

// Conectar a la base de datos
sql.connect(dbConfig, (err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
  } else {
    console.log('Conexión a la base de datos establecida');
  }
});

// Definir las rutas
app.get('/', (req, res) => {
  res.send('API de Gestión de Tareas');
});

// Obtener todas las tareas
app.get('/tasks', async (req, res) => {
  try {
    const result = await sql.query('SELECT * FROM tasks');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send('Error al obtener las tareas');
  }
});

// Obtener una tarea por ID
app.get('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql.query(`SELECT * FROM tasks WHERE task_id = ${id}`);
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send('Error al obtener la tarea');
  }
});

// Crear una nueva tarea
app.post('/tasks', async (req, res) => {
  const { task_text, task_type_id, priority_id, completed, location } = req.body;
  try {
    await sql.query`INSERT INTO tasks (task_text, task_type_id, priority_id, completed, location)
                    VALUES (${task_text}, ${task_type_id}, ${priority_id}, ${completed}, ${location})`;
    res.status(201).send('Tarea creada');
  } catch (err) {
    res.status(500).send('Error al crear la tarea');
  }
});


// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});