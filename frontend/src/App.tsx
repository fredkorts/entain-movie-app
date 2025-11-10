import { useEffect, useState } from 'react';

function App() {
  const [health, setHealth] = useState<string>('checking…');

  useEffect(() => {
    fetch(import.meta.env.VITE_API_BASE_URL + '/health')
      .then(r => r.json())
      .then(d => setHealth(d.ok ? 'ok' : 'not ok'))
      .catch(() => setHealth('error'));
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui', padding: 16 }}>
      <h1>Hello Movies</h1>
      <p>Backend health: {health}</p>
    </div>
  );
}

export default App;
