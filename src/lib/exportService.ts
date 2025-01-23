import pptxgen from 'pptxgenjs'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { ChartConfiguration } from 'chart.js'
import { ReportComponent } from '@/types/report'

interface ExportOptions {
  title: string;
  subtitle?: string;
  author?: string;
  date?: string;
  companyLogo?: string;
  theme?: 'light' | 'dark';
}

const defaultOptions: ExportOptions = {
  title: 'Market Research Report',
  subtitle: 'Comprehensive Market Analysis',
  author: 'AI Market Research System',
  date: new Date().toLocaleDateString(),
  theme: 'light'
}

// Color schemes for professional presentations
const colorSchemes = {
  light: {
    primary: '#1E40AF', // Deep blue
    secondary: '#059669', // Emerald
    accent: '#D97706', // Amber
    text: '#1F2937', // Gray-800
    background: '#FFFFFF',
    charts: [
      'rgba(59, 130, 246, 0.7)',
      'rgba(16, 185, 129, 0.7)',
      'rgba(249, 115, 22, 0.7)',
      'rgba(139, 92, 246, 0.7)',
      'rgba(236, 72, 153, 0.7)'
    ]
  },
  dark: {
    primary: '#60A5FA', // Light blue
    secondary: '#34D399', // Light emerald
    accent: '#FBBF24', // Light amber
    text: '#F9FAFB', // Gray-50
    background: '#111827',
    charts: [
      'rgba(96, 165, 250, 0.7)',
      'rgba(52, 211, 153, 0.7)',
      'rgba(251, 191, 36, 0.7)',
      'rgba(167, 139, 250, 0.7)',
      'rgba(244, 114, 182, 0.7)'
    ]
  }
}

class ExportService {
  private pptx: any;
  private pdf: any;
  private options: ExportOptions;
  private colorScheme: typeof colorSchemes.light;

  constructor(options: Partial<ExportOptions> = {}) {
    this.options = { ...defaultOptions, ...options }
    this.colorScheme = colorSchemes[this.options.theme || 'light']
  }

  private createTitleSlide() {
    const slide = this.pptx.addSlide()

    // Add company logo if provided
    if (this.options.companyLogo) {
      slide.addImage({ path: this.options.companyLogo, x: 0.5, y: 0.5, w: 1, h: 1 })
    }

    // Add title
    slide.addText(this.options.title, {
      x: 0.5,
      y: 2,
      w: '90%',
      h: 1,
      fontSize: 44,
      color: this.colorScheme.primary,
      bold: true,
      align: 'center'
    })

    // Add subtitle
    if (this.options.subtitle) {
      slide.addText(this.options.subtitle, {
        x: 0.5,
        y: 3.2,
        w: '90%',
        h: 0.5,
        fontSize: 24,
        color: this.colorScheme.secondary,
        align: 'center'
      })
    }

    // Add date and author
    slide.addText([
      { text: this.options.date + '\n', options: { fontSize: 14, color: this.colorScheme.text } },
      { text: this.options.author, options: { fontSize: 14, color: this.colorScheme.text } }
    ], {
      x: 0.5,
      y: 5,
      w: '90%',
      h: 0.5,
      align: 'center'
    })
  }

  private createExecutiveSummarySlide(content: string) {
    const slide = this.pptx.addSlide()

    slide.addText('Executive Summary', {
      x: 0.5,
      y: 0.5,
      w: '90%',
      h: 0.5,
      fontSize: 32,
      color: this.colorScheme.primary,
      bold: true
    })

    // Format and add the summary content
    const paragraphs = content.split('\n').filter(p => p.trim())
    slide.addText(paragraphs, {
      x: 0.5,
      y: 1.2,
      w: '90%',
      h: 4,
      fontSize: 16,
      color: this.colorScheme.text,
      bullet: true
    })
  }

  private createChartSlide(component: ReportComponent) {
    if (component.type !== 'chart' || typeof component.content === 'string') return

    const slide = this.pptx.addSlide()

    // Add section title
    slide.addText(component.title, {
      x: 0.5,
      y: 0.5,
      w: '90%',
      h: 0.5,
      fontSize: 28,
      color: this.colorScheme.primary,
      bold: true
    })

    // Convert Chart.js configuration to pptxgenjs format
    const chartData = {
      labels: component.content.data.labels,
      datasets: component.content.data.datasets.map(ds => ({
        name: ds.label,
        values: ds.data,
        fill: ds.backgroundColor
      }))
    }

    // Add chart based on type
    switch (component.content.type) {
      case 'line':
        slide.addChart(this.pptx.ChartType.line, chartData, {
          x: 0.5,
          y: 1.2,
          w: '90%',
          h: 4,
          showLegend: true,
          legendPos: 't'
        })
        break
      case 'bar':
        slide.addChart(this.pptx.ChartType.bar, chartData, {
          x: 0.5,
          y: 1.2,
          w: '90%',
          h: 4,
          showLegend: true,
          legendPos: 't'
        })
        break
      case 'pie':
        slide.addChart(this.pptx.ChartType.pie, chartData, {
          x: 0.5,
          y: 1.2,
          w: '90%',
          h: 4,
          showLegend: true,
          legendPos: 'r'
        })
        break
    }
  }

  private createTableSlide(component: ReportComponent) {
    if (component.type !== 'table' || typeof component.content === 'string') return

    const slide = this.pptx.addSlide()

    // Add section title
    slide.addText(component.title, {
      x: 0.5,
      y: 0.5,
      w: '90%',
      h: 0.5,
      fontSize: 28,
      color: this.colorScheme.primary,
      bold: true
    })

    // Format table data for pptxgenjs
    const tableData = {
      x: 0.5,
      y: 1.2,
      w: '90%',
      colW: Array(component.content.headers.length).fill(2),
      color: this.colorScheme.text,
      fontSize: 14,
      border: { pt: 1, color: this.colorScheme.secondary },
      rows: [
        // Header row
        [
          ...component.content.headers.map(header => ({
            text: header,
            options: {
              bold: true,
              fill: this.colorScheme.primary,
              color: '#FFFFFF'
            }
          }))
        ],
        // Data rows
        ...component.content.rows.map(row =>
          component.content.headers.map(header => ({
            text: row[header],
            options: { align: 'left' }
          }))
        )
      ]
    }

    slide.addTable(tableData)
  }

  async exportToPPT(components: ReportComponent[]) {
    this.pptx = new pptxgen()

    // Set presentation properties
    this.pptx.layout = 'LAYOUT_16x9'
    this.pptx.company = this.options.author
    this.pptx.title = this.options.title

    // Create slides
    this.createTitleSlide()

    // Create executive summary if available
    const summaryComponent = components.find(c => c.type === 'text' && c.title.toLowerCase().includes('summary'))
    if (summaryComponent && typeof summaryComponent.content === 'string') {
      this.createExecutiveSummarySlide(summaryComponent.content)
    }

    // Create content slides
    components.forEach(component => {
      if (component.type === 'chart') {
        this.createChartSlide(component)
      } else if (component.type === 'table') {
        this.createTableSlide(component)
      }
    })

    // Save the presentation
    await this.pptx.writeFile(`${this.options.title.replace(/\s+/g, '_')}.pptx`)
  }

  async exportToPDF(components: ReportComponent[]) {
    this.pdf = new jsPDF()
    
    // Add title page
    this.pdf.setFontSize(24)
    this.pdf.setTextColor(this.colorScheme.primary)
    this.pdf.text(this.options.title, 20, 30, { align: 'center' })

    if (this.options.subtitle) {
      this.pdf.setFontSize(16)
      this.pdf.setTextColor(this.colorScheme.secondary)
      this.pdf.text(this.options.subtitle, 20, 45, { align: 'center' })
    }

    this.pdf.setFontSize(12)
    this.pdf.setTextColor(this.colorScheme.text)
    this.pdf.text([this.options.date || '', this.options.author || ''], 20, 60, { align: 'center' })

    let yPosition = 80

    // Add content
    components.forEach(component => {
      if (yPosition > 250) {
        this.pdf.addPage()
        yPosition = 20
      }

      this.pdf.setFontSize(16)
      this.pdf.setTextColor(this.colorScheme.primary)
      this.pdf.text(component.title, 20, yPosition)
      yPosition += 15

      if (component.type === 'text' && typeof component.content === 'string') {
        this.pdf.setFontSize(12)
        this.pdf.setTextColor(this.colorScheme.text)
        const lines = this.pdf.splitTextToSize(component.content, 170)
        this.pdf.text(lines, 20, yPosition)
        yPosition += 10 * lines.length
      }

      // Add charts and tables as images
      if (component.type === 'chart' || component.type === 'table') {
        // Implementation for adding charts and tables as images
        yPosition += 100
      }
    })

    // Save the PDF
    this.pdf.save(`${this.options.title.replace(/\s+/g, '_')}.pdf`)
  }
}

export const createExportService = (options?: Partial<ExportOptions>) => {
  return new ExportService(options) 