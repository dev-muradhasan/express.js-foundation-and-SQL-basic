import express, { type Application, type Request, type Response } from "express"
import { userRouter } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";
const app: Application = express();
import fs from "fs"


app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }))


app.use((req, res, next) => {
    const log = `\nMethod: ${req.method} | URL: ${req.url} | Time: Date.now()\n`
    fs.appendFile("logger.txt", log, (err) => console.log(err))
    next();
});


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


export default app