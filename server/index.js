const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await axios.post('http://localhost:11434/api/chat', {
      model: 'phi',
      messages: [
        { role: 'user', content: userMessage }
      ],
      stream: false
    });

    const reply = response.data.message.content;
    res.json({ reply });

  } catch (error) {
    console.error('Error communicating with Ollama:', error.message);
    if (error.response && error.response.data) {
      console.error('Ollama error response:', error.response.data);
    }
    res.status(500).send('Error talking to Ollama');
  }
});

app.listen(3001, () => {
  console.log('Backend server running on http://localhost:3001');
});
