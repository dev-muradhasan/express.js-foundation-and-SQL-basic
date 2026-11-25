import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";
import type { IAuth } from "./auth.interface";

const loginUserIntoDB = async(payload: IAuth)=>{
    // check if the user exist
    // check if the password matched
    // check the user status
    // if pass all then generate jwt token

    const {email, password} = payload
    const user = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `,[email])
    // console.log(user.rows[0]);
    if(user.rowCount === 0){
        throw new Error("Invalid credentials!!")
    }

    const matchPassword = await bcrypt.compare(password, user.rows[0].password)
    if(!matchPassword){
        throw new Error("Invalid credentials!!")
    }

    if (!user.rows[0].is_active) {
        throw new Error("Access denied!!")
    }

    const jwtPayload = {
        id: user.rows[0].id,
        email: user.rows[0].email,
        name: user.rows[0].name,
        role: user.rows[0].role
    }
    const accessToken = jwt.sign(jwtPayload, config.jwt_secret, { expiresIn: "1h"})
    const refreshToken = jwt.sign(jwtPayload, config.refresh_secret, { expiresIn: "10d"})
    return { accessToken, refreshToken, user: user.rows[0]}
}


const generateAccessToken = async (token: string) => {
    if (!token) {
        throw new Error("Unauthorized access!!")
    }

    const decode = jwt.verify(token as string, config.refresh_secret) as JwtPayload
    const user = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `, [decode.email]
    );

    if (user.rowCount === 0) {
        throw new Error("User not found!!")
    }
    if (!user.rows[0].is_active) {
        throw new Error("Forbidden!!")
    }

    const jwtPayload = {
        id: user.rows[0].id,
        email: user.rows[0].email,
        name: user.rows[0].name,
        role: user.rows[0].role
    }
    const accessToken = jwt.sign(jwtPayload, config.jwt_secret, { expiresIn: "1h" })
    return {accessToken}
}

export const authService = {
    loginUserIntoDB,
    generateAccessToken,
}