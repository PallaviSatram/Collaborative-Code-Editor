const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const userModel = require("../models/userModel");

class AuthService {

  async register(userData) {

    const { username, email, password } = userData;

    if (!username || !email || !password) {
      throw new Error("All fields are required.");
    }

    const existingEmail = await userModel.findByEmail(email);

    if (existingEmail) {
      throw new Error("Email already exists.");
    }

    const existingUsername = await userModel.findByUsername(username);

    if (existingUsername) {
      throw new Error("Username already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.createUser({
      id: uuidv4(),
      username,
      email,
      password_hash: hashedPassword,
    });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
    };

  }

  async login(email, password) {

    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const user = await userModel.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };

  }

}

module.exports = new AuthService();