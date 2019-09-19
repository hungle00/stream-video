const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const port = 5000;
const server = app.listen(port, () => {
  	console.log(`App running on port ${port}`)
})

const io = require('socket.io').listen(server);

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/video', (req, res) => {
	const path = 'assests/sample.mp4';
	const stat = fs.statSync(path);
	const fileSize = stat.size;
	const range = req.headers.range;

	if(range) {
		const parts = range.replace(/bytes=/, "").split("-")
		const start = parseInt(parts[0], 10)
		const end = parts[1] ? parseInt(parts[1], 10)
							: fileSize - 1;
		const chunksize = (end - start) + 1
		const file = fs.createReadStream(path, {start, end})
		const head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4',
		}
		res.writeHead(206, head);
		file.pipe(res)

	} else {
		const head = {
			'Content-Length': fileSize,
			'Content-Type': 'video/mp4',
		}
		res.writeHead(200, head)
		fs.createReadStream(path).pipe(res)
	}
});

io.on('connection', (socket) => {
	console.log('hello socket')
	socket.on('chatter', (message) => {
	  console.log('chatter : ', message)
	  io.emit('chatter', message)
	})
})
