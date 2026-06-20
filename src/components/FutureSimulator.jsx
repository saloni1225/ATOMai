import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  BrainCircuit,
  Check,
  CopyPlus,
  Eye,
  FlaskConical,
  Gauge,
  GitCompare,
  MessageSquareText,
  Orbit,
  Play,
  RefreshCw,
  Rocket,
  Sparkles,
  TrendingUp,
  Undo2,
  Wand2,
  Zap,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import styles from './FutureSimulator.module.css';

const twinIcons = {
  students: 'ST',
  professionals: 'PR',
  genz: 'GZ',
  general: 'GA',
};

const ringKeys = [
  ['hook', 'Hook Strength'],
  ['emotional', 'Emotional Impact'],
  ['curiosity', 'Curiosity Gap'],
  ['authority', 'Authority Level'],
  ['shareability', 'Shareability'],
  ['viral', 'Viral Potential'],
];

function ScoreRing({ value, label, tone = 'violet' }) {
  return (
    <motion.div className={styles.scoreRing} whileHover={{ y: -3, scale: 1.02 }}>
      <div className={styles.ringWrap} style={{ '--score': value, '--tone': `var(--future-${tone})` }}>
        <motion.div
          className={styles.ringFill}
          initial={{ background: `conic-gradient(var(--tone) 0deg, rgba(255,255,255,0.08) 0deg)` }}
          animate={{ background: `conic-gradient(var(--tone) ${value * 3.6}deg, rgba(255,255,255,0.08) ${value * 3.6}deg)` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <div className={styles.ringCore}>{value}</div>
      </div>
      <span>{label}</span>
    </motion.div>
  );
}

function Metric({ icon: Icon, label, value, accent }) {
  return (
    <motion.div className={styles.metric} layout whileHover={{ y: -4 }}>
      <span className={styles.metricIcon} style={{ '--metric-accent': accent }}>
        <Icon size={15} />
      </span>
      <div>
        <small>{label}</small>
        <motion.strong key={value} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          {value}
        </motion.strong>
      </div>
    </motion.div>
  );
}

export default function FutureSimulator() {
  const {
    simulation,
    content,
    setView,
    startSimulation,
    optimizeSimulation,
    selectUniverse,
    runUniverseAction,
    applyRecommendation,
    undoRecommendation,
    setRewriteActive,
    publishSimulationWinner,
  } = useStore();
  const [preview, setPreview] = useState(null);

  const sim = simulation || useMemo(() => null, []);

  if (!sim) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyOrb}><BrainCircuit size={42} /></div>
        <h1>Audience Simulator & Future Intelligence Engine</h1>
        <p>Generate content or paste a draft, then open a future forecast before publishing.</p>
        <button onClick={() => content.trim() ? startSimulation(content) : setView('editor')}>
          <Sparkles size={15} /> {content.trim() ? 'Simulate Future' : 'Back to Editor'}
        </button>
      </div>
    );
  }

  const activeUniverse = sim.universes.find(u => u.id === sim.activeUniverseId) || sim.universes[0];
  const topTimeline = Math.max(...sim.timeline.map(t => t.reach));

  return (
    <div className={styles.page}>
      <div className={styles.auroraOne} />
      <div className={styles.auroraTwo} />
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => setView('results')}>
            <ArrowLeft size={14} /> Back
          </button>
          <div>
            <div className={styles.kicker}><Orbit size={13} /> Audience Simulator & Future Intelligence Engine</div>
            <h1>See tomorrow's audience reaction before you publish today.</h1>
            <p>Don't ask AI what to write. Ask your audience what they want to read.</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button onClick={() => optimizeSimulation('Continue Debate')}><MessageSquareText size={14} /> Continue Debate</button>
          <button className={styles.primaryBtn} onClick={publishSimulationWinner}><Rocket size={14} /> Publish Winner</button>
        </div>
      </div>

      <main className={styles.dashboard}>
        <section className={styles.heroPanel}>
          <div className={styles.futureScore}>
            <ScoreRing value={sim.futureScore} label="Future Score" tone={sim.futureScore > 84 ? 'green' : 'violet'} />
            <div>
              <span className={styles.livePill}><span /> Live recalculation</span>
              <h2>{sim.recommendation}</h2>
              <p>{sim.lastAction}. Audience match is {sim.audienceMatch}, confidence is {sim.publishingConfidence}%.</p>
            </div>
          </div>
          <div className={styles.metricGrid}>
            <Metric icon={TrendingUp} label="Predicted Reach" value={sim.metrics.reach} accent="#22d3ee" />
            <Metric icon={Gauge} label="Engagement" value={`${sim.metrics.engagement}%`} accent="#a78bfa" />
            <Metric icon={Zap} label="Saves" value={sim.metrics.saves} accent="#34d399" />
            <Metric icon={Sparkles} label="Shares" value={sim.metrics.shares} accent="#f59e0b" />
            <Metric icon={MessageSquareText} label="Comments" value={sim.metrics.comments} accent="#fb7185" />
            <Metric icon={Rocket} label="Followers" value={sim.metrics.followers} accent="#60a5fa" />
          </div>
        </section>

        <section className={styles.twinsSection}>
          <div className={styles.sectionHead}>
            <div>
              <span>Audience Digital Twins</span>
              <h2>Four simulated audience agents are debating the draft.</h2>
            </div>
            <button onClick={() => optimizeSimulation('Regenerate Analysis')}><RefreshCw size={13} /> Regenerate All</button>
          </div>
          <div className={styles.twinsGrid}>
            {sim.audiences.map((twin) => (
              <motion.article
                layout
                key={`${twin.id}-${sim.runId}`}
                className={styles.twinCard}
                whileHover={{ y: -6, scale: 1.01 }}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={styles.twinTop}>
                  <span className={styles.twinAvatar}>{twinIcons[twin.id]}</span>
                  <div>
                    <h3>{twin.name}</h3>
                    <p>{twin.reaction}</p>
                  </div>
                  <ScoreRing value={twin.pulse} label="Pulse" tone={twin.pulse > 82 ? 'green' : 'cyan'} />
                </div>
                <div className={styles.twinSignal}>
                  <strong>Likes</strong><span>{twin.likes}</span>
                  <strong>Dislikes</strong><span>{twin.dislikes}</span>
                  <strong>Future Sentiment</strong><span>{twin.futureSentiment}</span>
                </div>
                <div className={styles.statList}>
                  {twin.stats.map(([label, value]) => (
                    <div key={label}><span>{label}</span><b>{value}</b></div>
                  ))}
                </div>
                <div className={styles.actionRow}>
                  {twin.actions.map(action => (
                    <button key={action} onClick={() => optimizeSimulation(action)}>{action}</button>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className={styles.universeSection}>
          <div className={styles.sectionHead}>
            <div>
              <span>Future Universe Simulator</span>
              <h2>Alternate realities ranked by predicted performance.</h2>
            </div>
            <button onClick={() => runUniverseAction(activeUniverse?.id, 'Create Variant')}><FlaskConical size={13} /> Create Variant</button>
          </div>
          <div className={styles.universeGrid}>
            {sim.universes.map((universe) => (
              <motion.article
                layout
                key={universe.id}
                className={`${styles.universeCard} ${sim.activeUniverseId === universe.id ? styles.activeUniverse : ''}`}
                onClick={() => selectUniverse(universe.id)}
                whileHover={{ y: -7 }}
              >
                <div className={styles.universeHeader}>
                  <span>Universe {universe.id}</span>
                  {universe.recommended && <b><Check size={12} /> Recommended</b>}
                </div>
                <h3>{universe.name}</h3>
                <div className={styles.universeStats}>
                  <div><span>Reach</span><strong>{universe.reachLabel}</strong></div>
                  <div><span>CTR</span><strong>{universe.ctr}%</strong></div>
                  <div><span>Engagement</span><strong>{universe.engagement}%</strong></div>
                  <div><span>Audience Fit</span><strong>{universe.fit}</strong></div>
                </div>
                <div className={styles.universeActions}>
                  {[
                    ['Preview Content', Eye],
                    ['Run Simulation Again', RefreshCw],
                    ['Set As Final Version', Check],
                    ['Compare Against Current', GitCompare],
                    ['Duplicate Universe', CopyPlus],
                    ['Create Variant', FlaskConical],
                  ].map(([action, Icon]) => (
                    <button
                      key={action}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (action === 'Preview Content') setPreview(universe);
                        runUniverseAction(universe.id, action);
                      }}
                    >
                      <Icon size={11} /> {action}
                    </button>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className={styles.middleGrid}>
          <div className={styles.debatePanel}>
            <div className={styles.sectionHead}>
              <div>
                <span>AI Audience Debate</span>
                <h2>Multi-agent strategy room</h2>
              </div>
            </div>
            <div className={styles.debateStream}>
              <AnimatePresence mode="popLayout">
                {sim.debate.map((line, index) => (
                  <motion.div
                    key={line.id}
                    className={`${styles.bubble} ${styles[line.tone] || ''}`}
                    initial={{ opacity: 0, x: index % 2 ? 26 : -26, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <strong>{line.agent}</strong>
                    <p>{line.message}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className={styles.debateActions}>
              {['Continue Debate', 'Generate Counter Arguments', 'Resolve Conflict', 'Optimize Based On Debate'].map(action => (
                <button key={action} onClick={() => optimizeSimulation(action)}>{action}</button>
              ))}
            </div>
          </div>

          <div className={styles.recommendPanel}>
            <div className={styles.sectionHead}>
              <div>
                <span>Content Improvement Center</span>
                <h2>Audience-specific recommendations</h2>
              </div>
            </div>
            <div className={styles.recommendList}>
              {sim.recommendations.map((rec) => (
                <motion.div className={styles.recommendation} key={rec.id} layout whileHover={{ x: 4 }}>
                  <div>
                    <h3>{rec.title}</h3>
                    <p>{rec.audience} - {rec.detail}</p>
                    <span>Impact Score {rec.impact}/100</span>
                  </div>
                  <div className={styles.lifts}>
                    <b>{rec.reachLift}</b><small>Reach</small>
                    <b>{rec.engagementLift}</b><small>Engagement</small>
                  </div>
                  <div className={styles.recActions}>
                    <button onClick={() => applyRecommendation(rec.id)}>Apply</button>
                    <button onClick={() => setPreview({ name: rec.title, preview: rec.detail })}>Preview</button>
                    <button onClick={() => optimizeSimulation(`Compare ${rec.title}`)}>Compare</button>
                    <button onClick={undoRecommendation}><Undo2 size={11} /> Undo</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.analyticsGrid}>
          <div className={styles.timelinePanel}>
            <div className={styles.sectionHead}>
              <div>
                <span>Content Timeline Simulator</span>
                <h2>Projected reach curve</h2>
              </div>
            </div>
            <div className={styles.timelineBars}>
              {sim.timeline.map(point => (
                <div key={point.label} className={styles.timelineRow}>
                  <span>{point.label}</span>
                  <div><motion.i initial={{ width: 0 }} animate={{ width: `${(point.reach / topTimeline) * 100}%` }} /></div>
                  <b>{point.reachLabel}</b>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.viralityPanel}>
            <div className={styles.sectionHead}>
              <div>
                <span>Virality Engine</span>
                <h2>Signal strength rings</h2>
              </div>
            </div>
            <div className={styles.ringGrid}>
              {ringKeys.map(([key, label]) => (
                <ScoreRing key={key} value={sim.virality[key]} label={label} tone={key === 'viral' ? 'green' : key === 'authority' ? 'cyan' : 'violet'} />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.rewriteLab}>
          <div className={styles.sectionHead}>
            <div>
              <span>AI Rewrite Lab</span>
              <h2>Versioned futures with one-click simulation.</h2>
            </div>
          </div>
          <div className={styles.rewriteGrid}>
            {sim.rewrites.map(rewrite => (
              <motion.article className={styles.rewriteCard} key={rewrite.id} whileHover={{ y: -5 }}>
                <div className={styles.rewriteHead}>
                  <span>Version {rewrite.id}</span>
                  <b>{rewrite.score}/100</b>
                </div>
                <h3>{rewrite.name}</h3>
                <p>{rewrite.text}</p>
                <div>
                  <button onClick={() => setPreview({ name: rewrite.name, preview: rewrite.text })}><Eye size={11} /> Preview</button>
                  <button onClick={() => setRewriteActive(rewrite.id)}><Play size={11} /> Simulate</button>
                  <button onClick={() => optimizeSimulation(`Compare ${rewrite.name}`)}><GitCompare size={11} /> Compare</button>
                  <button onClick={() => setRewriteActive(rewrite.id)}><Wand2 size={11} /> Set Active</button>
                  <button onClick={publishSimulationWinner}><Rocket size={11} /> Publish</button>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </main>

      <AnimatePresence>
        {preview && (
          <motion.div className={styles.previewOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreview(null)}>
            <motion.div className={styles.previewModal} initial={{ y: 30, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, scale: 0.96 }} onClick={(e) => e.stopPropagation()}>
              <span>Future Preview</span>
              <h2>{preview.name}</h2>
              <p>{preview.preview}</p>
              <button onClick={() => setPreview(null)}>Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
