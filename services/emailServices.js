import transporter from "../config/mail.js";
import dotenv from "dotenv"
import {getResisterUserTemplate} from "./mailTemplate.js"
dotenv.config();

const sendRegistrationEmail = (email, token) => {
    return new Promise((resolve, reject) => {
        const verifyEmailUrl = `${process.env.FRONT_END_URL}/verify?token=${token}`;
        const resisterUserTemplate = getResisterUserTemplate(verifyEmailUrl);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Registration Confirmation',
            html: resisterUserTemplate
        };

        transporter.sendMail(mailOptions)
            .then(info => {
                resolve(info);
            })
            .catch(error => {
                console.error('Error sending registration email:', error);
                reject(error);
            });
    });
};

export default sendRegistrationEmail;