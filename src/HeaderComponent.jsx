import './HeaderComponent.css';

export default function HeaderComponent() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-logo">
            <svg viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div className="header-text">
            <h1 className="header-title">Livi Home Care</h1>
            <span className="header-subtitle">W-2 Generation Tool</span>
          </div>
        </div>
        <span className="header-badge">Tax Year {new Date().getFullYear() - 1}</span>
      </div>
    </header>
  );
}