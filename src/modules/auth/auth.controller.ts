import type { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async(req: Request, res: Response)=>{
    try {
        const result = await authService.loginUserIntoDB(req.body)
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

export const authController = {
    loginUser,
}