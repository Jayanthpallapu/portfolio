'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send, Github, Linkedin, Mail, MapPin, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import { submitContact } from '@/lib/api';

const contactInfo = [
  {
    icon: <Mail size={20} />,
    label: 'Email',
    value: 'jayanth.pallapu@email.com',
    href: 'mailto:jayanth.pallapu@email.com',
    color: '#00d4ff',
  },
  {
    icon: <MapPin size={20} />,
    label: 'Location',
    value: 'India',
    href: null,
    color: '#8b5cf6',
  },
  {
    icon: <Phone size={20} />,
    label: 'Phone',
    value: '+91 98765 43210',
    href: 'tel:+919876543210',
    color: '#10b981',
  },
];

const socialLinks = [
  {
    icon: <Github size={22} />,
    label: 'GitHub',
    href: 'https://github.com/jayanthpallapu',
    color: '#00d4ff',
  },
  {
    icon: <Linkedin size={22} />,
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/jayanthpallapu',
    color: '#3b82f6',
  },
  {
    icon: <Mail size={22} />,
    label: 'Email',
    href: 'mailto:jayanth.pallapu@email.com',
    color: '#8b5cf6',
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
      const result = await submitContact({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        source: 'portfolio_website',
      });

      if (result.success) {
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
    <SectionWrapper id="contact">
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[#00d4ff] text-sm font-mono tracking-wider uppercase mb-3"
        >
          Let&apos;s connect
        </motion.p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Get In <span className="text-[#00d4ff] glow-text-blue">Touch</span>
        </h2>
        <p className="text-gray-400 mt-4 max-w-lg mx-auto">
          Have a project in mind or want to collaborate? I&apos;d love to hear from you.
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
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                  style={{ backgroundColor: `${info.color}15`, color: info.color }}
                >
                  {info.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{info.label}</p>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-300">{info.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social Links */}
          <div className="pt-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Follow me</p>
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
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/20 transition-all text-sm"
                  placeholder="John Doe"
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
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/20 transition-all text-sm"
                  placeholder="john@example.com"
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
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/20 transition-all text-sm resize-none"
                placeholder="Tell me about your project..."
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
              className="w-full py-3.5 rounded-xl bg-[#00d4ff] text-[#0a0a1a] font-semibold flex items-center justify-center gap-2 hover:bg-[#00e5ff] transition-all duration-300 glow-blue disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-[#0a0a1a]/30 border-t-[#0a0a1a] rounded-full"
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
