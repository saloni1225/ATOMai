import { useState } from 'react';
import { ArrowLeft, Copy, Check, RefreshCw, Save, Send, ShieldCheck, UploadCloud, AlertTriangle } from 'lucide-react';
import { useStore, STATUS_META } from '../store/useStore';
import styles from './AssetEditor.module.css';

export default function AssetEditor() {
  const {
    activeAsset, setView, regenerateAsset, updateAssetText, submitForReview,
    approveAsset, requestChanges, publishAsset, assignAsset, collaborators,
  } = useStore();
  const [text, setText] = useState(activeAsset?.text || '');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  if (!activeAsset) { setView('results'); return null; }

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const save = () => {
    updateAssetText(activeAsset.id, text);
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const regenerate = async () => {
    setRegenerating(true);
    const result = await regenerateAsset(activeAsset);
    if (result) setText(result);
    setRegenerating(false);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const latest = useStore.getState().assets.find(a => a.id === activeAsset.id) || activeAsset;
  const assignee = collaborators.find(c => c.id === latest.assigneeId) || collaborators[0];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => setView('results')}>
          <ArrowLeft size={14} /> Back to results
        </button>
        <div className={styles.assetTitle}>
          <span className={styles.assetIcon}>{activeAsset.icon}</span>
          <span className={styles.assetLabel}>{activeAsset.label}</span>
          <span className={`${styles.statusPill} ${styles[STATUS_META[latest.status]?.tone || 'neutral']}`}>
            {STATUS_META[latest.status]?.label || 'Draft'}
          </span>
          <span className={styles.assetTime}>Generated {activeAsset.time} · v{latest.version || 1}</span>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.actionBtn} onClick={regenerate} disabled={regenerating}>
            <RefreshCw size={12} className={regenerating ? styles.spinning : ''} />
            {regenerating ? 'Regenerating...' : 'Regenerate'}
          </button>
          <button className={`${styles.actionBtn} ${copied ? styles.success : ''}`} onClick={copy}>
            {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
          </button>
          <button className={`${styles.saveBtn} ${saved ? styles.success : ''}`} onClick={save}>
            {saved ? <><Check size={12} /> Saved</> : <><Save size={12} /> Save changes</>}
          </button>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.editorWrap}>
          <div className={styles.editorMeta}>
            <div className={styles.metaTags}>
              {activeAsset.mood && <span className={styles.tag}>{activeAsset.mood}</span>}
              {activeAsset.audience && <span className={styles.tag}>{activeAsset.audience}</span>}
              {activeAsset.length && <span className={styles.tag}>{activeAsset.length}</span>}
            </div>
            <span className={styles.wordCount}>{wordCount} words</span>
          </div>
          <textarea
            className={styles.textarea}
            value={text}
            onChange={e => setText(e.target.value)}
            spellCheck={false}
          />
        </div>

        <aside className={styles.workflowPanel}>
          <div className={styles.panelSection}>
            <div className={styles.sectionTitle}>Approval routing</div>
            <div className={styles.ownerBox}>
              <span className={styles.avatar} style={{ '--avatar-color': assignee.color }}>{assignee.initials}</span>
              <div>
                <strong>{assignee.name}</strong>
                <span>{assignee.role} · due {latest.dueIn || 'soon'}</span>
              </div>
            </div>
            <select className={styles.select} value={latest.assigneeId} onChange={(e) => assignAsset(latest.id, e.target.value)}>
              {collaborators.map(c => <option key={c.id} value={c.id}>{c.name} · {c.role}</option>)}
            </select>
            <div className={styles.workflowActions}>
              {(latest.status === 'draft' || latest.status === 'changes') && (
                <button onClick={() => submitForReview(latest.id)}><Send size={12} /> Submit</button>
              )}
              {latest.status === 'in_review' && (
                <>
                  <button className={styles.okBtn} onClick={() => approveAsset(latest.id)}><ShieldCheck size={12} /> Approve</button>
                  <button onClick={() => requestChanges(latest.id)}><AlertTriangle size={12} /> Changes</button>
                </>
              )}
              {latest.status === 'approved' && (
                <button className={styles.publishBtn} onClick={() => publishAsset(latest.id)}><UploadCloud size={12} /> Publish</button>
              )}
            </div>
          </div>

          <div className={styles.panelSection}>
            <div className={styles.sectionTitle}>Audit trail</div>
            <div className={styles.auditList}>
              {(latest.audit || []).slice().reverse().map(item => (
                <div key={item.id} className={styles.auditItem}>
                  <span className={styles.auditDot} />
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.actor} · {item.at}</p>
                    {item.note && <em>{item.note}</em>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
