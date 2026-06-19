import { useStore } from '../store/useStore';
import styles from './LoadingOverlay.module.css';

export default function LoadingOverlay() {
  const { isLoading, loadingMsg, loadingProgress } = useStore();
  if (!isLoading) return null;

  const isAtomizing = loadingProgress > 0;

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <div className={styles.ring} />
          <div className={styles.innerDot} />
        </div>
        <div className={styles.msg}>{loadingMsg}</div>
        <div className={styles.pipeline}>
          <span className={isAtomizing ? styles.activeStep : ''}>Analyze</span>
          <span className={loadingProgress > 20 ? styles.activeStep : ''}>Generate</span>
          <span className={loadingProgress > 65 ? styles.activeStep : ''}>Route</span>
          <span className={loadingProgress > 90 ? styles.activeStep : ''}>Track</span>
        </div>
        {isAtomizing && (
          <div className={styles.progressWrap}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${loadingProgress}%` }} />
            </div>
            <span className={styles.progressLabel}>{loadingProgress}%</span>
          </div>
        )}
        <p className={styles.sub}>
          {isAtomizing ? 'Gemma is creating platform-native assets and workflow records' : 'Processing with Gemma via Nebius'}
        </p>
      </div>
    </div>
  );
}
