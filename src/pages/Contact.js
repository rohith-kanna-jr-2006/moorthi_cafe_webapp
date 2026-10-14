import React, { useState } from 'react';

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState(null); // null, 'success', 'error'

  const handleChange = e => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Simulate API call
    setStatus('success');
    // In real app, would call backend and handle response
    setTimeout(() => {
      setStatus(null);
      setFormState({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="site-shell">
      <div className="page-container">
        <section className="section--cream">
          <div className="section-title">
            <h2>Contact Us</h2>
            <p>Get in touch with Hotel New Moorthi Cafe</p>
          </div>

          {status === 'success' && (
            <div className="alert alert-success">
              Your message has been sent! We will get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formState.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formState.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Send Message
            </button>
          </form>
          <div className="alert alert-info">
            <strong>Note:</strong> Contact form submission is not connected to a backend yet. It shows a success message after 3 seconds for demonstration.
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
