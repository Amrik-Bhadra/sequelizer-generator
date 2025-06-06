const db = require('../config/db');

const getUserData = async(user_id) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE user_id = ?', [user_id]);
    return rows[0];
}

const createUser = async (username, email, password, uid) => {
    const authProvider = "local";
    const [result] = await db.execute(
        'INSERT INTO users (username, email, password, authProvider, uid) VALUES (?, ?, ?, ?, ?)',
        [username, email, password, authProvider, uid]
    );

    return result;
}

const createUserGoogleAuth = async (uid, email, username) => {
    const password = "", authProvider = "google";
    const [result] = await db.execute(
        'INSERT INTO users (username, email, password, authProvider, uid) VALUES (?, ?, ?, ?, ?)',
        [username, email, password, authProvider, uid]
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

const findUserByEmailUid = async (email, uid) => {
    const [rows] = await db.query('SELECT * from users where email = ? AND uid = ?', [email, uid]);
    return rows[0];
}


module.exports = {
    createUser,
    findUserByEmail,
    deleteUser,
    updateUserOtp,
    clearUserOtp,
    getUserById,
    updateUserPassword,
    findUserByEmailUid,
    createUserGoogleAuth,
    getUserData
}