import { useState, useRef } from 'react';
import { Expand, AlignLeft, Wand2, Users, Atom, Sparkles, Copy, RotateCcw, ChevronDown, ShieldCheck, Clock3, BrainCircuit } from 'lucide-react';
import { useStore, STATUS_META } from '../store/useStore';
import AtomizeModal from './AtomizeModal';
import ToneModal from './ToneModal';
import styles from './Editor.module.css';

const SAMPLE = `Host: Welcome to The Daily Bite. I am your host, Sam. Today, we are talking about a cool animal — the sea otter!

Host: Sea otters are small but very smart. Did you know they use tools?

Guest: Sea otters love to eat clams and crabs. But these shells are very hard to open. So, the otter finds a flat rock. It floats on its back and puts the rock on its belly.

Host: Wow, like a little table?

Guest: Exactly! Then, it hits the shell against the rock. Smack, smack, smack! The shell breaks open, and the otter eats the food.

Host: That is amazing. They carry rocks around?

Guest: They do! They even have a flap of skin under their arms. It is like a little pocket to store their favorite rock.

Host: A built-in pocket! I love that. Well, that is all the time we have today. Thank you, Lily.`;

export default function Editor() {
  const { content, setContent, runQuickAction, runGenerate, isLoading, setAtomizeOpen, assets, setView, isMock, collaborators, campaignName, dueWindow, assetMetrics, startSimulation } = useStore();
  const [toneOpen, setToneOpen] = useState(false);
  const [tonePreview, setTonePreview] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const textareaRef = useRef();

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const metrics = assetMetrics();

  const loadSample = () => setContent(SAMPLE);
  const clearAll = () => { setContent(''); setTonePreview(null); };

  const handleQuick = async (type) => {
    if (!content.trim() || isLoading) return;
    await runQuickAction(type);
  };

  const handleGenerate = async () => {
    if (!content.trim() || !aiPrompt.trim() || isLoading) return;
    await runGenerate(aiPrompt);
    setAiPrompt('');
  };

  const acceptTone = () => { if (tonePreview) { setContent(tonePreview); setTonePreview(null); } };

  return (
    <div className={styles.editorPage}>
      {/* Action bar */}
      <div className={styles.actionBar}>
        <button className={styles.actionBtn} onClick={() => handleQuick('expand')} disabled={isLoading || !content.trim()}>
          <Expand size={13} /> Expand
        </button>
        <button className={styles.actionBtn} onClick={() => handleQuick('summarize')} disabled={isLoading || !content.trim()}>
          <AlignLeft size={13} /> Summarize
        </button>
        <button className={styles.actionBtn} onClick={() => setToneOpen(true)} disabled={isLoading || !content.trim()}>
          <Wand2 size={13} /> Improve Tone
        </button>
        <button className={styles.actionBtn} onClick={() => handleQuick('improve')} disabled={isLoading || !content.trim()}>
          <Users size={13} /> Polish Writing
        </button>
        <div className={styles.actionSep} />
        <button className={styles.atomizeBtn} onClick={() => setAtomizeOpen(true)} disabled={isLoading || !content.trim()}>
          <Atom size={13} /> Atomize Content
          {content.trim() && <span className={styles.atomizePulse} />}
        </button>
        <button className={styles.futureBtn} onClick={() => startSimulation(content)} disabled={isLoading || !content.trim()}>
          <BrainCircuit size={13} /> Simulate Future
        </button>
        {assets.length > 0 && (
          <button className={styles.viewResultsBtn} onClick={() => setView('results')}>
            View {assets.length} result{assets.length !== 1 ? 's' : ''} →
          </button>
        )}
      </div>

      <div className={styles.body}>
        {/* Editor panel */}
        <div className={styles.editorPanel}>
          <div className={styles.editorHeader}>
            <div className={styles.editorMeta}>
              <span className={styles.editorLabel}>Master content</span>
              <span className={styles.statusDot}>
                <span className={styles.dot} />
                Ready
              </span>
            </div>
            <div className={styles.editorActions}>
              {!content && (
                <button className={styles.microBtn} onClick={loadSample}>Load sample</button>
              )}
              {content && (
                <button className={styles.microBtn} onClick={clearAll}><RotateCcw size={11} /> Clear</button>
              )}
              {content && (
                <button className={styles.microBtn} onClick={() => navigator.clipboard.writeText(content)}>
                  <Copy size={11} /> Copy
                </button>
              )}
              {isMock && (
                <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: 'var(--amber-dim)', color: 'var(--amber)', border: '1px solid rgba(245,158,11,0.3)' }}>
                  MOCK
                </span>
              )}
            </div>
          </div>

          <div className={styles.textareaWrap}>
            <textarea
              ref={textareaRef}
              className={styles.textarea}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Paste your master content here — a podcast transcript, article, report, or any long-form piece. AtomizeAI will transform it into platform-native formats automatically."
              spellCheck={false}
            />
            {!content && (
              <div className={styles.emptyHint}>
                <Atom size={28} className={styles.emptyIcon} />
                <p>Start writing or paste content above</p>
                <button className={styles.sampleBtn} onClick={loadSample}>Load a sample podcast transcript →</button>
              </div>
            )}
          </div>

          <div className={styles.editorFooter}>
            <span className={styles.counter}>{wordCount} words · {charCount} chars</span>
            {isLoading && <span className={styles.processingLabel}><span className={styles.spinnerSmall} /> Processing...</span>}
          </div>

          {/* Tone preview */}
          {tonePreview && (
            <div className={styles.tonePreview}>
              <div className={styles.tonePreviewHeader}>
                <span className={styles.tonePreviewLabel}><Sparkles size={12} /> Tone preview</span>
                <div className={styles.tonePreviewActions}>
                  <button className={styles.keepBtn} onClick={acceptTone}>Keep this</button>
                  <button className={styles.discardBtn} onClick={() => setTonePreview(null)}>Discard</button>
                </div>
              </div>
              <p className={styles.tonePreviewText}>{tonePreview.slice(0, 300)}{tonePreview.length > 300 ? '...' : ''}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sideSection}>
            <div className={styles.sideLabel}>Workspace</div>
            <div className={styles.workspacePanel}>
              <div>
                <strong>{campaignName}</strong>
                <span><Clock3 size={11} /> {dueWindow}</span>
              </div>
              <div className={styles.metricGrid}>
                <span><b>{metrics.total}</b> assets</span>
                <span><b>{metrics.inReview}</b> review</span>
                <span><b>{metrics.approved + metrics.published}</b> cleared</span>
              </div>
            </div>
          </div>

          <div className={styles.sideDivider} />

          <div className={styles.sideSection}>
            <div className={styles.sideLabel}>Collaborators</div>
            <div className={styles.peopleList}>
              {collaborators.map(person => (
                <div key={person.id} className={styles.personRow}>
                  <span className={styles.avatar} style={{ '--avatar-color': person.color }}>{person.initials}</span>
                  <div>
                    <strong>{person.name}</strong>
                    <span>{person.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.sideDivider} />

          <div className={styles.sideSection}>
            <div className={styles.sideLabel}>AI instruction</div>
            <p className={styles.sideSub}>Add custom instructions for the Generate action</p>
            <textarea
              className={styles.promptInput}
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              placeholder="e.g. Add a strong hook at the start, write a conclusion, make it more concise..."
              rows={4}
            />
            <button
              className={styles.generateBtn}
              onClick={handleGenerate}
              disabled={isLoading || !content.trim() || !aiPrompt.trim()}
            >
              {isLoading ? <><span className={styles.spinnerSmall} /> Generating...</> : <><Sparkles size={13} /> Generate</>}
            </button>
          </div>

          <div className={styles.sideDivider} />

          <div className={styles.sideSection}>
            <div className={styles.sideLabel}><ShieldCheck size={11} /> Session assets</div>
            {assets.length === 0 ? (
              <p className={styles.emptyAssets}>No assets yet. Run Atomize to generate formats from your content.</p>
            ) : (
              <div className={styles.assetList}>
                {assets.slice(-6).reverse().map(a => (
                  <button key={a.id} className={styles.assetItem} onClick={() => { useStore.getState().setActiveAsset(a); }}>
                    <span className={styles.assetIcon}>{a.icon}</span>
                    <div className={styles.assetInfo}>
                      <span className={styles.assetLabel}>{a.label}</span>
                      <span className={styles.assetTime}>{a.time}</span>
                    </div>
                    <span className={`${styles.assetStatus} ${a.status === 'error' ? styles.statusError : ''}`}>
                      {STATUS_META[a.status]?.label || 'Draft'}
                    </span>
                  </button>
                ))}
                {assets.length > 6 && (
                  <button className={styles.viewAllBtn} onClick={() => setView('results')}>
                    View all {assets.length} assets <ChevronDown size={11} />
                  </button>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      <AtomizeModal />
      <ToneModal open={toneOpen} onClose={() => setToneOpen(false)} onPreview={setTonePreview} />
    </div>
  );
}
