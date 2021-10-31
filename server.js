const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');
const port = 3031;

const database = {
	users: [
		{
			id: '001',
			name: 'Bob',
			username: 'bobby_g',
			rememberMe: false,
			email: 'bigbog@gmail.com',
			password: 'password',
			entries: 0,
			joined: new Date()
		},
		{
			id: '002',
			name: 'Dick',
			username: 'lil_dicky',
			rememberMe: false,
			email: 'littled@yahoo.com',
			password: 'admin',
			entries: 0,
			joined: new Date()
		}
	]
};

const hashPassword = (password) => {
	bcrypt.hash(password, saltRounds, function(err, hash) {
		if (err) throw new Error('error', err);
		return hash;
	});
};

const checkPassword = (password) => {
	bcrypt.compare(password, storedPassword, function(err, res) {});
};

const checkUsers = (username, password) => {
	for (let user of database.users) {
		if (user.username === username && user.password === password) {
			return true;
		} else {
			return false;
		}
	}
};

const findUser = (id) => {
	database.users.filter((user) => user.id === id);
};

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ strict: false }));

app.get('/', (req, res) => {
	res.send('welcome to smartbrain api');
});

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	const user = findUser(id);
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

app.post('/register', (req, res) => {
	const { name, username, email, password } = req.body;
	const hash = hashPassword(password);
	const id = Math.floor(Math.random() * 100) + 1;
	database.users.push({
		id: `00${id}`,
		name,
		username,
		email,
		rememberMe: false,
		password: hash,
		entries: 0,
		joined: new Date()
	});
	const user = findUser(id);
	delete user.password;
	res.json({ user });
});

app.put('/image', (req, res) => {
	const { id } = req.body;
	const user = findUser(id);
	if (!user) {
		res.status(400).json('user not found');
	} else {
		users.users[user].entries++;
		res.json(users.users[user].entries++);
	}
});

app.listen(port, () => {
	console.log(`server running on port: ${port}`);
});
