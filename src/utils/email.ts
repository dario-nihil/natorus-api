import nodemailer from 'nodemailer';

interface IOption {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: IOption) => {
  // 1) Create a trasporter
  const transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 25,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME!,
      pass: process.env.EMAIL_PASSWORD!,
    },
  });
  // 2) Define the email options
  const mailOptions = {
    from: 'Dario Leo <dario@test.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3) Actually send the email
  await transport.sendMail(mailOptions);
};

export default sendEmail;
