const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors'); // For cross-origin requests
const { google } = require('googleapis'); // Google Sheets API
const mongoose = require('mongoose'); // MongoDB integration
const app = express();
const PORT = process.env.PORT || 3003;

// Load environment variables from the .env file
require('dotenv').config();

// Use environment variables
const mongoURI = process.env.MONGO_URI;
const gmailUser = process.env.GMAIL_USER;
const gmailPass = process.env.GMAIL_PASS;

// Load environment variables from the .env file
require('dotenv').config();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files from the current directory
app.use(cors()); // Enable CORS

// MongoDB connection
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log('Error connecting to MongoDB', err);
});

// User Schema for MongoDB
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    age: Number,
    phone: String,
    address: String,
    gender: String
});

// User Model
const User = mongoose.model('User', userSchema);

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailUser,
        pass: gmailPass // Replace with a Google App Password
    }
});

// Google Sheets Setup
const sheets = google.sheets('v4');
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json', // Path to your service account credentials JSON
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const spreadsheetId = '18Bt0rFtqkFaHFRFsjaCSR1YiGuepe-IluARjVCmOgn4'; // Your Google Sheets ID

// Function to save order details to Google Sheets
const saveToGoogleSheets = async (orderDetails) => {
    const client = await auth.getClient();
    const sheet = sheets.spreadsheets.values;

    const currentDate = new Date();
    const date = currentDate.toLocaleDateString();
    const time = currentDate.toLocaleTimeString();

    const row = [
        orderDetails.name,
        orderDetails.phoneNumber,
        orderDetails.email,
        orderDetails.address,
        orderDetails.project.title,
        date,
        time
    ];

    try {
        // Append new row to the sheet
        await sheet.append({
            auth: client,
            spreadsheetId,
            range: 'Sheet1!A:G', // Adjust the range as per your sheet
            valueInputOption: 'RAW',
            resource: {
                values: [row],
            },
        });
        console.log('Order details saved to Google Sheets!');
    } catch (error) {
        console.error('Error saving to Google Sheets:', error);
        throw error;
    }
};

// Route to Serve the Main Page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Route to handle order submission
app.post('/order', (req, res) => {
    const { name, phoneNumber, address, email, project } = req.body;

    // Validate the request body
    if (!name || !phoneNumber || !address || !email || !project || !project.title) {
        console.error('Validation failed: Missing fields in request body.');
        return res.status(400).send('All fields are required!');
    }

    console.log('Received order details:', req.body);

    // Save the order details to Google Sheets
    saveToGoogleSheets({ name, phoneNumber, email, address, project, })
        .then(() => {
            // Email to you (admin notification)
            const adminMailOptions = {
                from: 'napariyojana@gmail.com',
                to: 'n.nagavenkat26@gmail.com',
                subject: 'New Order Received',
                text: `Order Details:
Name: ${name}
Phone Number: ${phoneNumber}
Email: ${email}
Address: ${address}
Project: ${project.title}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}`
            };

            // Email to the customer (confirmation email)
            const customerMailOptions = {
                from: 'napariyojana@gmail.com',
                to: email, // Send to the customer's email
                subject: 'Order Confirmation',
                text: `Dear ${name},
Thank you for choosing Na Pariyojana. We are pleased to confirm that we have received your order, and our team is eager to begin working on your project. Your satisfaction is our utmost priority, and we are committed to delivering results that exceed your expectations.
Please find the details of your order below:

- Name             :${name}  
- Phone Number     : ${phoneNumber}  
- Email            : ${email}  
- Address          : ${address}  
- Project Title    : ${project.title}  
- Order Date       : ${new Date().toLocaleDateString()}  
- Order Time       : ${new Date().toLocaleTimeString()} 

We deeply value your business and are eager to collaborate with you to bring your vision to fruition. Thank you once again for choosing Na Pariyojana.
Best regards,
Na Pariyojana`
            };

            // Send the admin notification email
            transporter.sendMail(adminMailOptions, (err, info) => {
                if (err) {
                    console.error('Error sending admin email:', err);
                    return res.status(500).send('Failed to send email. Please try again.');
                }
                console.log('Admin email sent successfully.');

                // Send the confirmation email to the customer
                transporter.sendMail(customerMailOptions, (err, info) => {
                    if (err) {
                        console.error('Error sending confirmation email:', err);
                        return res.status(500).send('Failed to send confirmation email. Please try again.');
                    }
                    console.log('Confirmation email sent successfully.');
                    res.status(200).send('Order placed successfully, emails sent, and details saved to Google Sheets!');
                });
            });
        })
        .catch(err => {
            console.error('Error saving to Google Sheets:', err);
            res.status(500).send('Failed to save order details.');
        });
});

// Process Order for New or Specific Projects
const processOrder = async (req, res, orderType) => {
    const { projectName, customerName, phone, email, address } = req.body;

    // Validate input fields
    if (!projectName || !customerName || !phone || !email || !address) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    try {
        // Save order details to Google Sheets
        await saveToGoogleSheets({
            name: customerName,
            phoneNumber: phone,
            email: email,
            address,
            project: { title: projectName },
            type: orderType,
        });

        // Define email options
        const mailOptionsToAdmin = {
            from: 'napariyojana@gmail.com',
            to: 'n.nagavenkat26@gmail.com',
            subject: `${orderType} Received`,
            text: `${orderType} Details:
Name: ${customerName}
Phone Number: ${phone}
Email: ${email}
Address: ${address}
Project: ${projectName}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}`,
        };

        const mailOptionsToCustomer = {
            from: 'napariyojana@gmail.com',
            to: email,
            subject: `Confirmation of Your ${orderType} Submission`,
            text: `Dear ${customerName},

We are delighted to confirm the successful submission of your ${orderType}. Below are the details you provided:
- Name : ${customerName}
- Phone Number : ${phone}
- Email : ${email}
- Address : ${address}
- Project : ${projectName}
- Order Date : ${new Date().toLocaleDateString()}  
- Order Time : ${new Date().toLocaleTimeString()} 

Thank you for choosing Na Pariyojana. Our team is already reviewing your details, and we will get in touch with you shortly to discuss the next steps. Should you have any immediate questions or need assistance, please don't hesitate to reach out to us.
We truly value your trust in us and are committed to delivering exceptional service.

Best regards,
Na Pariyojana`,
        };

        // Send emails asynchronously
        await transporter.sendMail(mailOptionsToAdmin);
        console.log('Admin notified successfully');

        await transporter.sendMail(mailOptionsToCustomer);
        console.log('Customer confirmation email sent successfully');

        res.status(200).json({ message: `${orderType} submitted successfully and emails sent!` });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'An error occurred while processing the order. Please try again later.' });
    }
};

// Route to handle new orders
app.post('/new-order', (req, res) => {
    processOrder(req, res, 'New Order');
});

// Route to handle specific project orders
app.post('/specific-order', (req, res) => {
    processOrder(req, res, 'Specific Project Order');
});

// Register Endpoint
app.post('/register', async (req, res) => {
    const { username, password, email, age, phone, address, gender } = req.body;

    if (!username || !password || !email || !age || !phone || !address || !gender) {
        return res.status(400).json({ message: 'Please fill all the fields' });
    }

    const user = new User({ username, password, email, age, phone, address, gender });

    try {
        await user.save();
        res.status(201).json({ message: 'Registration Complete!' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Login Endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide username and password' });
    }

    try {
        const user = await User.findOne({ username, password });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        res.status(200).json({ message: 'Login Successful!', user });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
