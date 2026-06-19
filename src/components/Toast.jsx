import { useStore } from '../store/useStore';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export default function Toast() {
  const { toast } = useStore();
  if (!toast) return null;

  const colors = {
    success: { bg: 'var(--green-dim)', border: 'rgba(16,185,129,0.3)', color: 'var(--green)', Icon: CheckCircle },
    error:   { bg: 'var(--red-dim)',   border: 'rgba(239,68,68,0.3)',   color: 'var(--red)',   Icon: XCircle },
    info:    { bg: 'var(--accent-dim)',border: 'rgba(99,102,241,0.3)',  color: '#818CF8',      Icon: Info },
  };
  const { bg, border, color, Icon } = colors[toast.type] || colors.info;

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 999,
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '10px 14px', borderRadius: 10,
      background: bg, border: `1px solid ${border}`, color,
      fontSize: 13, fontWeight: 500,
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      animation: 'slideInRight 0.2s ease',
    }}>
      <Icon size={14} />
      {toast.msg}
      <style>{`@keyframes slideInRight { from { opacity:0; transform:translateX(12px); } to { opacity:1; transform:translateX(0); } }`}</style>
    </div>
  );
}
