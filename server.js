const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');
const port = 3031;

const users = {
	users: [
		{
			id: '001',
			name: 'Bob',
			email: 'bigbog@gmail.com',
			password: 'password',
			entries: 0,
			joined: new Date()
		},
		{
			id: '002',
			name: 'Dick',
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
	bcrypt.compare(password, hash, function(err, res) {});
};

const checkUsers = (email, password) => {
	for (let user in users.users) {
		if (user.email === email && user.password === password) {
			return true;
		} else {
			return false;
		}
	}
};

const findUser = (id) => {
	users.filter((user) => user.id === id);
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

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
	const { email, password } = req.body;
	if (checkUsers(email, password)) {
		res.json(`logged in ${email}`);
	} else {
		res.status(400).json('user not found');
	}
});

app.post('/register', (req, res) => {
	const { name, email, password } = req.body;
	hashPassword(password);
	const id = Math.floor(Math.random() * 100) + 1;
	users.users.push({
		id: `00${id}`,
		name,
		email,
		password,
		entries: 0,
		joined: new Date()
	});
	res.json(`registered user ${name} at ${email}`);
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
