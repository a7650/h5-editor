import { type } from 'os'

export type WidgetType = 'image' | 'text' | 'rect' | 'form' | 'background'

export interface PageConfig {
  config: string
  background?: {
    type: 'background'
    config?: string
    content?: string
  }
  items: Array<{
    type: WidgetType
    config?: string
    content?: string
  }>
}
