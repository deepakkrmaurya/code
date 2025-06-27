import nodemailer from "nodemailer";

const sendEmail = async (email,resetUrl) => {
try {

    const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "deepakmaurya2211@gmail.com",
    pass: "mbshinozqrwfubuc",
  },
});
    
    // Wrap in an async IIFE so we can use await.
    (async () => {
      const info = await transporter.sendMail({
        from: 'deepakmaurya2211@gmail.com',
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