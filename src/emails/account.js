const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const msg = {
//   to: 'siddesht450@gmail.com',
//   from: 'sm9729602@gmail.com',
//   subject: 'Sending with Twilio SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }

const sendWelcomeEmail = (email) => {

    sgMail.send({
        to: email,
        from: 'sm9729602@gmail.com',
        subject: 'Welcome To App',
        text: 'Thanks for registering on our app '
    })
}

const sendCancelEmail = ( email ) => {

    sgMail.send({
        to: email,
        from: 'sm9729602@gmail.com',
        subject: 'Removing Account!',
        text: 'Why you removed your account from Our app? Is there any thing wrong with you ?'
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}

