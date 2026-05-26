import nodemailer from 'nodemailer';

type FileConfig = {
    emailFrom?: string;
    smtpOptions?: any;
};

function loadFileConfig(): FileConfig {
    try {
        return require('../config.json');
    } catch {
        return {};
    }
}

const fileConfig: FileConfig = process.env.NODE_ENV === 'production' ? {} : loadFileConfig();

function getSmtpOptions() {
    if (process.env.SMTP_HOST) {
        return {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: process.env.SMTP_USER ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            } : undefined
        };
    }
    return fileConfig.smtpOptions;
}

const config = {
    emailFrom: process.env.EMAIL_FROM || fileConfig.emailFrom || 'noreply@example.com',
    smtpOptions: getSmtpOptions() || {}
};

export default async function sendEmail({ to, subject, html, from = config.emailFrom }: any) {
    if (process.env.VERCEL || config.smtpOptions.auth?.user === 'your_ethereal_user' || !config.smtpOptions.host) {
        console.log(`[MOCK EMAIL] To: ${to}, Subject: ${subject}`);
        console.log(`[MOCK EMAIL] Content: ${html}`);
        return;
    }
    const transporter = nodemailer.createTransport(config.smtpOptions);
    await transporter.sendMail({ from, to, subject, html });
}
