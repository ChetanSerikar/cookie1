const express = require('express');
const router = express.Router();

// Dummy user data for demonstration
const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' },
];

// Signup route - Render signup page
router.get('/signup', (req, res) => {
    res.sendFile('signup.html', { root: './public' });
});

// Signup route - Process signup form
router.post('/signup', (req, res) => {
    const { username, password } = req.body;

    // Check if the username is already taken
    if (users.some(user => user.username === username)) {
        return res.status(400).json({ message: 'Username is already taken' });
    }

    // Create a new user object
    const newUser = {
        id: users.length + 1,
        username,
        password, // In a real-world scenario, you should hash the password before saving
    };

    // Save the new user to the in-memory array
    users.push(newUser);

    // Respond with a success message or user data
    res.json({ message: 'Signup successful', user: newUser });
});

// Login route - Render signin page
router.get('/login', (req, res) => {
    res.sendFile('signin.html', { root: './public' });
});

// Login route - Process signin form
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Find the user by username
    const user = users.find(user => user.username === username);

    // Check if the user exists
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    // In a real-world scenario, compare hashed passwords
    if (user.password === password) {
        // Create a session (this is a basic example, for production use more secure session handling)
        req.session.user = { id: user.id, username: user.username };

        // Respond with a success message or user data
        return res.json({ message: 'Login successful', user: req.session.user });
    }

    // Incorrect password
    res.status(401).json({ message: 'Invalid username or password' });
});

// Logout route - Render logout page
router.get('/logout', (req, res) => {
    res.sendFile('logout.html', { root: './public' });
});

// Logout route - Process logout form
router.post('/logout', (req, res) => {
    // Check if the user is logged in (you might want to add more checks in a real-world scenario)
    if (req.session.user) {
        // Destroy the session
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: 'Error logging out' });
            }
            // Respond with a success message
            res.json({ message: 'Logout successful' });
        });
    } else {
        // If the user is not logged in, respond with an error message
        res.status(401).json({ message: 'User not logged in' });
    }
});

module.exports = router;
