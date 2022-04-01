import { Environment } from "../../config/Environment";
import * as sendGrid from '@sendgrid/mail';
import * as path from "path";
import * as ejs from 'ejs';

sendGrid.setApiKey(Environment.gerMailerConfig().apiKey);

export class Sendgrid {

    private static Subjects = {
        verification: 'VERIFICATION'
    }

    private static TemplatePath = {
        verification: 'verification'
    }

    private static async sendEmail(email: string, subject: string, templatePath: string, params: any) {
        const __dirname = path.resolve();
        const options = {
            from: Environment.gerMailerConfig().sender,
            to: email,
            subject,
            html: await ejs.renderFile(`${__dirname}/templates/${templatePath}.ejs`, { params })
        };

        return sendGrid.send(options, false);
    }

     public static async userVerification(email: string, token: string) {
        await this.sendEmail(email, this.Subjects.verification, this.TemplatePath.verification, { token });
    }
}
