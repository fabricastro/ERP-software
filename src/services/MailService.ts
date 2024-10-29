import { BaseService } from './BaseService';

interface MailAttachment {
    filename: string;
    content: string;
    contentType: string;
}

class MailService extends BaseService {
    constructor() {
        super(import.meta.env.VITE_API_URL); // Usa la URL base de la API
    }

    async sendMail(
        to: string,
        subject: string,
        text: string,
        html: string,
        attachments: MailAttachment[]
    ) {
        return this.post('/mailer', {
            to,
            subject,
            text,
            html,
            attachments,
        });
    }
}

export const mailService = new MailService();
