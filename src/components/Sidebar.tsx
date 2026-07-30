function ViewPanel() {
  return (
    <div id="panel-view" className="tab-panel active" role="tabpanel">
      <div id="advanced-view-section">
        <h3 className="sidebar-panel-heading">高级视图设置</h3>
        <div className="layout-field focus-depth-wrap" id="focus-depth-wrap" style={{ marginTop: 8 }}>
          <label id="focus-depth-label">展开深度 <span id="val-focus-depth">1</span> 跳</label>
          <input type="range" id="focus-depth" min="1" max="5" step="1" defaultValue="1" />
        </div>
        <div id="focus-center-wrap" className="focus-center-wrap">
          <div className="focus-center-row">
            <div className="focus-center-info">
              <span id="focus-center-label" className="focus-center-label">当前中心</span>
              <strong id="val-focus-node" className="focus-center-name" title="使用“设为中心”可主动切换中心">—</strong>
            </div>
            <div className="focus-center-actions">
              <button type="button" className="btn btn-sm" id="btn-set-focus">设为中心</button>
              <button type="button" className="btn btn-sm focus-reset-btn" id="btn-reset-focus">恢复默认</button>
            </div>
          </div>
        </div>
      </div>

      <div id="relation-filter-section">
        <h3 className="section-title">关系筛选</h3>
        <div id="category-filters" className="filter-grid" />
      </div>

      <h3 className="section-title">显示选项</h3>
      <label className="check-row"><input type="checkbox" id="opt-edge-labels" /> 显示连线文字</label>
      <label className="check-row touch-hover-option"><input type="checkbox" id="opt-hover" defaultChecked /> Hover 高亮相邻</label>
      <label className="check-row"><input type="checkbox" id="opt-night-mode" /> 夜晚模式</label>

      <div id="timeline-section">
        <h3 className="section-title">时间轴</h3>
        <label className="check-row"><input type="checkbox" id="opt-timeline" /> 按时间/章节过滤</label>
        <div id="timeline-wrap" className="timeline-wrap hidden">
          <div className="chapter-stepper-row">
            <span className="timeline-label">截至第</span>
            <div className="chapter-stepper">
              <button type="button" id="timeline-dec" className="btn-icon stepper-btn" aria-label="上一回">−</button>
              <input type="number" id="timeline-input" className="chapter-input" min="1" max="120" step="1" defaultValue="1" inputMode="numeric" />
              <button type="button" id="timeline-inc" className="btn-icon stepper-btn" aria-label="下一回">+</button>
            </div>
            <span className="timeline-unit">回</span>
          </div>
          <p className="hint">节点/边可设置 chapter、time 或 appearAt 字段</p>
        </div>
      </div>

      <h3 className="section-title">聚合</h3>
      <p className="hint">节点可设置 tags 数组，同标签可折叠为一组</p>
      <div id="aggregate-actions" className="aggregate-actions" />

      <div id="network-layout-section">
        <h3 className="section-title">布局</h3>
        <div className="layout-section compact">
          <div className="layout-field">
            <label>斥力 <span id="val-repulsion">8000</span></label>
            <input type="range" id="layout-repulsion" min="1000" max="30000" step="500" defaultValue="8000" />
          </div>
          <div className="layout-field">
            <label>边长 <span id="val-edge-length">160</span></label>
            <input type="range" id="layout-edge-length" min="50" max="500" step="10" defaultValue="160" />
          </div>
          <button className="btn btn-block primary" id="btn-apply-layout">应用并重新布局</button>
        </div>
      </div>
      <div id="mindmap-layout-section" className="hidden">
        <h3 className="section-title">思维导图布局</h3>
        <p className="hint">中心主题固定，一级主题稳定分布在左右两侧。</p>
        <button className="btn btn-block primary" id="btn-mindmap-layout">重新整理分支</button>
      </div>
    </div>
  )
}

function TreePanel() {
  return (
    <div id="panel-tree" className="tab-panel" role="tabpanel">
      <h3>节点树</h3>
      <div id="tree-toolbar" className="tree-toolbar">
        <button className="btn btn-icon btn-sm" id="btn-tree-toggle" title="展开/收起全部">⊟</button>
        <input type="text" id="tree-search-input" placeholder="搜索节点..." />
      </div>
      <div id="tree-view" className="tree-view" />
    </div>
  )
}

function MobileDetailPanel() {
  return (
    <div id="panel-detail" className="tab-panel mobile-detail-panel" role="tabpanel">
      <h3>节点详情</h3>
      <div id="mobile-detail-host" className="mobile-detail-host" />
    </div>
  )
}

export function Sidebar() {
  return (
    <aside id="sidebar" className="sidebar-nav" aria-label="图谱侧边栏" data-ui-chrome="">
      <div className="mobile-drawer-header">
        <strong>侧边栏</strong>
        <button type="button" className="btn btn-icon" id="btn-sidebar-close" aria-label="关闭侧边栏">×</button>
      </div>

      <div className="tabs" role="tablist" aria-label="侧边栏功能">
        <button className="tab active" data-tab="view" role="tab" aria-controls="panel-view" aria-selected={true}>视图</button>
        <button className="tab" data-tab="tree" role="tab" aria-controls="panel-tree" aria-selected={false}>节点</button>
        <button className="tab mobile-detail-tab" data-tab="detail" role="tab" aria-controls="panel-detail" aria-selected={false}>详情</button>
      </div>

      <ViewPanel />
      <TreePanel />
      <MobileDetailPanel />
    </aside>
  )
}
