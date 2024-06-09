const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const port = 5500;

var userid = 0;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Ewaste',
  password: 'Manu5757',
  port: 5432,
});

app.use(cors());
app.use(express.json());

app.use(bodyParser.json());

function setUserId(id) {userid = id;}
function getUserId(id) { return userid}

app.post('/users', async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await pool.connect();

    const result = await client.query(
      'SELECT uid FROM users WHERE email = $1 AND upassword = $2',
      [email, password]
    );

    client.release();

    if (result.rows.length > 0) {
        setUserId(result.rows[0].uid);
      res.json({
        success: true,
        message: 'Login successful',
        result: result.rows[0],
      });
    } else {
      result = await client.query(
        'SELECT distributer_id FROM distributors WHERE email = $1 AND dpassword = $2',
        [email, password]
      );
        if (result.rows.length > 0) {
            setUserId(result.rows[0].distributer_id);
            alert(userid);
            res.json({
            success: true,
            message: 'Login successful',
            result: result.rows[0],
            });
        } else {
            res.json({
            success: false,
            message: 'Invalid email or password',
            });
        }
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/signout', async (req, res) => {
    setUserId(0);
    res.json({
        success: true,
        message: 'Signout successful',
    });
    });

app.get('/getuser', async (req, res) => {
    try {
        const client = await pool.connect();
    
        const result = await client.query(
        'SELECT * FROM users WHERE uid = $1',
        [userid]
        );
    
        client.release();
    
        res.json({
        success: true,
        result: result.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    });

app.post('/dsignup', async (req, res) => {
  const { name, email, phoneNumber, address, password } = req.body;

  try {
    const client = await pool.connect();

    const result = await client.query(
      'INSERT INTO distributors (name, address, phoneno, email, dpassword) VALUES ($1, $2, $3, $4, $5)',
      [name, address, phoneNumber, email, password]
    );

    client.release();

    res.json({
      success: true,
      message: 'User created successfully',
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/signup', async (req, res) => {
  const { name, email, phoneNumber, address, password } = req.body;

  try {
    const client = await pool.connect();

    const result = await client.query(
      'INSERT INTO users (email, upassword, phoneno, address, name) VALUES ($1, $2, $3, $4, $5)',
      [email, password, phoneNumber, address, name]
    );

    client.release();

    res.json({
      success: true,
      message: 'User created successfully',
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(5500, () => {
  console.log('Server is running on port 5500');
});
