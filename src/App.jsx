import Topbar from './components/Topbar';
import Editor from './components/Editor';
import Results from './components/Results';
import AssetEditor from './components/AssetEditor';
import FutureSimulator from './components/FutureSimulator';
import LoadingOverlay from './components/LoadingOverlay';
import Toast from './components/Toast';
import { useStore } from './store/useStore';
import './index.css';

export default function App() {
  const { view } = useStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Topbar />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {view === 'editor'  && <Editor />}
        {view === 'results' && <Results />}
        {view === 'asset'   && <AssetEditor />}
        {view === 'simulator' && <FutureSimulator />}
      </div>
      <LoadingOverlay />
      <Toast />
    </div>
  );
}
