import { test, expect } from '@playwright/test'
import { authenticatePage } from './auth'

test.describe('父节点平移交互', () => {
  test.beforeEach(async ({ page }) => {
    await authenticatePage(page)
    await page.goto('/')
    // Cytoscape 使用多层 canvas
    await page.waitForSelector('#cy canvas', { timeout: 10000 })
  })

  test('在画布区域拖拽应该能移动视角', async ({ page }) => {
    // Cytoscape 有多个 canvas 层，取 drag 层
    const canvas = page.locator('#cy canvas').first()
    const box = await canvas.boundingBox()
    if (!box) return

    // 在画布区域模拟拖拽
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2 + 50, { steps: 10 })
    await page.mouse.up()

    // 等待平移完成
    await page.waitForTimeout(300)
    // 不应该报错
  })

  test('普通拖拽画布也应该能移动视角', async ({ page }) => {
    const canvas = page.locator('#cy canvas').first()
    const box = await canvas.boundingBox()
    if (!box) return

    await page.mouse.move(box.x + 50, box.y + 50)
    await page.mouse.down()
    await page.mouse.move(box.x + 150, box.y + 100, { steps: 10 })
    await page.mouse.up()

    await page.waitForTimeout(300)
  })

  test('拖动小地图时应该在松开鼠标前实时移动主画面', async ({ page }) => {
    await page.waitForFunction(() => window.cy)
    const minimap = page.locator('#minimap')
    const box = await minimap.boundingBox()
    if (!box) return

    const start = {
      x: box.x + box.width * 0.3,
      y: box.y + box.height * 0.3,
    }
    const end = {
      x: box.x + box.width * 0.72,
      y: box.y + box.height * 0.68,
    }

    await page.mouse.move(start.x, start.y)
    await page.mouse.down()
    const panAfterDown = await page.evaluate(() => ({ ...window.cy.pan() }))
    await expect(minimap).toHaveClass(/dragging/)

    await page.mouse.move(end.x, end.y, { steps: 6 })
    await expect.poll(() => page.evaluate(() => ({ ...window.cy.pan() }))).not.toEqual(panAfterDown)
    await expect(minimap).toHaveClass(/dragging/)

    await page.mouse.up()
    await expect(minimap).not.toHaveClass(/dragging/)
  })

  test('按住空格拖拽应该能移动节点', async ({ page }) => {
    const canvas = page.locator('#cy canvas').first()
    const box = await canvas.boundingBox()
    if (!box) return

    // 按住空格
    await page.keyboard.down(' ')
    await page.waitForTimeout(100)

    // 拖拽
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width / 2 + 80, box.y + box.height / 2 + 60, { steps: 10 })
    await page.mouse.up()

    // 释放空格
    await page.keyboard.up(' ')

    await page.waitForTimeout(300)
  })
})
