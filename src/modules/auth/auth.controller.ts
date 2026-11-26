import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

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
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Access token generated successfully!",
            data: result
        })
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error?.message,
            error: error
        })
    }
}

const generateToken = async (req: Request, res: Response) => {
    try {
        const result = await authService.generateAccessToken(req.cookies.refreshToken)
        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "Access token generated successfully!",
            data: result
        })
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
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