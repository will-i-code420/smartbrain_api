const express = require('express');
const app = express();
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

const checkUsers = (email, password) => {
	for (user in users) {
		if (user.email === email && user.password === password) {
			return true;
		} else {
			return false;
		}
	}
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
	res.send();
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
	const id = Math.floor(Math.random() * 100) + 1;
	users.users.push({
		id: `${id}`,
		name,
		email,
		password,
		entries: 0,
		joined: new Date()
	});
	res.json(`registered user ${name} at ${email}`);
});

app.listen(port, () => {
	console.log(`server running on port: ${port}`);
});
