import { useEffect } from 'react'
import { AppMenu } from '../components/AppMenu'
import { AuthScreen } from '../components/AuthScreen'
import { GraphWorkspace } from '../components/GraphWorkspace'
import { Sidebar } from '../components/Sidebar'
import { Toolbar } from '../components/Toolbar'

/**
 * 过渡期应用壳：React 负责页面结构，现有图谱控制器继续管理 Cytoscape
 * 与命令式交互。壳本身不维护会导致重渲染的 UI 状态，避免与控制器争夺 DOM。
 */
export function App() {
  useEffect(() => {
    let cancelled = false

    // Keep the authentication shell small and load Cytoscape plus the legacy
    // controllers as a separate chunk after React has committed their hosts.
    void import('../application/KnowledgeGraphApplication.js')
      .then(({ bootstrapApplication }) => {
        if (!cancelled) bootstrapApplication()
      })
      .catch((error) => {
        if (cancelled) return
        console.error('应用模块加载失败', error)
        const status = document.getElementById('auth-status')
        const retry = document.getElementById('btn-auth-retry')
        if (status) status.textContent = '应用加载失败，请刷新后重试'
        if (retry) {
          retry.hidden = false
          retry.addEventListener('click', () => window.location.reload(), { once: true })
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <AuthScreen />
      <div id="app">
        <Toolbar />
        <div id="app-workspace" className="app-workspace">
          <aside id="detail-panel" className="sidebar-detail" data-ui-chrome="">
            <div className="detail-panel-header">
              <h2>详情</h2>
            </div>
            <div id="detail-content" className="detail-content" />
          </aside>

          <GraphWorkspace />

          <button
            type="button"
            id="mobile-sidebar-backdrop"
            className="mobile-sidebar-backdrop"
            aria-label="关闭侧边栏"
            tabIndex={-1}
            hidden
          />

          <Sidebar />
        </div>

        <button
          type="button"
          id="app-menu-backdrop"
          className="app-menu-backdrop"
          aria-label="关闭主菜单"
          tabIndex={-1}
          hidden
        />

        <AppMenu />
      </div>
      <div id="toast" className="toast" />
    </>
  )
}
