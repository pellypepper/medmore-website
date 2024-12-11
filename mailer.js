const nodemailer = require('nodemailer');

// Function to create a transporter based on the email service
const createTransporter = (service) => {
    return nodemailer.createTransport({
        service: 'gmail', // Email service provider: 'gmail', 'yahoo', 'hotmail', etc.
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, 
        },
    });
};

// Function to send email
const sendEmail = async (service, to, userDetails, cart, customMessage = null) => {
    if (!Array.isArray(cart)) {
        throw new Error("Invalid cart format. Cart must be an array.");
    }
    const transporter = createTransporter(service);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    const emailText = customMessage || `Hello ${userDetails.firstname},

Thank you for shopping with FoodStuff! Here's your order confirmation.

Name: ${userDetails.firstname} ${userDetails.lastname}
Email: ${userDetails.email}
Address: ${userDetails.address}
Cart Items:
${cart.map(item => `- ${item.productName}: $${item.price} x ${item.quantity}`).join('\n')}

Total: $${total}
Your order will be delivered to you soon.

Best regards,
The FoodStuff Team`;

    const mailOptions = {
        from: `"FoodStuff" <${process.env.EMAIL_USER}>`,
        to,
        subject: customMessage ? 'New Order Notification' : 'Your FoodStuff Order Confirmation',
        text: emailText,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
    }
};

module.exports = { sendEmail };
