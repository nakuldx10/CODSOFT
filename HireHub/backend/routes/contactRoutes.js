const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { sendContactFormEmail } = require('../utils/emailService');

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: { success: false, message: 'Too many contact requests, please try again later.' }
});

router.post('/', contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    sendContactFormEmail(name, email, subject, message).catch(e => console.error('Contact form email error:', e));

    res.status(200).json({ success: true, message: 'Your message has been sent successfully' });
  } catch (error) {
    console.error('Contact route error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
