import { initStore } from '../store.js'
import { GraphManager } from '../graph.js'
import { SidebarPanel } from '../ui.js'
import { InlineEditor } from '../editor.js'
import { ViewManager } from '../view/viewManager.js'
import { DetailPanel } from '../view/detailPanel.js'
import { getTheme } from '../theme.js'
import { initAuthUi, requireSso } from '../auth.js'
import { GraphSyncService } from './GraphSyncService.js'

const initialTheme = getTheme()

export class KnowledgeGraphApplication {
  constructor() {
    this.store = initStore()
    this.syncService = new GraphSyncService(this.store, {
      onCatalogChange: () => this._updateGraphSelector(),
    })
  }

  async init() {
    const user = await requireSso()
    if (!user) return
    initAuthUi(user)

    const cyContainer = document.getElementById('cy')
    this.graph = new GraphManager(cyContainer, {
      onSelect: (selection) => this.ui?.onSelect(selection),
      onPreviewSelect: (selection) => this.ui?.onPreviewSelect(selection),
      onActivate: (selection) => this.ui?.onActivate(selection),
      themeMode: initialTheme,
    })
    window.cy = this.graph.cy

    this.viewManager = new ViewManager(this.store, this.graph)
    this.detailPanel = new DetailPanel(
      document.getElementById('detail-content'),
      this.viewManager,
      (nodeId) => window.kgStore?.selectAndFocus(nodeId)
    )
    this.detailPanel.renderEmpty()

    this.editor = new InlineEditor(this.store, this.graph)
    this.editor.onNodeCreated = (nodeId, parentId) => {
      this.viewManager.revealCreatedNode(nodeId, parentId)
    }

    this.ui = new SidebarPanel(this.store, this.graph, this.editor, this.viewManager, this.detailPanel)

    this.store.subscribe((snapshot, change = {}) => {
      this.editor.onStoreUpdate()
      this._updateGraphSelector()
      this.viewManager.applyView()
      if (!change.transient) {
        this.syncService.scheduleSave(snapshot.currentGraphId, snapshot)
      }
    })

    try {
      await this.syncService.loadGraphs()
    } catch {
      // API 不可用，继续使用 localStorage
    }
    this.viewManager.init()
    this.ui._syncViewControls()
    this.ui.syncInitialSelection()

    this._initGraphSelector()
    this._updateGraphSelector()
  }

  _initGraphSelector() {
    const graphSelect = document.getElementById('graph-select')
    graphSelect?.addEventListener('change', (e) => {
      const id = e.target.value
      if (id && window.kgStore) window.kgStore.switchGraph(id)
    })

    document.getElementById('btn-new-graph')?.addEventListener('click', async () => {
      if (window.kgStore) await window.kgStore.createGraph()
    })

    document.getElementById('btn-delete-graph')?.addEventListener('click', async () => {
      if (window.kgStore) await window.kgStore.deleteGraph(this.store.getCurrentGraphId())
    })

    window.kgStore = {
      getGraphs: () => this.store.getGraphs(),
      getCurrentGraphId: () => this.store.getCurrentGraphId(),
      switchGraph: (id) => {
        if (!this.editor.resolveCurrentEdit?.()) {
          this._updateGraphSelector()
          return
        }
        const previousId = this.store.getCurrentGraphId()
        if (id !== previousId) this.syncService.saveNow(previousId)
        this.store.switchGraph(id)
        this.viewManager.loadForGraph(id)
        this.editor.deselect()
        this.viewManager.applyView({ layout: true })
        this._updateGraphSelector()
        this.ui.syncInitialSelection()
        this.ui.closeAppMenuToCanvas()
      },
      createGraph: async () => {
        if (!this.editor.resolveCurrentEdit?.()) return
        const previousId = this.store.getCurrentGraphId()
        const name = prompt('新图谱名称：', '新图谱')
        if (!name) return
        this.syncService.saveNow(previousId)
        this.store.createGraph(name, '')
        this.viewManager.resetForGraph(this.store.getCurrentGraphId())
        await this.syncService.saveNow(this.store.getCurrentGraphId())
        this._updateGraphSelector()
        this.viewManager.applyView({ layout: true })
        this.editor.deselect()
        this._updateGraphSelector()
        this.ui.syncInitialSelection()
        this.ui.closeAppMenuToCanvas()
      },
      deleteGraph: async (id) => {
        if (!this.editor.resolveCurrentEdit?.()) return
        const nodes = this.store.getAllNodes()
        const onlyCenterNode = nodes.length === 1 && this.store.isRootNode(nodes[0].id)
        if (!onlyCenterNode && !confirm('确定删除这个图谱吗？')) return
        const graphId = String(id)
        try {
          await this.syncService.deleteGraph(graphId)
        } catch (error) {
          SidebarPanel.showToast(error?.message || '删除图谱失败，请稍后重试', true)
          this._updateGraphSelector()
          return
        }

        this.store.deleteGraph(graphId)
        this.viewManager.loadForGraph(this.store.getCurrentGraphId())
        this.viewManager.applyView({ layout: true })
        this.editor.deselect()
        this._updateGraphSelector()
        this.ui.syncInitialSelection()
        this.ui.closeAppMenuToCanvas()
      },
      refreshList: async () => {
        try {
          await this.syncService.loadGraphs()
        } catch {
          // 保留当前本地数据
        }
        this._updateGraphSelector()
      },
      selectAndFocus: (nodeId) => {
        this.ui.onSelect({ type: 'node', id: nodeId })
        this.graph.focusNode(nodeId)
      },
      editNode: (nodeId) => {
        this.ui.onActivate({ type: 'node', id: nodeId })
      },
      deleteNode: (nodeId) => {
        this.editor.deleteNodeById(nodeId)
      },
    }
  }

  _updateGraphSelector() {
    const select = document.getElementById('graph-select')
    if (!select) return
    const graphs = this.store.getGraphs()
    const currentId = this.store.getCurrentGraphId()
    select.innerHTML = graphs
      .map(
        (g) =>
          `<option value="${g.id}" ${g.id === currentId ? 'selected' : ''}>${SidebarPanel.escapeHtml(g.name || '未命名')}</option>`
      )
      .join('')

    const btnDelete = document.getElementById('btn-delete-graph')
    if (btnDelete) btnDelete.disabled = graphs.length <= 1
  }
}

export function bootstrapApplication() {
  const application = new KnowledgeGraphApplication()
  void application.init()
  return application
}
