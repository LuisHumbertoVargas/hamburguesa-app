const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Rutas existentes...

// Nueva ruta para obtener órdenes (solo para administradores)
app.get('/api/admin/orders', authenticateToken, async (req, res) => {
  try {
    // Verificar si el usuario es administrador
    const userResult = await pool.query('SELECT role FROM users WHERE id = $1', [req.user.userId]);
    if (userResult.rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las órdenes' });
  }
});

// Nueva ruta para procesar pagos (simulado)
app.post('/api/process-payment', authenticateToken, async (req, res) => {
  const { amount, cardNumber, expirationDate, cvv } = req.body;

  // Aquí iría la lógica real de procesamiento de pagos
  // Por ahora, simplemente simulamos un pago exitoso
  const isPaymentSuccessful = Math.random() < 0.9; // 90% de éxito

  if (isPaymentSuccessful) {
    res.json({ success: true, message: 'Pago procesado con éxito' });
  } else {
    res.status(400).json({ success: false, message: 'Error al procesar el pago' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});