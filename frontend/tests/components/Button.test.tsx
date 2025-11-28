import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../utils/testUtils'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('应该正确渲染按钮', () => {
    render(<Button>测试按钮</Button>)
    expect(screen.getByText('测试按钮')).toBeInTheDocument()
  })

  it('应该处理点击事件', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>点击我</Button>)
    
    const button = screen.getByText('点击我')
    button.click()
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('应该支持禁用状态', () => {
    render(<Button disabled>禁用按钮</Button>)
    const button = screen.getByText('禁用按钮')
    expect(button).toBeDisabled()
  })

  it('应该支持不同的变体', () => {
    const { rerender } = render(<Button variant="default">默认</Button>)
    expect(screen.getByText('默认')).toBeInTheDocument()

    rerender(<Button variant="destructive">危险</Button>)
    expect(screen.getByText('危险')).toBeInTheDocument()
  })
})

