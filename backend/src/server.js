const express = require('express');
const userRouter = require('./routers/user');
const linksRouter = require('./routers/links');
const port = process.env.PORT;
const cors = require('cors');
require('./database/config');

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(linksRouter);

app.get('/', (req, res) => {
	res.send('test');
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
