import express, { type Application, type Request, type Response } from "express"
import { userRouter } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";
const app: Application = express();
import logger from "./middleware/logger";
import cookieParser from "cookie-parser"
import globalErrorHandler from "./middleware/globalErrorHandler";
import cors from "cors";


const corsOptions = {
    origin: ['http://localhost:3000'],
    optionsSuccessStatus: 200 
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }))
app.use(logger)


app.use("/api/v1/users", userRouter)
app.use("/api/v1/profiles", profileRoute)
app.use("/api/v1/auth", authRoute)

app.get('/', (req: Request, res: Response) => {
    res.status(200).send({
        success: true,
        message: "This is root",
        author: "Murad Hasan"
    })
});

// Global Error Handling Middleware
app.use(globalErrorHandler);


export default app