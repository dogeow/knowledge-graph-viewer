import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { initTheme } from './theme.js'
import './styles.css'

initTheme()

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('应用挂载容器 #root 不存在')
}

createRoot(rootElement).render(<App />)
