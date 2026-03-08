import React, { useState } from 'react';

const ContactForm = ({ formId, promptMessage = "Send me an anonymous message here:" }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState(''); // 'submitting', 'success', 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    const object = {
      access_key: formId, // The Web3forms formId we pass in
      ...formData,
    };
    const json = JSON.stringify(object);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: json,
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form', error);
      setStatus('error');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="contact-form-container">
      <h3 className="contact-form-title">{promptMessage}</h3>
      {status === 'success' ? (
        <div className="contact-form-success">
          <span className="success-icon">✓</span>
          <p>Message sent successfully. Thank you!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name" className="sr-only">Name (Optional)</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Your Name (Optional)"
              value={formData.name}
              onChange={handleChange}
              disabled={status === 'submitting'}
            />
          </div>
          <div className="form-group">
             <label htmlFor="email" className="sr-only">Email (Optional)</label>
             <input
               type="email"
               name="email"
               id="email"
               placeholder="Your Email (Optional)"
               value={formData.email}
               onChange={handleChange}
               disabled={status === 'submitting'}
             />
          </div>
          <div className="form-group">
             <label htmlFor="message" className="sr-only">Message</label>
             <textarea
               name="message"
               id="message"
               rows="4"
               placeholder="Write your message here..."
               value={formData.message}
               onChange={handleChange}
               required
               disabled={status === 'submitting'}
             />
          </div>
          <button 
             type="submit" 
             className="contact-submit-btn" 
             disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Sending...' : 'Send Message'}
          </button>
          
          {status === 'error' && (
             <p className="contact-form-error">Something went wrong. Please try again later.</p>
          )}
        </form>
      )}
    </div>
  );
};

export default ContactForm;
