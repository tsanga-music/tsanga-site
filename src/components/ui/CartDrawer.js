import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useLang } from '../../context/LangContext';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartDrawer() {
  const { items, remove, updateQty, total, open, setOpen } = useCart();
  const { t } = useLang();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 1100,
              backdropFilter: 'blur(4px)',
              cursor: 'none',
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(420px, 100vw)',
              background: 'rgba(6,6,18,0.98)',
              borderLeft: '1px solid rgba(74,143,255,0.15)',
              zIndex: 1200,
              display: 'flex',
              flexDirection: 'column',
              cursor: 'none',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(74,143,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShoppingBag size={18} color="#4a8fff" />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.04em' }}>
                  {t.shop.cart}
                </span>
              </div>
              <button onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'none', color: 'rgba(255,255,255,0.5)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
              {items.length === 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: 'rgba(255,255,255,0.25)',
                  gap: '1rem',
                }}>
                  <ShoppingBag size={48} />
                  <p style={{ fontSize: '0.85rem', letterSpacing: '0.04em' }}>{t.shop.empty}</p>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem 0',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      {/* Icon */}
                      <div style={{
                        width: 52,
                        height: 52,
                        background: 'rgba(74,143,255,0.08)',
                        border: '1px solid rgba(74,143,255,0.2)',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: '1.2rem',
                      }}>
                        {item.type === 'Vinyl' ? '💿' :
                         item.type === 'Apparel' || item.type === 'Bekleidung' ? '👕' :
                         item.type === 'Cassette' || item.type === 'Kassette' ? '📼' :
                         item.type === 'Print' || item.type === 'Druck' ? '🖼️' : '📦'}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#4a8fff' }}>{item.price} €</div>
                      </div>

                      {/* Qty controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <QtyBtn onClick={() => updateQty(item.id, item.qty - 1)}><Minus size={11} /></QtyBtn>
                        <span style={{ fontSize: '0.8rem', minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                        <QtyBtn onClick={() => updateQty(item.id, item.qty + 1)}><Plus size={11} /></QtyBtn>
                      </div>

                      {/* Remove */}
                      <button onClick={() => remove(item.id)}
                        style={{ background: 'none', border: 'none', cursor: 'none', color: 'rgba(255,255,255,0.25)', marginLeft: '0.3rem' }}>
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{
                padding: '1.5rem',
                borderTop: '1px solid rgba(74,143,255,0.1)',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '1.2rem',
                  fontSize: '0.85rem',
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}>
                    {t.shop.total}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{total} €</span>
                </div>
                <motion.button
                  whileHover={{ background: 'rgba(74,143,255,0.9)' }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    background: '#4a8fff',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'none',
                    color: '#fff',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    fontFamily: 'inherit',
                  }}>
                  {t.shop.checkout}
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function QtyBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 22,
      height: 22,
      background: 'rgba(74,143,255,0.12)',
      border: '1px solid rgba(74,143,255,0.25)',
      borderRadius: 4,
      cursor: 'none',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {children}
    </button>
  );
}
