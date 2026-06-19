import { useState } from 'react';
import { Copy, Edit3, ArrowLeft, Check, Download, Filter, Send, ShieldCheck, UploadCloud, AlertTriangle, GitBranch } from 'lucide-react';
import { useStore, STATUS_META } from '../store/useStore';
import styles from './Results.module.css';

export default function Results() {
  const {
    assets, setView, setActiveAsset, content, collaborators,
    submitForReview, approveAsset, requestChanges, publishAsset, assignAsset, assetMetrics,
  } = useStore();
  const [copied, setCopied] = useState(null);
  const [filter, setFilter] = useState('all');

  const copyAsset = (asset) => {
    navigator.clipboard.writeText(asset.text);
    setCopied(asset.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadAll = () => {
    const text = assets.map(a => `=== ${a.label} ===\n\n${a.text}`).join('\n\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'atomized-content.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = filter === 'all' ? assets : assets.filter(a => a.status === filter || a.formatId === filter);
  const metrics = assetMetrics();
  const statusFilters = [
    ['all', 'All', metrics.total],
    ['draft', 'Draft', metrics.draft],
    ['in_review', 'Review', metrics.inReview],
    ['approved', 'Approved', metrics.approved],
    ['changes', 'Changes', metrics.changes],
    ['published', 'Published', metrics.published],
  ];

  const person = (id) => collaborators.find(c => c.id === id) || collaborators[0];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => setView('editor')}>
            <ArrowLeft size={14} /> Back to editor
          </button>
          <div className={styles.headerInfo}>
            <h2 className={styles.title}>Atomization results</h2>
            <p className={styles.subtitle}>{assets.length} asset{assets.length !== 1 ? 's' : ''} generated from your master content</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.downloadBtn} onClick={downloadAll}>
            <Download size={13} /> Download all
          </button>
        </div>
      </div>

      <div className={styles.body}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sideTitle}>Parent lineage</div>
          <div className={styles.parentCard}>
            <div className={styles.parentLabel}><GitBranch size={12} /> Master document</div>
            <p className={styles.parentPreview}>{content.slice(0, 120)}...</p>
            <div className={styles.parentMeta}>
              <span>{assets.length} child assets</span>
              <span>Version controlled</span>
            </div>
          </div>

          <div className={styles.sideTitle} style={{ marginTop: 16 }}>Workflow stages</div>
          <div className={styles.stageList}>
            {statusFilters.map(([id, label, count]) => (
              <button
                key={id}
                className={`${styles.stageItem} ${filter === id ? styles.childActive : ''}`}
                onClick={() => setFilter(id)}
              >
                <span>{label}</span>
                <b>{count}</b>
              </button>
            ))}
          </div>

          <div className={styles.sideTitle} style={{ marginTop: 16 }}>Child assets</div>
          <div className={styles.childList}>
            {assets.map(a => (
              <button
                key={a.id}
                className={`${styles.childItem} ${filter === a.formatId ? styles.childActive : ''}`}
                onClick={() => setFilter(a.formatId === filter ? 'all' : a.formatId)}
              >
                <span>{a.icon}</span>
                <span className={styles.childLabel}>{a.label}</span>
              </button>
            ))}
          </div>

          {filter !== 'all' && (
            <button className={styles.clearFilter} onClick={() => setFilter('all')}>
              <Filter size={11} /> Show all
            </button>
          )}
        </aside>

        {/* Cards grid */}
        <div className={styles.grid}>
          {filtered.map(asset => (
            <div key={asset.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardType}>
                  <span className={styles.cardIcon}>{asset.icon}</span>
                  <span className={styles.cardLabel}>{asset.label}</span>
                  <span
                    className={styles.cardDot}
                    style={{ background: asset.color, boxShadow: `0 0 6px ${asset.color}` }}
                  />
                </div>
                <span className={`${styles.statusPill} ${styles[STATUS_META[asset.status]?.tone || 'neutral']}`}>
                  {STATUS_META[asset.status]?.label || 'Draft'}
                </span>
              </div>

              <div className={styles.cardBody}>
                <p className={styles.cardText}>{asset.text}</p>
              </div>

              <div className={styles.workflowStrip}>
                <div className={styles.owner}>
                  <span className={styles.avatar} style={{ '--avatar-color': person(asset.assigneeId).color }}>{person(asset.assigneeId).initials}</span>
                  <div>
                    <b>{person(asset.assigneeId).name}</b>
                    <span>{asset.dueIn} · v{asset.version || 1}</span>
                  </div>
                </div>
                <select
                  className={styles.assignSelect}
                  value={asset.assigneeId}
                  onChange={(e) => assignAsset(asset.id, e.target.value)}
                >
                  {collaborators.map(c => <option key={c.id} value={c.id}>{c.role}</option>)}
                </select>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.cardMeta}>
                  {asset.mood && <span className={styles.metaTag}>{asset.mood}</span>}
                  {asset.risk && <span className={styles.metaTag}>{asset.risk}</span>}
                </div>
                <div className={styles.cardActions}>
                  {asset.status === 'draft' || asset.status === 'changes' ? (
                    <button className={styles.cardBtn} onClick={() => submitForReview(asset.id)}>
                      <Send size={11} /> Review
                    </button>
                  ) : null}
                  {asset.status === 'in_review' ? (
                    <>
                      <button className={`${styles.cardBtn} ${styles.approveBtn}`} onClick={() => approveAsset(asset.id)}>
                        <ShieldCheck size={11} /> Approve
                      </button>
                      <button className={styles.cardBtn} onClick={() => requestChanges(asset.id)}>
                        <AlertTriangle size={11} /> Changes
                      </button>
                    </>
                  ) : null}
                  {asset.status === 'approved' ? (
                    <button className={`${styles.cardBtn} ${styles.publishBtn}`} onClick={() => publishAsset(asset.id)}>
                      <UploadCloud size={11} /> Publish
                    </button>
                  ) : null}
                  <button
                    className={`${styles.cardBtn} ${copied === asset.id ? styles.copied : ''}`}
                    onClick={() => copyAsset(asset)}
                  >
                    {copied === asset.id ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                  </button>
                  <button
                    className={`${styles.cardBtn} ${styles.editBtn}`}
                    onClick={() => setActiveAsset(asset)}
                  >
                    <Edit3 size={11} /> Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
