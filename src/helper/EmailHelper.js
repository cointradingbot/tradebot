const sgMail = require('@sendgrid/mail');
import * as config from 'config'

class EmailHelper {
    sendEmail(subject, content) {
        let emailConfig = config['email']
        sgMail.setApiKey(emailConfig.apiKey);
        const msg = {
            to: emailConfig.emailTo,
            from: emailConfig.emailFrom,
            subject: subject,
            text: content,
            html: content,
        };
        // sgMail.send(msg);
        console.log(`Sent email to ${msg.to}`)
    }
}

const emailHelper = new EmailHelper()

export { emailHelper }
