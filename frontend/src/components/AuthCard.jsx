export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 className="auth-logo">Pixora</h1>
        <p className="auth-subtitle">{subtitle}</p>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
