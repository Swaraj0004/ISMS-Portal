require('dotenv').config();
const nodemailer = require('nodemailer');

(async () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  console.log('SMTP debug script using', { host, port, user: user ? user.replace(/.(?=.{2})/g, '*') : undefined });

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user, pass },
    tls: { minVersion: 'TLSv1.2', rejectUnauthorized: false },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
    logger: true,
    debug: true,
  });

  try {
    console.log('Calling transporter.verify()...');
    await transporter.verify();
    console.log('transporter.verify() succeeded');
  } catch (err) {
    console.error('transporter.verify() failed:');
    console.error(err);
    process.exitCode = 2;
    return;
  }

  try {
    console.log('Sending test message...');
    const info = await transporter.sendMail({
      from: `"ISMS Debug" <${user}>`,
      to: process.env.DEBUG_TEST_RECIPIENT || user,
      subject: 'ISMS SMTP debug test',
      text: 'If you receive this, SMTP send succeeded.'
    });
    console.log('sendMail info:', info);
  } catch (err) {
    console.error('sendMail failed:');
    console.error(err);
    process.exitCode = 3;
  }
})();
