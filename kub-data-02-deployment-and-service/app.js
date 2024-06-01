const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db.js');

const app = express();

app.use(bodyParser.json());
app.use(db.initializeConnectionPool());

app.get('/story', async (req, res) => {
  let getStory = 'select * from story';
  let data = await db.executeQuery({ queryString: getStory })
  return res.status(200).json(data);
});

app.post('/story', async (req, res) => {
  const newText = req.body.text;
  if (newText.trim().length === 0) {
    return res.status(422).json({ message: 'Text must not be empty!' });
  }
  let insertStory = `insert into story (text) values ('${newText}')`;
  await db.executeQuery({ queryString: insertStory })

  return res.status(201).json({ message: 'Text added!' });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
