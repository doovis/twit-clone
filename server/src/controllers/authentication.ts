import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { dbUser } from '../types/userObject';
import { createUser, getByEmail, getUserById } from '../db/users';
require('dotenv').config();


export const register = async (req: express.Request, res: express.Response) => {

    try {
        const { 
            username,
            password,
            email,
            dob } = req.body;

        if (!username || !password || !email || !dob) {
            return res.status(400).json({ message: "Invalid Request: Data missing." });
        }

        const existingUser = await getByEmail(email);        

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "User already exists." });
        }
        
        const newPassword = await bcrypt.hash(password, 10);

        await createUser(username, newPassword, email, dob);    

        return res.status(200).json({ message: "User created successfully!" }).end();
    } catch (error) {
        console.log(error);
        
        return res.status(400).json({ message: "Something went wrong" });
    }
}

export const login = async (req: express.Request, res: express.Response) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Invalid Request: Data missing." });
        }
        
        // Fetching existing user from DB
        const user = await getByEmail(email);
        
        if (user.rows.length < 1) {
            return res.status(404).json({ message: "User not found." });
        }
        
        let userObject = user.rows[0];

        const expectedHash = await bcrypt.compare(password, userObject.password);
        
        if (expectedHash === false) {
            return res.status(403).json({ message: "Invalid Password." });
        }

        delete userObject.password;        

        const token = jwt.sign(userObject, process.env.JWT_SECRET_KEY, { expiresIn: '5h' });

        res.cookie("USER_TOKEN", token);

        res.status(200).json(userObject);
    } catch (error) {
        console.log(error.message);
        
        return res.status(400).json({ message: "Something went wrong" });
    }
}

export const reconnection = async (req: express.Request, res: express.Response) => {
    try {        
        const token = req.cookies.USER_TOKEN;
        
        if (!token) {
            return res.status(403).json({ message: "No authentication token found" });
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Converting JWT token to user JSON object
        const userObject = jwt.decode(token) as dbUser;

        // Updating user object with the most recent info from the database
        const mostRecentUserObj = await getUserById(userObject.id)        

        return res.status(200).json(mostRecentUserObj.rows[0]);
    } catch (error) {
        return res.status(403).json({ message: "Unauthenticated connection" });
    }
}