const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);


// Function to send email
const sendEmail = async (service, to, userDetails, cart, customMessage = null) => {
    if (!Array.isArray(cart)) {
        throw new Error("Invalid cart format. Cart must be an array.");
    }
 
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
        from: `medmore@ppeliance.co.uk`,
        to,
        subject: customMessage ? 'New Order Notification' : 'Your FoodStuff Order Confirmation',
        text: emailText,
    };

    try {
          await resend.emails.send(mailOptions)
       
   
    } catch (error) {
        return error
    }
};

module.exports = { sendEmail };
