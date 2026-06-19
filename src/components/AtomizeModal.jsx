import { X, Atom, Sparkles, Wand2 } from 'lucide-react';
import { useStore, FORMATS } from '../store/useStore';
import styles from './AtomizeModal.module.css';

export default function AtomizeModal() {
  const {
    atomizeOpen, setAtomizeOpen,
    selectedFormats, toggleFormat,
    mood, audience, length,
    setMood, setAudience, setLength,
    runAtomize, autoDetectFormats, isLoading,
  } = useStore();

  if (!atomizeOpen) return null;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && setAtomizeOpen(false)}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}><Atom size={15} /></div>
            <div>
              <div className={styles.title}>Atomize content</div>
              <div className={styles.subtitle}>Select output formats and settings</div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={() => setAtomizeOpen(false)}><X size={16} /></button>
        </div>

        <div className={styles.body}>
          <div className={styles.sectionLabel}>Output formats</div>
          <div className={styles.formatGrid}>
            {FORMATS.map(f => (
              <button
                key={f.id}
                className={`${styles.formatChip} ${selectedFormats.has(f.id) ? styles.selected : ''}`}
                onClick={() => toggleFormat(f.id)}
                style={selectedFormats.has(f.id) ? { '--chip-color': f.color } : {}}
              >
                <span className={styles.chipIcon}>{f.icon}</span>
                <span className={styles.chipLabel}>{f.label}</span>
                {selectedFormats.has(f.id) && <span className={styles.checkmark}>✓</span>}
              </button>
            ))}
          </div>

          <button className={styles.autoDetectBtn} onClick={autoDetectFormats} disabled={isLoading}>
            <Wand2 size={13} />
            Auto-detect best formats for my content
            <span className={styles.agentBadge}>AI</span>
          </button>

          <div className={styles.divider} />

          <div className={styles.sectionLabel}>Generation settings</div>
          <div className={styles.settingsRow}>
            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Mood</label>
              <select className={styles.select} value={mood} onChange={e => setMood(e.target.value)}>
                {['Professional','Casual','Friendly','Formal','Witty','Inspiring','Urgent'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Audience</label>
              <select className={styles.select} value={audience} onChange={e => setAudience(e.target.value)}>
                {['General public','Professionals','Students','Executives','Tech enthusiasts','Teens','Seniors'].map(o => <option key={o}>{o}</option>)}
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
          <div className={styles.footerInfo}>
            {selectedFormats.size} format{selectedFormats.size !== 1 ? 's' : ''} selected
          </div>
          <div className={styles.footerActions}>
            <button className={styles.cancelBtn} onClick={() => setAtomizeOpen(false)}>Cancel</button>
            <button className={styles.runBtn} onClick={runAtomize} disabled={isLoading}>
              <Sparkles size={13} /> Run atomization
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
