import { Zap, Layers, ChevronRight, Users } from 'lucide-react';
import { useStore } from '../store/useStore';
import styles from './Topbar.module.css';

export default function Topbar() {
  const { assets, view, setView, collaborators, modelName } = useStore();

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}><Zap size={14} /></div>
          <span className={styles.logoText}>AtomizeAI</span>
          <span className={styles.logoBadge}>Beta</span>
        </div>
        {view !== 'editor' && (
          <nav className={styles.breadcrumb}>
            <button className={styles.crumbBtn} onClick={() => setView('editor')}>Editor</button>
            <ChevronRight size={12} className={styles.crumbSep} />
            {view === 'results' && <span className={styles.crumbActive}>Results</span>}
            {view === 'asset' && (
              <>
                <button className={styles.crumbBtn} onClick={() => setView('results')}>Results</button>
                <ChevronRight size={12} className={styles.crumbSep} />
                <span className={styles.crumbActive}>Asset editor</span>
              </>
            )}
          </nav>
        )}
      </div>
      <div className={styles.right}>
        <div className={styles.modelBadge}>
          <span className={styles.modelDot} />
          {modelName}
        </div>
        <div className={styles.teamBadge}>
          <Users size={13} />
          {collaborators.length} roles
        </div>
        {assets.length > 0 && (
          <button className={styles.assetCount} onClick={() => setView('results')}>
            <Layers size={13} />
            {assets.length} asset{assets.length !== 1 ? 's' : ''}
          </button>
        )}
      </div>
    </header>
  );
}
