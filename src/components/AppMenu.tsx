const shortcuts = [
  ['移动视角', '拖拽画布'],
  ['拖拽节点', <><kbd>Space</kbd> + 拖拽</>],
  ['选择节点/连线', '单击'],
  ['切换中心', '选择节点后点“设为中心”'],
  ['渐进展开', '选择该模式后单击节点'],
  ['移动已有节点', '选中后点“移动到…”'],
  ['关联节点', <><kbd>Shift</kbd>+点击 / <kbd>L</kbd></>],
  ['编辑节点/连线', <><kbd>Enter</kbd> / <kbd>F2</kbd> / 双击</>],
  ['创建子节点', <kbd>Tab</kbd>],
  ['编辑中创建同级', <kbd>Enter</kbd>],
  ['删除所选', <kbd>Del</kbd>],
  ['撤销', <kbd>⌘Z</kbd>],
]

export function AppMenu() {
  return (
    <aside id="app-menu" className="app-menu" aria-label="主菜单" aria-hidden="true" inert data-ui-chrome="">
      <div className="app-menu-header">
        <strong>菜单</strong>
        <button type="button" className="btn btn-icon" id="btn-app-menu-close" aria-label="关闭主菜单">×</button>
      </div>

      <div className="app-menu-content">
        <section className="menu-section menu-graph-section" aria-labelledby="menu-graph-heading">
          <h2 id="menu-graph-heading">图谱管理</h2>
          <div className="graph-selector">
            <select id="graph-select" title="选择图谱" aria-label="选择图谱" />
            <div className="graph-selector-actions">
              <button className="btn btn-icon" id="btn-new-graph" title="新建图谱" aria-label="新建图谱">+</button>
              <button className="btn btn-icon danger-icon" id="btn-delete-graph" title="删除图谱" aria-label="删除图谱">×</button>
            </div>
          </div>
        </section>

        <details className="menu-disclosure" id="menu-data">
          <summary>数据</summary>
          <div id="panel-data" className="menu-disclosure-content">
            <p className="hint">数据保存在 localStorage</p>
            <button className="btn btn-block" id="btn-export">导出 JSON</button>
            <button className="btn btn-block" id="btn-import">导入 JSON</button>
            <input type="file" id="file-import" accept=".json" />
            <button className="btn btn-block" id="btn-layout">重新布局</button>
            <button className="btn danger btn-block" id="btn-cleanup-placeholders" hidden>清理未完成节点</button>
            <button className="btn danger btn-block" id="btn-reset">恢复默认示例</button>
          </div>
        </details>

        <details className="menu-disclosure menu-shortcuts" id="menu-shortcuts">
          <summary>快捷键</summary>
          <div id="panel-keys" className="menu-disclosure-content">
            <ul className="shortcut-list">
              {shortcuts.map(([description, keys]) => (
                <li key={description as string}>
                  <span className="shortcut-desc">{description}</span>
                  <span className="shortcut-keys">{keys}</span>
                </li>
              ))}
            </ul>
          </div>
        </details>
      </div>

      <div className="account-bar">
        <span id="auth-user-name" className="account-name" />
        <button type="button" className="btn btn-sm" id="btn-logout">退出</button>
      </div>
    </aside>
  )
}
