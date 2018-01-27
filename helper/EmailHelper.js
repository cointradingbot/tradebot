const sgMail = require('@sendgrid/mail');
import * as config from 'config'

class EmailHelper {
    sendEmail(subject, content) {
        let emailConfig = config['Email']
        sgMail.setApiKey(emailConfig.ApiKey);
        const msg = {
            to: emailConfig.EmailTo,
            from: emailConfig.EmailFrom,
            subject: subject,
            text: content,
            html: content,
        };
        sgMail.send(msg);
        console.log(`Sent email to ${msg.to}`)
    }
}

const emailHelper = new EmailHelper()

export { emailHelper }
