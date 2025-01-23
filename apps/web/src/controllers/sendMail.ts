import { getEmailId, getEmailPassword } from "@kushal/utils";
import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: getEmailId(),
        pass: getEmailPassword(),
    },
});

const main = async () => {
    try {
        const info = await transport.sendMail({
            from: getEmailId(),
            to: "goyalkushal04@gmail.com",
            subject: "test",
            text: "Hello from nodemailer",
        });
        console.log(info);
    } catch (error) {
        console.log(error);
    }
};

main();
