const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const guestRoutes = require('./routes/guestRoutes');
const podcastRoute = require('./routes/podcastRoute');
const cookieParser = require('cookie-parser');
const { requireAuth } = require('./middleware/authMiddleware');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true
};

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(function (req, res, next) {
	res.header('Content-Type', 'application/json;charset=UTF-8');
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

// database connection
const dbURI = process.env.DB_CONNECTION;
mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
	.then((result) => app.listen(4000, () => console.log('Server up and running')))
	.catch((err) => console.log(err));

// routes
app.use(authRoutes);
app.use(guestRoutes);
app.use(podcastRoute);
