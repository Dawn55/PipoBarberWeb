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
    
    setFormStatus({ type: 'loading', message: 'Mesajınız gönderiliyor...' });
    
    setTimeout(() => {
      setFormStatus({ 
        type: 'success', 
        message: 'Mesajınız için teşekkür ederiz! En kısa sürede size dönüş yapacağız.' 
      });
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Hakkımızda</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Bizim Hikayemiz</h2>
            <p className="mb-6 text-gray-300">
              2010 yılında kurulan berber dükkanımız, erkeklere en kaliteli tıraş ve bakım hizmetlerini sunmaya adanmıştır.
              Usta berberlerimiz, geleneksel teknikleri modern tarzlarla birleştirerek size mükemmel görünümü kazandırır.
            </p>
            <p className="mb-8 text-gray-300">
              İyi bir saç kesiminin sadece bir hizmet değil, bir deneyim olduğuna inanıyoruz.
              Bu yüzden rahat edebileceğiniz, şık bir ortam yaratarak premium hizmet sunuyoruz.
            </p>
            
            <h2 className="text-2xl font-bold mb-4">Hizmetlerimiz</h2>
            <ul className="space-y-2 mb-8 text-gray-300">
              <li>• Premium Saç Kesimi</li>
              <li>• Sakal Düzeltme ve Şekillendirme</li>
              <li>• Sıcak Havlu Tıraşı</li>
              <li>• Saç Şekillendirme</li>
              <li>• Yüz Bakımı</li>
            </ul>
            
            <h2 className="text-2xl font-bold mb-4">Çalışma Saatleri</h2>
            <div className="grid grid-cols-2 gap-2 text-gray-300">
              <div>Pazartesi - Cuma</div>
              <div>09:00 - 20:00</div>
              <div>Cumartesi</div>
              <div>10:00 - 18:00</div>
              <div>Pazar</div>
              <div>Kapalı</div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6">İletişim</h2>
            
            <div className="bg-gray-900 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Bize Mesaj Gönderin</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-1">Adınız</label>
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
                  <label htmlFor="message" className="block mb-1">Mesajınız</label>
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
                  {formStatus.type === 'loading' ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                </button>
                
                {formStatus.message && (
                  <div className={`p-3 rounded ${formStatus.type === 'success' ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'}`}>
                    {formStatus.message}
                  </div>
                )}
              </form>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Adresimiz</h3>
              <p className="mb-4">Kaptanağa Sokak No:11, Kale Mahallesi<br />İlkadım, Samsun</p>
              <p className="mb-4">
                <strong>Telefon:</strong> (0362) 123 45 67<br />
                <strong>Email:</strong> info@premiumberber.com
              </p>
              
              <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3028.222146572841!2d36.33084731540315!3d41.28684777927383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x408877e9a8f1e6d9%3A0x3e9a7a7a3a3a3a3a!2sKaptana%C4%9Fa%20Sk.%20No%3A11%2C%20Kale%20Mahallesi%2C%2055025%20%C4%B0lkad%C4%B1m%2FSamsun!5e0!3m2!1str!2str!4v1620000000000!5m2!1str!2str" 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  aria-hidden="false" 
                  tabIndex="0"
                  title="Google Haritalar"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}