export function AuthScreen() {
  return (
    <div id="auth-screen" className="auth-screen" role="status" aria-live="polite">
      <section className="auth-card">
        <div className="auth-spinner" aria-hidden="true" />
        <h1>知识图谱</h1>
        <p id="auth-status">正在确认 DogeOW 登录状态…</p>
        <button type="button" className="btn primary" id="btn-auth-retry" hidden>
          重新登录
        </button>
      </section>
    </div>
  )
}
