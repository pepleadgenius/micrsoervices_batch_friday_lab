const express = require('express')
const nodemailer = require("nodemailer");
require('dotenv').config();
const app = express();




const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
   // user:"chaitanya.sharma365@gmail.com",
    pass: process.env.SMTP_PASS,
   // pass:"qnybrheairbywtsl"
  },
});

async function verify() {
    try {
        await transporter.verify();
        console.log("Server is ready to take our messages");
      } catch (err) {
        console.error("Verification failed:", err);
      }
    
}

async function  sendMail(fromData, toData, subjectData, textData, htmlData) {

    try {
        const info = await transporter.sendMail({
            from:fromData,
          from: '"Testing Mail" <chaitanya.sharma365@gmail.com>', // sender address
         // to: "anveshmishra100@gmail.com, yadavnupur.ny@gmail.com", // list of recipients
           to: toData,
         // subject: "Testing Mail ", // subject line
         subject:subjectData,
          //text: "welcome to Bennett UNiversity", // plain text body
          text:textData,
         // html: "<b>Admissions are now open for the New Year Session at Bennett University. Apply today!</b>", // HTML body
         html:htmlData
        });
      
        console.log("Message sent: %s", info.messageId);
        // Preview URL is only available when using an Ethereal test account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      } catch (err) {
        console.error("Error while sending mail:", err);
      }
    

      app.post("/send_mail", async (req, res) => {

        try {
            const { from, to, subject, text, html } = req.body;
    
            if (!to || !subject || (!text && !html)) {
                return res.status(400).json({
                    success: false,
                    message: "To, subject and text or html are required"
                });
            }
    
            const info = await sendMail({
             from, to, subject, text,  html
            });
    
            res.status(200).json({
                success: true,
                message: "Email sent successfully!",
                messageId: info.messageId
            });
    
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    });
    

      

    



}

verify()
sendMail();

app.listen(3000, ()=>{
      console.log("Express is Running")
})
