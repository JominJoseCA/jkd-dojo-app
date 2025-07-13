import React, { useState, useEffect } from 'react';
import { ChevronDown, Users, Trophy, Clock, MapPin, Phone, Mail, Menu, X } from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [classes, setClasses] = useState([]); // State to store class data
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactMessage, setContactMessage] = useState(null); // For success/error messages

  // Effect for header scroll behavior
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect to fetch classes from the backend
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        // Ensure this URL exactly matches your backend server's address and port
        const response = await fetch('http://localhost:5000/api/classes');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Failed to fetch classes:", error);
        // Optionally set an error message for the user, e.g., setContactMessage({ type: 'error', text: 'Could not load classes.' });
      }
    };

    fetchClasses();
  }, []); // Empty dependency array means this runs once on mount

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Offset for fixed header height
      const headerOffset = 96; // Approximate height of the header
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false); // Close mobile menu after navigation
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prevState => ({ ...prevState, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactMessage(null); // Clear previous messages

    try {
      // Ensure this URL exactly matches your backend server's address and port
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit contact form');
      }

      setContactMessage({ type: 'success', text: data.message });
      setContactForm({ name: '', email: '', message: '' }); // Clear form
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setContactMessage({ type: 'error', text: error.message || 'An unexpected error occurred.' });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-gray-900">
      {/* Global Styles */}
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        body {
          font-family: 'Inter', sans-serif;
          /* Adjust body margin for fixed header to prevent content overlap */
          padding-top: 96px; 
        }
        @media (max-width: 767px) {
          body {
            padding-top: 80px; /* Smaller padding for mobile header */
          }
        }
        /* Animation for hero section elements */
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in-up.delay-200 {
          animation-delay: 0.2s;
        }
        .animate-fade-in-up.delay-400 {
          animation-delay: 0.4s;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        `}
      </style>

      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-black/95 backdrop-blur-md shadow-lg' : 'bg-black/95'
        }`}>
        <div className="container mx-auto px-6 pt-8 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">JKD</span>
              </div>
              <div>
                <h1
                  className="text-white font-bold text-xl"
                  data-testid="header-title"
                >
                  Joseph Karate DOJO
                </h1>
                <p className="text-gray-300 text-sm">Traditional Martial Arts</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-white hover:text-red-400 transition-colors text-lg font-medium">
                Home
              </button>
              <button onClick={() => scrollToSection('about')} className="text-white hover:text-red-400 transition-colors text-lg font-medium">
                About
              </button>
              <button onClick={() => scrollToSection('classes')} className="text-white hover:text-red-400 transition-colors text-lg font-medium">
                Classes
              </button>
              <button onClick={() => scrollToSection('instructors')} className="text-white hover:text-red-400 transition-colors text-lg font-medium">
                Instructors
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-white hover:text-red-400 transition-colors text-lg font-medium">
                Contact
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white p-2 focus:outline-none"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-700">
              <div className="flex flex-col space-y-4 pt-4">
                <button onClick={() => scrollToSection('home')} className="text-white hover:text-red-400 transition-colors text-left text-lg py-2 px-3 rounded-md">
                  Home
                </button>
                <button onClick={() => scrollToSection('about')} className="text-white hover:text-red-400 transition-colors text-left text-lg py-2 px-3 rounded-md">
                  About
                </button>
                <button onClick={() => scrollToSection('classes')} className="text-white hover:text-red-400 transition-colors text-left text-lg py-2 px-3 rounded-md">
                  Classes
                </button>
                <button onClick={() => scrollToSection('instructors')} className="text-white hover:text-red-400 transition-colors text-left text-lg py-2 px-3 rounded-md">
                  Instructors
                </button>
                <button onClick={() => scrollToSection('contact')} className="text-white hover:text-red-400 transition-colors text-left text-lg py-2 px-3 rounded-md">
                  Contact
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/7045575/pexels-photo-7045575.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center text-white px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-fade-in-up">
              Joseph Karate
              <span className="block text-red-500">DOJO</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              Master the ancient art of Karate. Develop discipline, strength, and character through traditional martial arts training.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-400">
              <button
                onClick={() => scrollToSection('classes')}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
              >
                View Classes
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-white w-8 h-8" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Our Philosophy</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                At Joseph Karate DOJO, we believe in the transformative power of martial arts to build character, discipline, and inner strength.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src="https://images.pexels.com/photos/7045563/pexels-photo-7045563.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                  alt="Traditional Karate Training"
                  className="rounded-lg shadow-2xl w-full h-auto object-cover"
                />
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-6 text-gray-900">Traditional Values, Modern Training</h3>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Founded on the principles of respect, discipline, and continuous improvement, our dojo honors the ancient traditions of Karate while embracing modern training methodologies.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Community</h4>
                      <p className="text-gray-600">Strong bonds & support</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Excellence</h4>
                      <p className="text-gray-600">Pursuing mastery</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section id="classes" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Our Classes</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the perfect class for your skill level and goals. From beginner-friendly basics to advanced techniques.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <div key={cls.id} className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 border-2 hover:border-red-200">
                    <div className="p-6 pb-4">
                      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                        <img
                          src={cls.image_url || `https://placehold.co/400x300/E0E0E0/333333?text=No+Image`}
                          alt={cls.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/E0E0E0/333333?text=Image+Error"; }}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{cls.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {cls.description}
                      </p>
                    </div>
                    <div className="p-6 pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-gray-600">{cls.schedule}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-gray-600">{cls.age_group}</span>
                        </div>
                        <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-semibold transition-colors duration-300">
                          Join Class
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-full">Loading classes or no classes available...</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section id="instructors" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Meet Our Instructors</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Learn from experienced masters dedicated to your martial arts journey.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="text-center">
                <div className="w-64 h-64 mx-auto mb-6 rounded-full overflow-hidden shadow-2xl">
                  <img
                    src="https://images.pexels.com/photos/7045546/pexels-photo-7045546.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
                    alt="Master Joseph"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Master Joseph</h3>
                <p className="text-red-600 font-semibold mb-4">Head Instructor & Founder</p>
                <p className="text-gray-600 leading-relaxed">
                  With over 25 years of experience, Master Joseph holds a 7th Dan black belt and has trained students worldwide. His approach combines traditional techniques with modern teaching methods.
                </p>
              </div>

              <div className="text-center">
                <div className="w-64 h-64 mx-auto mb-6 rounded-full overflow-hidden shadow-2xl">
                  <img
                    src="https://images.pexels.com/photos/7045561/pexels-photo-7045561.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
                    alt="Sensei Maria"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Sensei Maria</h3>
                <p className="text-red-600 font-semibold mb-4">Senior Instructor</p>
                <p className="text-gray-600 leading-relaxed">
                  Sensei Maria specializes in youth programs and holds a 4th Dan black belt. She brings 15 years of experience in developing young martial artists with patience and expertise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12"> {/* This grid now only contains the two columns below */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Visit Our Dojo</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-red-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Address</h4>
                      <p className="text-gray-300">123 Martial Arts Way<br />Warrior City, WC 12345</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 text-red-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Phone</h4>
                      <p className="text-gray-300">(555) 123-KATA</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-red-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <p className="text-gray-300">info@josephkaratedojo.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6">Class Schedule</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-400">Monday - Friday</h4>
                    <p className="text-gray-300">6:00 PM - 7:30 PM (Beginner)</p>
                    <p className="text-gray-300">7:30 PM - 9:00 PM (Intermediate)</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-400">Saturday</h4>
                    <p className="text-gray-300">10:00 AM - 12:00 PM (Advanced)</p>
                    <p className="text-gray-300">1:00 PM - 2:30 PM (Kids Class)</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-400">Sunday</h4>
                    <p className="text-gray-300">Closed for Rest & Reflection</p>
                  </div>
                </div>
              </div>
            </div> {/* Closing div for grid md:grid-cols-2 gap-12 */}

            {/* Contact Form - Moved outside the grid, but still within max-w-6xl mx-auto */}
            <div className="mt-12 max-w-lg mx-auto bg-gray-800 p-8 rounded-lg shadow-xl">
              <h3 className="text-3xl font-bold mb-6 text-center text-white">Send Us a Message</h3>
              {contactMessage && (
                <div className={`mb-4 p-3 rounded-md text-center ${contactMessage.type === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                  {contactMessage.text}
                </div>
              )}
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
                    placeholder="your@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-300 text-sm font-bold mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
                    placeholder="Your message here..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div> {/* Closing div for max-w-6xl mx-auto */}
        </div> {/* Closing div for container mx-auto px-4 */}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">JKD</span>
              </div>
              <span className="text-xl font-bold">Joseph Karate DOJO</span>
            </div>
            <p className="text-gray-400">
              © {new Date().getFullYear()} Joseph Karate DOJO. All rights reserved. | Building Character Through Martial Arts
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
