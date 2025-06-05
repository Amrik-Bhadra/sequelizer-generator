const db = require('../config/db');

const createUser = async (username, email, password) => {
    const [result] = await db.execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, password]
    );

    return result;
}

const findUserByEmail = async (email) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

const deleteUser = async (id) => {
    const [result] = await db.execute('DELETE FROM users WHERE user_id = ?', [id]);
    return result;
};

module.exports = { createUser, findUserByEmail, deleteUser }