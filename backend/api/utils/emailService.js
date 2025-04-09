import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendManagerInvite = async (email, token) => {
  const inviteLink = `http://localhost:3000/managerSignup?token=${token}`;//change when hosting

  const mailOptions = {
    from: `"GAA Connect" <${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject: '📩 You’ve Been Invited to Join GAA Connect as a Manager',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px;">
        <h2 style="color:#005bac;">GAA Connect</h2>
        <p>Hi there 👋,</p>
        <p>You’ve been invited to register as a <strong>Manager</strong> on <strong>GAA Connect</strong>.</p>
        <p>Click the button below to complete your registration:</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${inviteLink}" style="background-color:#005bac;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:5px;font-weight:bold;">
            Complete Registration
          </a>
        </div>
        <p>This link will expire in <strong>24 hours</strong>.</p>
        <hr style="margin:20px 0;">
        <p style="font-size:12px;color:#888888;">If you did not expect this invite, you can ignore this message.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};
