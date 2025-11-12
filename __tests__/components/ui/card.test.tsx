import React from 'react'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

describe('Card Component', () => {
  describe('Card', () => {
    it('should render card with children', () => {
      render(<Card>Card content</Card>)
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('should have default styling classes', () => {
      const { container } = render(<Card>Test</Card>)
      const card = container.firstChild as HTMLElement

      expect(card).toHaveClass('rounded-lg')
      expect(card).toHaveClass('border')
      expect(card).toHaveClass('shadow-sm')
    })

    it('should accept custom className', () => {
      const { container } = render(<Card className="custom-card">Test</Card>)
      const card = container.firstChild as HTMLElement

      expect(card).toHaveClass('custom-card')
    })

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Card ref={ref}>With Ref</Card>)

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current?.textContent).toBe('With Ref')
    })

    it('should accept HTML div attributes', () => {
      render(<Card data-testid="test-card" id="card-1">Test</Card>)
      const card = screen.getByTestId('test-card')

      expect(card).toHaveAttribute('id', 'card-1')
    })
  })

  describe('CardHeader', () => {
    it('should render card header with children', () => {
      render(<CardHeader>Header content</CardHeader>)
      expect(screen.getByText('Header content')).toBeInTheDocument()
    })

    it('should have default styling classes', () => {
      const { container } = render(<CardHeader>Test</CardHeader>)
      const header = container.firstChild as HTMLElement

      expect(header).toHaveClass('p-6')
      expect(header).toHaveClass('space-y-1.5')
    })

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CardHeader ref={ref}>Header</CardHeader>)

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('CardTitle', () => {
    it('should render card title as h2', () => {
      render(<CardTitle>Card Title</CardTitle>)
      const title = screen.getByRole('heading', { level: 2 })

      expect(title).toBeInTheDocument()
      expect(title).toHaveTextContent('Card Title')
    })

    it('should have default styling classes', () => {
      render(<CardTitle>Title</CardTitle>)
      const title = screen.getByRole('heading')

      expect(title).toHaveClass('text-2xl')
      expect(title).toHaveClass('font-semibold')
    })

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLParagraphElement>()
      render(<CardTitle ref={ref}>Title</CardTitle>)

      expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
    })
  })

  describe('CardDescription', () => {
    it('should render card description as paragraph', () => {
      render(<CardDescription>This is a description</CardDescription>)
      const description = screen.getByText('This is a description')

      expect(description.tagName).toBe('P')
    })

    it('should have default styling classes', () => {
      const { container } = render(<CardDescription>Description</CardDescription>)
      const description = container.firstChild as HTMLElement

      expect(description).toHaveClass('text-sm')
      expect(description).toHaveClass('text-muted')
    })

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLParagraphElement>()
      render(<CardDescription ref={ref}>Description</CardDescription>)

      expect(ref.current).toBeInstanceOf(HTMLParagraphElement)
    })
  })

  describe('CardContent', () => {
    it('should render card content with children', () => {
      render(<CardContent>Main content</CardContent>)
      expect(screen.getByText('Main content')).toBeInTheDocument()
    })

    it('should have default styling classes', () => {
      const { container } = render(<CardContent>Content</CardContent>)
      const content = container.firstChild as HTMLElement

      expect(content).toHaveClass('p-6')
      expect(content).toHaveClass('pt-0')
    })

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CardContent ref={ref}>Content</CardContent>)

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('Card Composition', () => {
    it('should render complete card with all subcomponents', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card Title</CardTitle>
            <CardDescription>Test card description</CardDescription>
          </CardHeader>
          <CardContent>Test card content</CardContent>
        </Card>
      )

      expect(screen.getByRole('heading', { name: 'Test Card Title' })).toBeInTheDocument()
      expect(screen.getByText('Test card description')).toBeInTheDocument()
      expect(screen.getByText('Test card content')).toBeInTheDocument()
    })

    it('should maintain proper hierarchy', () => {
      const { container } = render(
        <Card data-testid="card">
          <CardHeader data-testid="header">
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent data-testid="content">Content</CardContent>
        </Card>
      )

      const card = screen.getByTestId('card')
      const header = screen.getByTestId('header')
      const content = screen.getByTestId('content')

      expect(card).toContainElement(header)
      expect(card).toContainElement(content)
    })

    it('should accept custom classes on all components', () => {
      const { container } = render(
        <Card className="card-custom">
          <CardHeader className="header-custom">
            <CardTitle className="title-custom">Title</CardTitle>
            <CardDescription className="desc-custom">Desc</CardDescription>
          </CardHeader>
          <CardContent className="content-custom">Content</CardContent>
        </Card>
      )

      expect(container.querySelector('.card-custom')).toBeInTheDocument()
      expect(container.querySelector('.header-custom')).toBeInTheDocument()
      expect(container.querySelector('.title-custom')).toBeInTheDocument()
      expect(container.querySelector('.desc-custom')).toBeInTheDocument()
      expect(container.querySelector('.content-custom')).toBeInTheDocument()
    })
  })
})
