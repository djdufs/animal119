const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const DATA_FILE = './places.json';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // 이 줄이 중요!

// 🔥 루트 경로에서 index.html 보여주기
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// 📍 저장된 장소 목록 반환
app.get('/places', (req, res) => {
  fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
    if (err) return res.status(500).send('데이터를 불러올 수 없습니다');
    res.send(JSON.parse(data));
  });
});

// ➕ 장소 등록
app.post('/places', (req, res) => {
  const newPlace = req.body;

  fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
    const places = err ? [] : JSON.parse(data);
    places.push(newPlace);

    fs.writeFile(DATA_FILE, JSON.stringify(places, null, 2), (err) => {
      if (err) return res.status(500).send('저장 실패');
      res.send({ message: '저장 완료' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
