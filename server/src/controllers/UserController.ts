import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/User";

const userController = {
    async register(req: Request, res: Response) {
        let user = await User.findOne({ email: req.body.email });
        if (user)
            return res
                .status(400)
                .send("User with this e-mail address already exists.");

        user = new User({
            email: req.body.email,
            password: await bcryptjs.hash(req.body.password, 10)
        });

        try {
            await user.save();
            res.status(200).send(`Successfuly registered user ${user.email}.`);
        } catch (e) {
            res.status(400).send("Unable to register a new user.");
        }
    },

    async login(req: Request, res: Response) {
        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res
                .status(401)
                .send("User with this e-mail address doesn't exist.");

        const isPasswordCorrect = await bcryptjs.compare(
            req.body.password,
            user.password
        );
        if (!isPasswordCorrect)
            return res.status(400).send("Incorrect password.");

        const jwt_secret = process.env.JWT_SECRET;
        if (!jwt_secret)
            return res
                .status(500)
                .send("Environmental variable JWT_SECRET is missing.");

        res.status(200).send(
            jwt.sign({ _id: user._id, email: user.email }, jwt_secret)
        );
    }
};

export default userController;