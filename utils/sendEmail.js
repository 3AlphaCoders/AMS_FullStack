const sgMail = require("@sendgrid/mail");

const sendVerificationEmail = async (
  userName,
  userEmail,
  verificationToken
) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const origin = "http://localhost:3000";

  const url = `${origin}/verifyEmail?verificationToken=${verificationToken}&email=${userEmail}`;

  const html = `Hello, ${userName}<br/>
    Please verify your email by clicking <a href="${url}">here</a>
    `;

  const msg = {
    to: userEmail,
    from: process.env.EMAIL_SENDER,
    subject: "Verify Email",
    text: `${html} <br/>
    If this link doesn't work, please paste this link ${url} in a new browser tab.`,
    html,
  };

  await sgMail.send(msg);
};

module.exports = {
  sendVerificationEmail,
};
