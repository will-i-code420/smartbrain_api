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
	return bcrypt.hash(password, saltRounds, null);
};

const checkPassword = (password, hash) => {
	return bcrypt.compare(password, hash);
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
		const user = await db.select('*').from('users').where({ id });
		res.json({
			status: 'success',
			user: user[0]
		});
	} catch (e) {
		console.log(e);
		res.status(400).json({
			status: 'error',
			msg: 'Unable to retrieve profile'
		});
	}
});

app.post('/signin', async (req, res) => {
	const { username, password } = req.body;
	try {
		const login = await db.select('username', 'hash').from('login').where({ username });
		const isValid = await checkPassword(password, login[0].hash);
		if (isValid && username === login[0].username) {
			const user = await db.select('*').from('users').where('username', '=', username);
			return res.json({
				status: 'success',
				user: user[0]
			});
		} else {
			console.log(e);
			res.status(400).json({
				status: 'error',
				msg: 'invalid username or password'
			});
		}
	} catch (e) {
		console.log(e);
		res.status(400).json({
			status: 'error',
			msg: 'invalid username or password'
		});
	}
});

app.post('/register', async (req, res) => {
	const { name, username, email, password } = req.body;
	try {
		const hash = await hashPassword(password);
		await db.transaction(async (trx) => {
			await trx.insert({ hash, username }).into('login');
			const newUser = await trx
				.insert({ name, username, email, joined: new Date() })
				.into('users')
				.returning('*');
			await trx.commit();
			res.json({
				status: 'success',
				user: newUser[0]
			});
		});
	} catch (e) {
		trx.rollback();
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
