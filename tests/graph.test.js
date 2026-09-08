import { describe, expect, it } from 'vitest'
import { getMinimapNodeRadius } from '../src/graph.js'

describe('minimap node radius', () => {
  it('密集图中的普通节点应该明显缩小', () => {
    expect(getMinimapNodeRadius(100)).toBe(1.25)
    expect(getMinimapNodeRadius(60)).toBe(1.5)
    expect(getMinimapNodeRadius(30)).toBe(1.75)
  })

  it('少量节点保持可见且高亮节点更醒目', () => {
    expect(getMinimapNodeRadius(10)).toBe(2)
    expect(getMinimapNodeRadius(100, true)).toBe(2.15)
    expect(getMinimapNodeRadius(10, true)).toBe(2.5)
  })
})
