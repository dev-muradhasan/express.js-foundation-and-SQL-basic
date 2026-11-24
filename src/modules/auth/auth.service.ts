import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IAuth } from "./auth.interface";
import jwt from "jsonwebtoken";
import config from "../../config";

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
        name: user.rows[0].name
    }
    const accessToken = jwt.sign(jwtPayload, config.jwt_secret, { expiresIn: "1d"})
    return {accessToken, user: user.rows[0]}
}

export const authService = {
    loginUserIntoDB,
}