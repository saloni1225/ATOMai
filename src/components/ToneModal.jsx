import { useState } from 'react';
import { X, Wand2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import styles from './AtomizeModal.module.css';
import ts from './ToneModal.module.css';

export default function ToneModal({ open, onClose, onPreview }) {
  const { improveTone } = useStore();
  const [mood, setMood] = useState('Professional');
  const [style, setStyle] = useState('Narrative');
  const [length, setLength] = useState('Medium');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handle = async () => {
    setLoading(true);
    const result = await improveTone(mood, style, length);
    setLoading(false);
    if (result) { onPreview(result); onClose(); }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.modal} ${ts.toneModal}`}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}><Wand2 size={15} /></div>
            <div>
              <div className={styles.title}>Improve tone</div>
              <div className={styles.subtitle}>Rewrite your content with a new voice</div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}><X size={16} /></button>
        </div>
        <div className={styles.body}>
          <div className={styles.settingsRow} style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Mood</label>
              <select className={styles.select} value={mood} onChange={e => setMood(e.target.value)}>
                {['Professional','Casual','Friendly','Formal','Witty','Inspiring'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Style</label>
              <select className={styles.select} value={style} onChange={e => setStyle(e.target.value)}>
                {['Narrative','Conversational','Academic','Journalistic','Punchy'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Length</label>
              <select className={styles.select} value={length} onChange={e => setLength(e.target.value)}>
                {['Short','Medium','Long'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <div />
          <div className={styles.footerActions}>
            <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button className={styles.runBtn} onClick={handle} disabled={loading}>
              <Wand2 size={13} /> {loading ? 'Rewriting...' : 'Apply tone'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
