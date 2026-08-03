'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send, Github, Linkedin, Mail, MapPin, Phone, Globe, CheckCircle, AlertCircle } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

const contactInfo = [
  {
    icon: <Mail size={20} />,
    label: 'Email',
    value: 'jayanth.pallapu@outlook.com',
    href: 'mailto:jayanth.pallapu@outlook.com',
    color: '#3b82f6',
  },
  {
    icon: <MapPin size={20} />,
    label: 'Location',
    value: 'Bangalore, India (Happy to relocate)',
    href: null,
    color: '#818cf8',
  },
  {
    icon: <Phone size={20} />,
    label: 'Phone',
    value: '+91 8105014369',
    href: 'tel:+918105014369',
    color: '#06b6d4',
  },
  {
    icon: <Globe size={20} />,
    label: 'Portfolio',
    value: 'portfolio-blush-five-kaaocyfztr.vercel.app',
    href: 'https://portfolio-blush-five-kaaocyfztr.vercel.app',
    color: '#38bdf8',
  },
];

const socialLinks = [
  {
    icon: <Github size={22} />,
    label: 'GitHub',
    href: 'https://github.com/Jayanthpallapu',
    color: '#3b82f6',
  },
  {
    icon: <Linkedin size={22} />,
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/jayanth-pallapu',
    color: '#818cf8',
  },
  {
    icon: <Mail size={22} />,
    label: 'Email',
    href: 'mailto:jayanth.pallapu@outlook.com',
    color: '#06b6d4',
  },
];

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          source: 'portfolio_website',
        }),
      });

      const result = await response.json().catch(() => ({ success: false, message: 'Request failed' }));

      if (response.ok && result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        setStatus('error');
        setErrorMessage(result.message || 'Something went wrong.');
      }
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <SectionWrapper id="contact" backgroundVariant="aurora">
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[#38bdf8] text-sm font-mono tracking-wider uppercase mb-3"
        >
          Let&apos;s connect
        </motion.p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
          Get In <span className="text-[#38bdf8] glow-text-blue">Touch</span>
        </h2>
        <p className="text-gray-400 text-sm md:text-base mt-4 max-w-lg mx-auto leading-relaxed">
          Have a data challenge or want to collaborate on a project? I&apos;d love to hear from you.
          Drop me a message and I&apos;ll get back to you as soon as possible.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-10">
        {/* Contact Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Info Cards */}
          <div className="space-y-4">
            {contactInfo.map((info) => (
              <motion.div
                key={info.label}
                whileHover={{ x: 5 }}
                className="glass rounded-xl p-4 flex items-center gap-4 group cursor-default"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                  style={{ backgroundColor: `${info.color}15`, color: info.color }}
                >
                  {info.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{info.label}</p>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="text-sm md:text-base text-gray-300 hover:text-white transition-colors font-medium"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-sm md:text-base text-gray-300 font-medium">{info.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social Links */}
          <div className="pt-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Find me on</p>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 20px ${link.color}25`;
                    e.currentTarget.style.borderColor = `${link.color}40`;
                    e.currentTarget.style.color = link.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = '';
                  }}
                  aria-label={link.label}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-3">
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 md:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm text-gray-400 font-medium">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#3b82f6]/50 focus:ring-1 focus:ring-[#3b82f6]/20 transition-all text-sm"
                  placeholder="Your Name"
                  disabled={status === 'submitting'}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-gray-400 font-medium">
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#3b82f6]/50 focus:ring-1 focus:ring-[#3b82f6]/20 transition-all text-sm"
                  placeholder="you@example.com"
                  disabled={status === 'submitting'}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm text-gray-400 font-medium">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#3b82f6]/50 focus:ring-1 focus:ring-[#3b82f6]/20 transition-all text-sm resize-none"
                placeholder="Tell me about your data challenge..."
                disabled={status === 'submitting'}
              />
            </div>

            {/* Error Message */}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
              >
                <AlertCircle size={16} />
                {errorMessage}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={status === 'submitting'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white font-semibold text-sm md:text-base flex items-center justify-center gap-2 hover:from-[#1d4ed8] hover:to-[#2563eb] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : status === 'success' ? (
                <>
                  <CheckCircle size={18} />
                  Message Sent!
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </SectionWrapper>
  );
}
