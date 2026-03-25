import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from '../../context/LangContext';
import { Send, Mail, Instagram, Youtube } from 'lucide-react';
import navLogoSrc from '../../tsangalogosansfond.png';
import { useSectionGlow } from '../../hooks/useSectionGlow';

function InputField({ label, type = 'text', multiline = false, value, onChange }) {
  const [focused, setFocused] = useState(false);

  const commonStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: focused ? '1px solid rgba(74,143,255,0.6)' : '1px solid rgba(255,255,255,0.08)',
    borderRadius: 3,
    padding: '0.9rem 1rem',
    color: '#fff',
    fontSize: '0.85rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s',
    resize: 'none',
    boxSizing: 'border-box',
    cursor: 'none',
  };

  return (
    <div style={{ position: 'relative' }}>
      <label style={{
        display: 'block',
        fontSize: '0.65rem',
        letterSpacing: '0.04em',
        color: focused ? '#4a8fff' : 'rgba(255,255,255,0.35)',
        marginBottom: '0.4rem',
        transition: 'color 0.2s',
      }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={5}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={commonStyle}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={commonStyle}
        />
      )}
    </div>
  );
}

export default function Contact() {
  const { t } = useLang();
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });
  const glow = useSectionGlow();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = form;
    window.location.href = `mailto:management@tsanga.be?subject=${encodeURIComponent(`Message de ${name}`)}&body=${encodeURIComponent(`De: ${name}\nEmail: ${email}\n\n${message}`)}`;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" style={{
      padding: 'clamp(5rem, 10vw, 8rem) clamp(1.5rem, 6vw, 5rem)',
      position: 'relative',
    }}>
      {/* Top line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 'clamp(1.5rem, 6vw, 5rem)',
        right: 'clamp(1.5rem, 6vw, 5rem)',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(74,143,255,0.2), transparent)',
      }} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(3rem, 6vw, 6rem)',
        alignItems: 'start',
      }}
      className="contact-grid">
        {/* Left: Info */}
        <div>
          <div ref={titleRef} style={{ marginBottom: '3rem' }}>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={titleInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8 }}
              style={{ width: 48, height: 1, background: '#4a8fff', marginBottom: '1.2rem', transformOrigin: 'left' }}
            />
            <motion.h2
              ref={glow.ref}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: titleInView ? 1 : 0,
                y: titleInView ? 0 : 20,
                filter: glow.glowing
                  ? [
                      'drop-shadow(0 0 10px rgba(74,143,255,0.95)) drop-shadow(0 0 28px rgba(74,143,255,0.5))',
                      'drop-shadow(0 0 10px rgba(255,40,90,0.95)) drop-shadow(0 0 28px rgba(255,40,90,0.5))',
                      'drop-shadow(0 0 10px rgba(74,143,255,0.95)) drop-shadow(0 0 28px rgba(74,143,255,0.5))',
                    ]
                  : 'drop-shadow(0 0 0px rgba(0,0,0,0))',
              }}
              transition={{
                opacity: { duration: 0.8, delay: 0.15 },
                y: { duration: 0.8, delay: 0.15 },
                filter: glow.glowing
                  ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 1.2, ease: 'easeOut' },
              }}
              onMouseEnter={glow.onMouseEnter}
              onMouseLeave={glow.onMouseLeave}
              style={{
                fontSize: 'clamp(4rem, 10vw, 9rem)',
                fontWeight: 300,
                letterSpacing: '0.04em',
                color: '#fff',
                margin: 0,
                lineHeight: 0.9,
              }}
            >
              {t.contact.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={titleInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{ fontSize: '0.75rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.35)', marginTop: '0.6rem' }}
            >
              {t.contact.subtitle}
            </motion.p>
          </div>

          {/* Contact info blocks */}
          {[
            { label: t.contact.management, email: 'management@tsanga.be' },
            { label: t.contact.booking, email: 'booking@tsanga.be' },
            { label: t.contact.press, email: 'press@tsanga.be' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              style={{
                padding: '1.2rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <p style={{
                fontSize: '0.65rem',
                letterSpacing: '0.04em',
                color: 'rgba(255,255,255,0.35)',
                margin: '0 0 0.3rem',
              }}>
                {item.label}
              </p>
              <a href={`mailto:${item.email}`} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                cursor: 'none',
              }}>
                <Mail size={13} />
                {item.email}
              </a>
            </motion.div>
          ))}

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}
          >
            {[
              { Icon: Instagram, label: '@tsanga_music' },
              { Icon: Youtube, label: 'TSANGA' },
            ].map(({ Icon, label }) => (
              <motion.a
                key={label}
                href="#"
                whileHover={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.3)' }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.9rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  color: 'rgba(255,255,255,0.4)',
                  textDecoration: 'none',
                  fontSize: '0.72rem',
                  letterSpacing: '0.04em',
                  cursor: 'none',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
              >
                <Icon size={14} />
                {label}
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Right: Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
        >
          <InputField
            label={t.contact.name}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <InputField
            label={t.contact.email}
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <InputField
            label={t.contact.message}
            multiline
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          />

          <motion.button
            type="submit"
            whileHover={{ background: 'rgba(74,143,255,0.85)' }}
            whileTap={{ scale: 0.97 }}
            animate={{ background: sent ? 'rgba(60,180,60,0.8)' : '#4a8fff' }}
            style={{
              padding: '0.9rem 2rem',
              border: 'none',
              borderRadius: 3,
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              cursor: 'none',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              transition: 'background 0.3s',
            }}
          >
            <Send size={14} />
            {sent ? '✓ Envoyé' : t.contact.send}
          </motion.button>
        </motion.form>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        style={{
          marginTop: '6rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.06em',
        }}>
          <span>© 2026</span>
          <img
            src={navLogoSrc}
            alt="TSANGA"
            className="nav-logo"
            style={{ height: 28, width: 'auto', display: 'block', mixBlendMode: 'screen' }}
          />
          <span>· Bruxelles</span>
        </div>
      </motion.div>
    </section>
  );
}
