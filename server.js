require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors()); // Allow frontend requests
app.use(bodyParser.json());

// Handle form submission
app.post('/submit-form', async (req, res) => {
    const { fullName, gender, age, occupation, email, phone, state, district, address, interests, issues, howHeard, comments, newsletter } = req.body;

    const transporter = nodemailer.createTransport({
        host: "smtp.office365.com",  // Outlook SMTP Server
        port: 587,
        secure: false,  // Use TLS
        auth: {
            user: process.env.EMAIL,  // Your Outlook email
            pass: process.env.PASSWORD  // Your Outlook password or App Password
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL, // Send email to yourself
        subject: 'New Join Form Submission',
        text: `
        Name: ${fullName}
        Gender: ${gender}
        Age: ${age}
        Occupation: ${occupation}
        Email: ${email}
        Phone: ${phone}
        State: ${state}
        District: ${district}
        Address: ${address}
        Interests: ${interests?.join(', ')}
        Issues: ${issues?.join(', ')}
        How Heard: ${howHeard}
        Comments: ${comments}
        Newsletter Subscription: ${newsletter ? 'Yes' : 'No'}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Form submitted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));
