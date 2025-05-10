'use client';

import { useState } from 'react';

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setFormStatus({ type: 'loading', message: 'Sending your message...' });
    
    setTimeout(() => {
      setFormStatus({ 
        type: 'success', 
        message: 'Thank you for your message! We will get back to you soon.' 
      });
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">About Us</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="mb-6 text-gray-300">
              Founded in 2010, our barbershop has been dedicated to providing the highest quality grooming services for men. 
              Our team of skilled barbers combines traditional techniques with modern styles to give you the perfect look.
            </p>
            <p className="mb-8 text-gray-300">
              We believe that a great haircut is more than just a service—it's an experience. 
              That's why we've created a comfortable, stylish environment where you can relax and enjoy premium service.
            </p>
            
            <h2 className="text-2xl font-bold mb-4">Our Services</h2>
            <ul className="space-y-2 mb-8 text-gray-300">
              <li>• Premium Haircuts</li>
              <li>• Beard Trimming & Styling</li>
              <li>• Hot Towel Shaves</li>
              <li>• Hair Styling</li>
              <li>• Facial Treatments</li>
            </ul>
            
            <h2 className="text-2xl font-bold mb-4">Business Hours</h2>
            <div className="grid grid-cols-2 gap-2 text-gray-300">
              <div>Monday - Friday</div>
              <div>9:00 AM - 8:00 PM</div>
              <div>Saturday</div>
              <div>10:00 AM - 6:00 PM</div>
              <div>Sunday</div>
              <div>Closed</div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
            
            <div className="bg-gray-900 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Send Us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-gray-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-gray-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-gray-500"
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded transition duration-300"
                  disabled={formStatus.type === 'loading'}
                >
                  {formStatus.type === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
                
                {formStatus.message && (
                  <div className={`p-3 rounded ${formStatus.type === 'success' ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'}`}>
                    {formStatus.message}
                  </div>
                )}
              </form>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Our Location</h3>
              <p className="mb-4">123 Barber Street, Downtown<br />New York, NY 10001</p>
              <p className="mb-4">
                <strong>Phone:</strong> (555) 123-4567<br />
                <strong>Email:</strong> info@stylishbarbershop.com
              </p>
              
              <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30592552445!2d-74.25986548248113!3d40.69714941680122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1600000000000!5m2!1sen!2s" 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  aria-hidden="false" 
                  tabIndex="0"
                  title="Google Maps"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}