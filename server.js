const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');
const port = 3031;

const knex = require('knex');

const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		port: 5432,
		user: '',
		password: '',
		database: 'smartbrain'
	}
});

const hashPassword = (password) => {
	bcrypt.hash(password, saltRounds, function(err, hash) {
		if (err) throw new Error('error', err);
		return hash;
	});
};

const checkPassword = (password) => {
	bcrypt.compare(password, storedPassword, function(err, res) {});
};

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ strict: false }));

app.get('/', (req, res) => {
	res.send('welcome to smartbrain api');
});

app.get('/profile/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const user = await db.select('*').from('users').where({ id: id });
		res.json({
			status: 'success',
			user
		});
	} catch (e) {
		console.log(e);
		res.status(400).json({
			status: 'error',
			msg: 'Unable to retrieve profile'
		});
	}

	if (!user) {
		res.status(400).json('user not found');
	} else {
		res.json({ user });
	}
});

app.post('/signin', (req, res) => {
	const { username, password, rememberMe } = req.body;
	if (checkUsers(username, password)) {
		const user = database.users.filter((user) => user.username === username);
		delete user.password;
		res.json({ user });
	} else {
		res.status(400).json('user not found');
	}
});

app.post('/register', async (req, res) => {
	const { name, username, email, password } = req.body;
	try {
		const hash = hashPassword(password);
		const newUser = await db('users').returning().insert({ name, username, email, joined: new Date() });
		res.json({
			status: 'success',
			newUser
		});
	} catch (e) {
		console.log(e);
		res.status(400).json({
			status: 'error',
			msg: 'Unable to register user'
		});
	}
});

app.put('/image', async (req, res) => {
	const { id } = req.body;
	try {
		const entries = await db('users').where('id', '=', id).increment('entries', 1).returning('entries');
		res.json({ entries });
	} catch (e) {
		console.log(e);
		res.status(400).json({
			status: 'error',
			msg: 'Unable to update entries'
		});
	}
});

app.listen(port, () => {
	console.log(`server running on port: ${port}`);
});
