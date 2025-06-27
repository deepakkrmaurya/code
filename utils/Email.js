import nodemailer from "nodemailer";

const sendEmail = async (email,resetUrl) => {
try {

    const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PSSWORD,
  },
});
    
    // Wrap in an async IIFE so we can use await.
    (async () => {
      const info = await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Reset Password?",
        text: "Hello world?",
        html: resetUrl, // HTML body
      });
    
      console.log("Message sent:", info.messageId);
    })();
} catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
    
}
}
export default sendEmail;