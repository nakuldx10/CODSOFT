const nodemailer = require('nodemailer');

const createTransporter = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction || process.env.EMAIL_USER) {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // Mock transporter for development when no credentials are provided
    return {
      sendMail: async (options) => {
        console.log('--- Mock Email Sent ---');
        console.log('To:', options.to);
        console.log('Subject:', options.subject);
        return { messageId: 'mock-id' };
      }
    };
  }
};

const sendEmail = async (options) => {
  try {
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: `HireHub <${process.env.EMAIL_USER || 'noreply@hirehub.com'}>`,
      to: options.email,
      subject: options.subject,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email could not be sent:', error.message);
  }
};

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
    .header { background-color: #2563eb; color: #fff; padding: 15px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { padding: 20px; }
    .footer { text-align: center; padding: 10px; font-size: 12px; color: #666; border-top: 1px solid #ddd; margin-top: 20px; }
    h1 { margin: 0; font-size: 24px; }
    a { color: #2563eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>HireHub</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} HireHub. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

exports.sendApplicationConfirmation = async (candidate, job) => {
  const html = baseTemplate(`
    <p>Hi ${candidate.name},</p>
    <p>We have successfully received your application for the <strong>${job.title}</strong> position at <strong>${job.companyName || 'HireHub Partner'}</strong>.</p>
    <p>The employer will review your application and contact you if your profile matches their requirements.</p>
    <p>Good luck!</p>
  `);
  
  await sendEmail({
    email: candidate.email,
    subject: `Application Received: ${job.title}`,
    html
  });
};

exports.sendStatusUpdateEmail = async (candidate, job, newStatus) => {
  const html = baseTemplate(`
    <p>Hi ${candidate.name},</p>
    <p>There has been an update to your application for the <strong>${job.title}</strong> position at <strong>${job.companyName || 'HireHub Partner'}</strong>.</p>
    <p>Your new application status is: <strong>${newStatus}</strong>.</p>
    <p>Log in to your HireHub dashboard to view more details.</p>
  `);

  await sendEmail({
    email: candidate.email,
    subject: `Application Status Update: ${job.title}`,
    html
  });
};

exports.sendNewApplicationAlert = async (employer, candidate, job) => {
  const html = baseTemplate(`
    <p>Hi ${employer.name},</p>
    <p>You have received a new application for the <strong>${job.title}</strong> position.</p>
    <p><strong>Candidate:</strong> ${candidate.name} (${candidate.email})</p>
    <p>Log in to your employer dashboard to review their application and resume.</p>
  `);

  await sendEmail({
    email: employer.email,
    subject: `New Application Received for ${job.title}`,
    html
  });
};

exports.sendContactFormEmail = async (name, email, subject, message) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'admin@hirehub.com';
  const html = baseTemplate(`
    <p><strong>New Contact Form Submission</strong></p>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `);

  await sendEmail({
    email: adminEmail,
    subject: `Contact Form: ${subject}`,
    html
  });
};

exports.sendWelcomeEmail = async (user) => {
  const html = baseTemplate(`
    <p>Hi ${user.name},</p>
    <p>Welcome to HireHub! We're thrilled to have you on board.</p>
    <p>Whether you're looking for your next career move or searching for the perfect candidate, we're here to help you succeed.</p>
    <p>Log in now to complete your profile and get started.</p>
  `);

  await sendEmail({
    email: user.email,
    subject: 'Welcome to HireHub!',
    html
  });
};
