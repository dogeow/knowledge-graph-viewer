export function Toolbar() {
  return (
    <header id="app-toolbar" className="app-toolbar" data-ui-chrome="">
      <button
        type="button"
        className="btn btn-icon app-menu-button"
        id="btn-app-menu"
        aria-label="打开主菜单"
        aria-controls="app-menu"
        aria-expanded={false}
      >
        ☰
      </button>
      <div className="toolbar-search-control">
        <input
          type="text"
          id="search-input"
          data-graph-search=""
          placeholder="搜索节点 / 关系"
          aria-label="搜索节点或关系"
          autoComplete="off"
        />
        <button
          type="button"
          className="toolbar-search-clear"
          id="btn-clear-search"
          data-clear-search=""
          aria-label="清除搜索"
          hidden
        >
          ×
        </button>
      </div>
      <select id="view-mode-select" className="toolbar-view-mode" aria-label="视图模式" defaultValue="focus">
        <option value="focus">中心展开</option>
        <option value="expand">渐进展开</option>
        <option value="full">显示全部</option>
      </select>
      <button
        type="button"
        className="btn btn-icon sidebar-toggle-button"
        id="btn-sidebar-toggle"
        aria-label="切换侧边栏"
        aria-controls="sidebar"
        aria-expanded={true}
      >
        ☷
      </button>
    </header>
  )
}
