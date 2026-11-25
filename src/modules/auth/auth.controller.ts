import type { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async(req: Request, res: Response)=>{
    try {
        const result = await authService.loginUserIntoDB(req.body)

        const {refreshToken} = result;

        res.cookie("refreshToken", refreshToken, {
            secure: false,   // http -> false, https -> true, in production -> true
            httpOnly: true,  // prevent XSS attack
            sameSite: "lax",  // "none", "strick", "lax"  \ CSRF
            // maxAge
            path: "/",
            domain: "localhost",  // in production .example.com
        }) 

        delete result.user.password;
        res.status(200).send({
            success: true,
            message: "User login successfully.",
            data: result
        })
    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error?.message,
            error: error
        })
    }
}

const generateToken = async (req: Request, res: Response) => {
    try {
        const result = await authService.generateAccessToken(req.cookies.refreshToken)
        res.status(200).send({
            success: true,
            message: "Access token generated successfully!",
            data: result
        })
    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error?.message,
            error: error
        })
    }
}



export const authController = {
    loginUser,
    generateToken,
}