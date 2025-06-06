
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

const updateUserOtp = async (id, otp) => {
    await db.query('UPDATE users SET otp = ? WHERE user_id = ?', [otp, id]);
};

const clearUserOtp = async (id) => {
    await db.query('UPDATE users SET otp = NULL WHERE user_id = ?', [id]);
}

const getUserById = async (userId) => {
    const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);
    return rows[0];
};

const updateUserPassword = async (userId, password) => {
    await db.query('UPDATE users SET password = ? WHERE user_id = ?', [password, userId]);
}


module.exports = { 
    createUser, 
    findUserByEmail, 
    deleteUser, 
    updateUserOtp, 
    clearUserOtp, 
    getUserById,
    updateUserPassword
}
