import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service : "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    }
})

export let sendOtpMail = async (to, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject: "Reset your password",
        html: `<p>Your reset otp is <b>${otp}</b>. It expires in 5 minute ..</p>`,
    })
}   

export let sendOtpDelivary = async (email, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to : email,
        subject: "Delivary OTP",
        html: `<p>Your delivary otp is <b>${otp}</b>. It expires in 5 minute ..</p>`,
    })
} 