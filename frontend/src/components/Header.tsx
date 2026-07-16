import { NavLink } from 'react-router-dom';
import { Activity, Sun, Moon, Menu, X, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import type { MerchantData } from '../types/merchant';

interface HeaderProps {
  merchants: MerchantData[];
  selectedMerchantId: string;
  onSelectMerchant: (id: string) => void;
}

export default function Header({ merchants, selectedMerchantId, onSelectMerchant }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: isDark
          ? 'rgba(6, 6, 15, 0.8)'
          : 'rgba(255, 255, 255, 0.85)',
        borderBottom: `1px solid var(--border-color)`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Activity size={20} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)' }}>
              Merchant Health
            </span>
          </div>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="desktop-nav">
            {[
              { to: '/', label: 'Dashboard' },
              { to: '/simulator', label: 'Simulator' },
            ].map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                style={({ isActive }) => ({
                  padding: '0.45rem 1rem',
                  borderRadius: 8,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--accent-light)' : 'transparent',
                  transition: 'all 0.2s ease',
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Merchant Selector */}
            <div style={{ position: 'relative' }} className="desktop-nav">
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <select
                  value={selectedMerchantId}
                  onChange={e => onSelectMerchant(e.target.value)}
                  style={{
                    appearance: 'none',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 10,
                    padding: '0.4rem 2.2rem 0.4rem 0.75rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    outline: 'none',
                    minWidth: 160,
                  }}
                >
                  <option value="">Select Merchant</option>
                  {merchants.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} style={{
                  position: 'absolute', right: 8, pointerEvents: 'none',
                  color: 'var(--text-secondary)',
                }} />
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text-secondary)',
                transition: 'all 0.2s ease',
              }}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mobile-menu-btn"
              style={{
                display: 'none', width: 38, height: 38, borderRadius: 10,
                background: 'var(--bg-surface)', border: '1px solid var(--border-color)',
                alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text-secondary)',
              }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="animate-slide-down" style={{
            padding: '0.75rem 0 1rem',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <NavLink
              to="/" end onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                padding: '0.6rem 1rem', borderRadius: 10, textDecoration: 'none',
                fontWeight: 500, fontSize: '0.9rem',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-light)' : 'transparent',
              })}
            >Dashboard</NavLink>
            <NavLink
              to="/simulator" onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                padding: '0.6rem 1rem', borderRadius: 10, textDecoration: 'none',
                fontWeight: 500, fontSize: '0.9rem',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-light)' : 'transparent',
              })}
            >Simulator</NavLink>
            <select
              value={selectedMerchantId}
              onChange={e => { onSelectMerchant(e.target.value); setMobileOpen(false); }}
              style={{
                appearance: 'none', background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)', borderRadius: 10,
                padding: '0.6rem 1rem', fontSize: '0.9rem',
                color: 'var(--text-primary)', cursor: 'pointer',
              }}
            >
              <option value="">Select Merchant</option>
              {merchants.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
