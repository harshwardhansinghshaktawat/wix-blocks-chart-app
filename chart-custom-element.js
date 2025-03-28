/**
 * Wix Chart Builder Custom Element
 * Custom element tag name: wix-chart-builder
 * 
 * A powerful chart builder for Wix sites using Chart.js
 * Allows creation of various line chart types with extensive customization options
 */

// Define the custom element
class WixChartBuilder extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Chart instance
    this.chartInstance = null;
    
    // Chart configuration
    this.chartConfig = {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
          label: 'Dataset 1',
          data: [65, 59, 80, 81, 56, 55],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Your Chart Title'
          },
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            enabled: true
          }
        },
        scales: {
          y: {
            display: true,
            title: {
              display: true,
              text: 'Value'
            }
          },
          x: {
            display: true,
            title: {
              display: true,
              text: 'Month'
            }
          }
        }
      }
    };
    
    // Editor state
    this.editorVisible = true;
    this.activeTab = 'data';
    
    // Properties
    this.fonts = [
      'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 
      'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Tahoma', 'Trebuchet MS'
    ];
    
    this.chartTypes = [
      { value: 'basic', label: 'Basic Line Chart' },
      { value: 'multi-axis', label: 'Multi-Axis Line Chart' },
      { value: 'stepped', label: 'Stepped Line Chart' },
      { value: 'interpolated', label: 'Interpolated Line Chart' },
      { value: 'points', label: 'Line Chart with Points' },
      { value: 'filled', label: 'Filled Line Chart' }
    ];
    
    this.lineStyles = [
      { value: 'solid', label: 'Solid' },
      { value: 'dashed', label: 'Dashed' },
      { value: 'dotted', label: 'Dotted' }
    ];
    
    this.fillStyles = [
      { value: 'false', label: 'No Fill' },
      { value: 'origin', label: 'Fill to Origin' },
      { value: 'start', label: 'Fill to Start' },
      { value: 'end', label: 'Fill to End' }
    ];
    
    this.pointStyles = [
      { value: 'circle', label: 'Circle' },
      { value: 'cross', label: 'Cross' },
      { value: 'crossRot', label: 'Cross (Rotated)' },
      { value: 'dash', label: 'Dash' },
      { value: 'line', label: 'Line' },
      { value: 'rect', label: 'Rectangle' },
      { value: 'rectRounded', label: 'Rectangle (Rounded)' },
      { value: 'rectRot', label: 'Rectangle (Rotated)' },
      { value: 'star', label: 'Star' },
      { value: 'triangle', label: 'Triangle' }
    ];
    
    this.legendPositions = [
      { value: 'top', label: 'Top' },
      { value: 'bottom', label: 'Bottom' },
      { value: 'left', label: 'Left' },
      { value: 'right', label: 'Right' }
    ];
    
    this.colorPalettes = [
      { 
        name: 'Default', 
        colors: ['#4dc9f6', '#f67019', '#f53794', '#537bc4', '#acc236', '#166a8f', '#00a950', '#58595b'] 
      },
      { 
        name: 'Pastel', 
        colors: ['#f1c0e8', '#cfbaf0', '#a3c4f3', '#90dbf4', '#8eecf5', '#98f5e1', '#b9fbc0', '#f1f8b8'] 
      },
      { 
        name: 'Bold', 
        colors: ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93', '#f15bb5', '#00bbf9', '#00f5d4'] 
      },
      { 
        name: 'Monochrome', 
        colors: ['#0466c8', '#0353a4', '#023e7d', '#002855', '#001845', '#001233', '#33415c', '#5c677d'] 
      }
    ];

    this.datasets = [
      {
        label: 'Dataset 1',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: this.colorPalettes[0].colors[0],
        backgroundColor: this.hexToRgba(this.colorPalettes[0].colors[0], 0.2),
        tension: 0.4,
        fill: false,
        borderWidth: 2,
        pointStyle: 'circle',
        pointRadius: 3,
        pointHoverRadius: 5,
        borderDash: []
      }
    ];
    
    this.labels = ['January', 'February', 'March', 'April', 'May', 'June'];
  }
  
  connectedCallback() {
    this.loadChartJsLibrary()
      .then(() => {
        this.render();
        this.setupEventListeners();
        this.renderChart();
      })
      .catch(error => {
        console.error('Failed to load Chart.js:', error);
        this.shadowRoot.innerHTML = `
          <div style="color: red; padding: 20px; text-align: center;">
            Failed to load Chart.js library. Please check your internet connection.
          </div>
        `;
      });
  }
  
  // Load Chart.js from CDN
  loadChartJsLibrary() {
    return new Promise((resolve, reject) => {
      if (window.Chart) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Chart.js'));
      document.head.appendChild(script);
    });
  }
  
  // Render the UI
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          --primary-color: #4361ee;
          --secondary-color: #3a0ca3;
          --accent-color: #7209b7;
          --light-bg: #f8f9fa;
          --dark-bg: #212529;
          --success-color: #4cc9f0;
          --border-radius: 8px;
          --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s ease;
          color: #333;
        }
        
        .container {
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          overflow: hidden;
          transition: var(--transition);
          max-width: 100%;
        }
        
        .editor-container {
          display: ${this.editorVisible ? 'block' : 'none'};
        }
        
        .chart-container {
          position: relative;
          height: 400px;
          padding: 20px;
          background-color: white;
          transition: var(--transition);
        }
        
        .chart-only-container {
          position: relative;
          height: 400px;
          padding: 20px;
          background-color: white;
          box-shadow: var(--shadow);
          border-radius: var(--border-radius);
          display: ${this.editorVisible ? 'none' : 'block'};
        }
        
        .tab-nav {
          display: flex;
          background-color: var(--light-bg);
          border-bottom: 1px solid #dee2e6;
          overflow: hidden;
        }
        
        .tab-button {
          padding: 12px 16px;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: var(--transition);
          position: relative;
          color: #495057;
          font-size: 14px;
          outline: none;
        }
        
        .tab-button:hover {
          background-color: rgba(67, 97, 238, 0.1);
          color: var(--primary-color);
        }
        
        .tab-button.active {
          color: var(--primary-color);
          background-color: white;
        }
        
        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: var(--primary-color);
          border-radius: 3px 3px 0 0;
        }
        
        .tab-content {
          display: none;
          padding: 20px;
        }
        
        .tab-content.active {
          display: block;
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .form-group {
          margin-bottom: 16px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          font-size: 14px;
          color: #495057;
        }
        
        .form-control {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
          transition: var(--transition);
        }
        
        .form-control:focus {
          border-color: var(--primary-color);
          outline: none;
          box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.25);
        }
        
        select.form-control {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23495057' d='M6 8.5l4-4H2z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 30px;
        }
        
        textarea.form-control {
          min-height: 120px;
          resize: vertical;
        }
        
        .btn {
          padding: 10px 16px;
          font-weight: 500;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: var(--transition);
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        .btn svg {
          margin-right: 6px;
        }
        
        .btn-primary {
          background-color: var(--primary-color);
          color: white;
        }
        
        .btn-primary:hover {
          background-color: var(--secondary-color);
        }
        
        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }
        
        .btn-secondary:hover {
          background-color: #5a6268;
        }
        
        .btn-success {
          background-color: var(--success-color);
          color: white;
        }
        
        .btn-success:hover {
          background-color: #3da8c9;
        }
        
        .button-container {
          display: flex;
          gap: 10px;
          margin-top: 20px;
          justify-content: flex-end;
        }
        
        .dataset-container {
          border: 1px solid #dee2e6;
          border-radius: var(--border-radius);
          padding: 16px;
          margin-bottom: 16px;
          background-color: var(--light-bg);
          position: relative;
        }
        
        .dataset-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .dataset-title {
          font-weight: 600;
          font-size: 16px;
          color: var(--secondary-color);
        }
        
        .dataset-actions {
          display: flex;
          gap: 8px;
        }
        
        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #6c757d;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 4px;
        }
        
        .action-btn:hover {
          background-color: rgba(108, 117, 125, 0.1);
          color: #495057;
        }
        
        .color-preview {
          display: inline-block;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1px solid #dee2e6;
          vertical-align: middle;
          margin-right: 8px;
        }
        
        .color-picker-container {
          display: flex;
          align-items: center;
        }
        
        .color-input {
          width: 0;
          height: 0;
          opacity: 0;
          position: absolute;
        }
        
        .palette-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }
        
        .palette-color {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          border: 1px solid #dee2e6;
          transition: var(--transition);
        }
        
        .palette-color:hover {
          transform: scale(1.2);
        }
        
        .layout-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        
        .toggle-container {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .toggle-label {
          margin-left: 8px;
          font-size: 14px;
        }
        
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 20px;
        }
        
        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 34px;
        }
        
        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        
        input:checked + .toggle-slider {
          background-color: var(--primary-color);
        }
        
        input:checked + .toggle-slider:before {
          transform: translateX(20px);
        }
        
        .open-editor-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 10;
          background-color: white;
          border: 1px solid #dee2e6;
          border-radius: var(--border-radius);
          padding: 8px 12px;
          font-size: 14px;
          cursor: pointer;
          box-shadow: var(--shadow);
          transition: var(--transition);
          display: ${this.editorVisible ? 'none' : 'flex'};
          align-items: center;
          gap: 6px;
        }
        
        .open-editor-btn:hover {
          background-color: var(--light-bg);
        }
        
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        
        .info-text {
          font-size: 12px;
          color: #6c757d;
          margin-top: 4px;
        }
        
        @media (max-width: 768px) {
          .layout-container,
          .grid-2 {
            grid-template-columns: 1fr;
          }
        }
        
        /* Preview styles */
        .preview-container {
          padding: 20px;
          text-align: center;
        }
        
        .preview-info {
          margin-bottom: 20px;
          padding: 10px;
          background-color: #e9ecef;
          border-radius: var(--border-radius);
          font-size: 14px;
        }
      </style>
      
      <div class="container">
        <div class="editor-container">
          <div class="tab-nav">
            <button class="tab-button ${this.activeTab === 'data' ? 'active' : ''}" data-tab="data">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
              Chart Data
            </button>
            <button class="tab-button ${this.activeTab === 'options' ? 'active' : ''}" data-tab="options">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              Chart Options
            </button>
            <button class="tab-button ${this.activeTab === 'layout' ? 'active' : ''}" data-tab="layout">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"></path></svg>
              Layout & Colors
            </button>
            <button class="tab-button ${this.activeTab === 'preview' ? 'active' : ''}" data-tab="preview">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              Preview
            </button>
          </div>
          
          <!-- Chart Data Tab -->
          <div class="tab-content ${this.activeTab === 'data' ? 'active' : ''}" id="data-tab">
            <div class="form-group">
              <label for="chart-labels">Chart Labels (comma separated)</label>
              <input type="text" id="chart-labels" class="form-control" value="${this.labels.join(', ')}">
            </div>
            
            <h3>Datasets</h3>
            <div id="datasets-container">
              ${this.renderDatasets()}
            </div>
            
            <button id="add-dataset-btn" class="btn btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add Dataset
            </button>
          </div>
          
          <!-- Chart Options Tab -->
          <div class="tab-content ${this.activeTab === 'options' ? 'active' : ''}" id="options-tab">
            <div class="form-group">
              <label for="chart-type">Chart Type</label>
              <select id="chart-type" class="form-control">
                ${this.chartTypes.map(type => `<option value="${type.value}">${type.label}</option>`).join('')}
              </select>
            </div>
            
            <div class="form-group">
              <label for="chart-title">Chart Title</label>
              <input type="text" id="chart-title" class="form-control" value="${this.chartConfig.options.plugins.title.text}">
            </div>
            
            <div class="layout-container">
              <div class="form-group">
                <label for="x-axis-title">X-Axis Title</label>
                <input type="text" id="x-axis-title" class="form-control" value="${this.chartConfig.options.scales.x.title.text}">
              </div>
              
              <div class="form-group">
                <label for="y-axis-title">Y-Axis Title</label>
                <input type="text" id="y-axis-title" class="form-control" value="${this.chartConfig.options.scales.y.title.text}">
              </div>
            </div>
            
            <div class="toggle-container">
              <label class="toggle-switch">
                <input type="checkbox" id="show-legend" ${this.chartConfig.options.plugins.legend.display ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
              <span class="toggle-label">Show Legend</span>
            </div>
            
            <div class="form-group" id="legend-position-container" style="${this.chartConfig.options.plugins.legend.display ? '' : 'display: none'}">
              <label for="legend-position">Legend Position</label>
              <select id="legend-position" class="form-control">
                ${this.legendPositions.map(pos => `<option value="${pos.value}" ${this.chartConfig.options.plugins.legend.position === pos.value ? 'selected' : ''}>${pos.label}</option>`).join('')}
              </select>
            </div>
            
            <div class="toggle-container">
              <label class="toggle-switch">
                <input type="checkbox" id="enable-animation" checked>
                <span class="toggle-slider"></span>
              </label>
              <span class="toggle-label">Enable Animations</span>
            </div>
            
            <div class="toggle-container">
              <label class="toggle-switch">
                <input type="checkbox" id="enable-tooltips" ${this.chartConfig.options.plugins.tooltip.enabled ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
              <span class="toggle-label">Enable Tooltips</span>
            </div>
            
            <div class="toggle-container">
              <label class="toggle-switch">
                <input type="checkbox" id="maintain-aspect-ratio" ${this.chartConfig.options.maintainAspectRatio ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
              <span class="toggle-label">Maintain Aspect Ratio</span>
            </div>
          </div>
          
          <!-- Layout & Colors Tab -->
          <div class="tab-content ${this.activeTab === 'layout' ? 'active' : ''}" id="layout-tab">
            <div class="form-group">
              <label for="chart-font-family">Chart Font Family</label>
              <select id="chart-font-family" class="form-control">
                ${this.fonts.map(font => `<option value="${font}" style="font-family: ${font}">${font}</option>`).join('')}
              </select>
            </div>
            
            <div class="grid-2">
              <div class="form-group">
                <label for="title-font-size">Title Font Size</label>
                <input type="number" id="title-font-size" class="form-control" value="16" min="10" max="32">
              </div>
              
              <div class="form-group">
                <label for="axis-font-size">Axis Font Size</label>
                <input type="number" id="axis-font-size" class="form-control" value="12" min="8" max="16">
              </div>
            </div>
            
            <div class="form-group">
              <label for="grid-lines">Grid Lines</label>
              <select id="grid-lines" class="form-control">
                <option value="both">Both Axes</option>
                <option value="x">X-Axis Only</option>
                <option value="y">Y-Axis Only</option>
                <option value="none">No Grid Lines</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="chart-background">Chart Background</label>
              <input type="color" id="chart-background" class="form-control" value="#ffffff">
            </div>
            
            <div class="form-group">
              <label>Color Palette</label>
              <div class="palette-container">
                ${this.colorPalettes.map(palette => `
                  <div class="palette-item">
                    <div class="palette-label">${palette.name}</div>
                    <div class="palette-colors">
                      ${palette.colors.map(color => `<span class="palette-color" style="background-color: ${color}" data-color="${color}"></span>`).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="toggle-container">
              <label class="toggle-switch">
                <input type="checkbox" id="enable-rounded-corners" checked>
                <span class="toggle-slider"></span>
              </label>
              <span class="toggle-label">Round Corners</span>
            </div>
            
            <div class="form-group">
              <label for="border-width">Border Width</label>
              <input type="range" id="border-width" class="form-control" min="1" max="10" value="2">
              <div class="info-text">Current value: <span id="border-width-value">2</span>px</div>
            </div>
          </div>
          
          <!-- Preview Tab -->
          <div class="tab-content ${this.activeTab === 'preview' ? 'active' : ''}" id="preview-tab">
            <div class="preview-info">
              This is a preview of your chart. Use the button below to update the chart with your changes.
            </div>
            
            <div class="chart-container">
              <canvas id="chart-preview"></canvas>
            </div>
            
            <div class="button-container">
              <button id="update-chart-btn" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                Update Chart
              </button>
            </div>
          </div>
          
          <div class="button-container">
            <button id="save-chart-btn" class="btn btn-success">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
              Save Chart
            </button>
            <button id="toggle-editor-btn" class="btn btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>
              Hide Editor
            </button>
          </div>
        </div>
        
        <div class="chart-only-container">
          <button id="show-editor-btn" class="open-editor-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
            Edit Chart
          </button>
          <canvas id="chart-display"></canvas>
        </div>
      </div>
    `;
  }
  
  renderDatasets() {
    return this.datasets.map((dataset, index) => `
      <div class="dataset-container" data-index="${index}">
        <div class="dataset-header">
          <div class="dataset-title">Dataset ${index + 1}</div>
          <div class="dataset-actions">
            ${index > 0 ? `
              <button class="action-btn remove-dataset" title="Remove Dataset">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            ` : ''}
          </div>
        </div>
        
        <div class="form-group">
          <label for="dataset-label-${index}">Label</label>
          <input type="text" id="dataset-label-${index}" class="form-control dataset-label" value="${dataset.label}">
        </div>
        
        <div class="form-group">
          <label for="dataset-data-${index}">Data Values (comma separated)</label>
          <input type="text" id="dataset-data-${index}" class="form-control dataset-data" value="${dataset.data.join(', ')}">
        </div>
        
        <div class="grid-2">
          <div class="form-group">
            <label for="dataset-border-color-${index}">Line Color</label>
            <div class="color-picker-container">
              <span class="color-preview" style="background-color: ${dataset.borderColor}"></span>
              <input type="color" id="dataset-border-color-${index}" class="form-control color-input dataset-border-color" value="${dataset.borderColor}">
              <button class="btn btn-secondary">Choose Color</button>
            </div>
          </div>
          
          <div class="form-group">
            <label for="dataset-bg-color-${index}">Fill Color</label>
            <div class="color-picker-container">
              <span class="color-preview" style="background-color: ${dataset.backgroundColor}"></span>
              <input type="color" id="dataset-bg-color-${index}" class="form-control color-input dataset-bg-color" value="${this.rgbaToHex(dataset.backgroundColor)}">
              <button class="btn btn-secondary">Choose Color</button>
            </div>
          </div>
        </div>
        
        <div class="grid-2">
          <div class="form-group">
            <label for="dataset-border-width-${index}">Line Width</label>
            <input type="number" id="dataset-border-width-${index}" class="form-control dataset-border-width" value="${dataset.borderWidth}" min="1" max="10">
          </div>
          
          <div class="form-group">
            <label for="dataset-tension-${index}">Line Tension</label>
            <input type="range" id="dataset-tension-${index}" class="form-control dataset-tension" min="0" max="1" step="0.1" value="${dataset.tension}">
            <div class="info-text">Current value: <span class="tension-value">${dataset.tension}</span></div>
          </div>
        </div>
        
        <div class="grid-2">
          <div class="form-group">
            <label for="dataset-point-style-${index}">Point Style</label>
            <select id="dataset-point-style-${index}" class="form-control dataset-point-style">
              ${this.pointStyles.map(style => `<option value="${style.value}" ${dataset.pointStyle === style.value ? 'selected' : ''}>${style.label}</option>`).join('')}
            </select>
          </div>
          
          <div class="form-group">
            <label for="dataset-point-radius-${index}">Point Size</label>
            <input type="number" id="dataset-point-radius-${index}" class="form-control dataset-point-radius" value="${dataset.pointRadius}" min="0" max="10">
          </div>
        </div>
        
        <div class="grid-2">
          <div class="form-group">
            <label for="dataset-line-style-${index}">Line Style</label>
            <select id="dataset-line-style-${index}" class="form-control dataset-line-style">
              ${this.lineStyles.map(style => {
                const selected = (style.value === 'solid' && dataset.borderDash.length === 0) || 
                                 (style.value === 'dashed' && dataset.borderDash.join(',') === '5,5') || 
                                 (style.value === 'dotted' && dataset.borderDash.join(',') === '2,2');
                return `<option value="${style.value}" ${selected ? 'selected' : ''}>${style.label}</option>`;
              }).join('')}
            </select>
          </div>
          
          <div class="form-group">
            <label for="dataset-fill-${index}">Fill Style</label>
            <select id="dataset-fill-${index}" class="form-control dataset-fill">
              ${this.fillStyles.map(style => `<option value="${style.value}" ${dataset.fill.toString() === style.value ? 'selected' : ''}>${style.label}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  setupEventListeners() {
    // Tab navigation
    const tabButtons = this.shadowRoot.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.activeTab = button.dataset.tab;
        this.updateTabUI();
      });
    });
    
    // Chart data inputs
    this.shadowRoot.querySelector('#chart-labels').addEventListener('change', e => {
      this.labels = e.target.value.split(',').map(label => label.trim());
    });
    
    // Add dataset button
    this.shadowRoot.querySelector('#add-dataset-btn').addEventListener('click', () => {
      this.addDataset();
    });
    
    // Remove dataset buttons
    this.shadowRoot.querySelectorAll('.remove-dataset').forEach(button => {
      button.addEventListener('click', e => {
        const datasetContainer = e.target.closest('.dataset-container');
        const index = parseInt(datasetContainer.dataset.index);
        this.removeDataset(index);
      });
    });
    
    // Dataset inputs
    this.setupDatasetListeners();
    
    // Chart options
    this.shadowRoot.querySelector('#chart-type').addEventListener('change', e => {
      this.updateChartType(e.target.value);
    });
    
    this.shadowRoot.querySelector('#chart-title').addEventListener('change', e => {
      this.chartConfig.options.plugins.title.text = e.target.value;
    });
    
    this.shadowRoot.querySelector('#x-axis-title').addEventListener('change', e => {
      this.chartConfig.options.scales.x.title.text = e.target.value;
    });
    
    this.shadowRoot.querySelector('#y-axis-title').addEventListener('change', e => {
      this.chartConfig.options.scales.y.title.text = e.target.value;
    });
    
    this.shadowRoot.querySelector('#show-legend').addEventListener('change', e => {
      this.chartConfig.options.plugins.legend.display = e.target.checked;
      this.shadowRoot.querySelector('#legend-position-container').style.display = 
        e.target.checked ? 'block' : 'none';
    });
    
    this.shadowRoot.querySelector('#legend-position').addEventListener('change', e => {
      this.chartConfig.options.plugins.legend.position = e.target.value;
    });
    
    this.shadowRoot.querySelector('#enable-animation').addEventListener('change', e => {
      this.chartConfig.options.animation = {
        duration: e.target.checked ? 1000 : 0
      };
    });
    
    this.shadowRoot.querySelector('#enable-tooltips').addEventListener('change', e => {
      this.chartConfig.options.plugins.tooltip.enabled = e.target.checked;
    });
    
    this.shadowRoot.querySelector('#maintain-aspect-ratio').addEventListener('change', e => {
      this.chartConfig.options.maintainAspectRatio = e.target.checked;
    });
    
    // Layout and colors
    this.shadowRoot.querySelector('#chart-font-family').addEventListener('change', e => {
      document.documentElement.style.setProperty('--chart-font-family', e.target.value);
      this.updateFontFamily(e.target.value);
    });
    
    this.shadowRoot.querySelector('#title-font-size').addEventListener('change', e => {
      this.chartConfig.options.plugins.title.font.size = parseInt(e.target.value);
    });
    
    this.shadowRoot.querySelector('#axis-font-size').addEventListener('change', e => {
      this.updateAxisFontSize(parseInt(e.target.value));
    });
    
    this.shadowRoot.querySelector('#grid-lines').addEventListener('change', e => {
      this.updateGridLines(e.target.value);
    });
    
    this.shadowRoot.querySelector('#chart-background').addEventListener('change', e => {
      this.updateChartBackground(e.target.value);
    });
    
    this.shadowRoot.querySelectorAll('.palette-color').forEach(color => {
      color.addEventListener('click', e => {
        const colorValue = e.target.dataset.color;
        this.applyColorToSelectedDataset(colorValue);
      });
    });
    
    this.shadowRoot.querySelector('#enable-rounded-corners').addEventListener('change', e => {
      this.chartConfig.options.elements = this.chartConfig.options.elements || {};
      this.chartConfig.options.elements.line = this.chartConfig.options.elements.line || {};
      this.chartConfig.options.elements.line.borderCapStyle = e.target.checked ? 'round' : 'butt';
      this.chartConfig.options.elements.line.borderJoinStyle = e.target.checked ? 'round' : 'miter';
    });
    
    const borderWidthInput = this.shadowRoot.querySelector('#border-width');
    const borderWidthValue = this.shadowRoot.querySelector('#border-width-value');
    
    borderWidthInput.addEventListener('input', e => {
      const value = e.target.value;
      borderWidthValue.textContent = value;
      this.updateDefaultBorderWidth(parseInt(value));
    });
    
    // Update and toggle editor buttons
    this.shadowRoot.querySelector('#update-chart-btn').addEventListener('click', () => {
      this.updateChart();
    });
    
    this.shadowRoot.querySelector('#toggle-editor-btn').addEventListener('click', () => {
      this.editorVisible = false;
      this.render();
      this.setupEventListeners();
      this.renderChart(this.shadowRoot.querySelector('#chart-display'));
    });
    
    this.shadowRoot.querySelector('#show-editor-btn').addEventListener('click', () => {
      this.editorVisible = true;
      this.render();
      this.setupEventListeners();
      this.renderChart();
    });
    
    this.shadowRoot.querySelector('#save-chart-btn').addEventListener('click', () => {
      this.saveChartSettings();
    });
    
    // Color picker buttons
    this.shadowRoot.querySelectorAll('.color-picker-container .btn').forEach(button => {
      button.addEventListener('click', e => {
        const colorInput = e.target.previousElementSibling;
        colorInput.click();
      });
    });
    
    // Range input listeners
    this.shadowRoot.querySelectorAll('input[type="range"]').forEach(range => {
      range.addEventListener('input', e => {
        const valueDisplay = e.target.nextElementSibling.querySelector('span');
        if (valueDisplay) {
          valueDisplay.textContent = e.target.value;
        }
      });
    });
  }
  
  setupDatasetListeners() {
    // Dataset label inputs
    this.shadowRoot.querySelectorAll('.dataset-label').forEach((input, index) => {
      input.addEventListener('change', e => {
        this.datasets[index].label = e.target.value;
      });
    });
    
    // Dataset data inputs
    this.shadowRoot.querySelectorAll('.dataset-data').forEach((input, index) => {
      input.addEventListener('change', e => {
        this.datasets[index].data = e.target.value.split(',').map(val => parseFloat(val.trim()));
      });
    });
    
    // Border color inputs
    this.shadowRoot.querySelectorAll('.dataset-border-color').forEach((input, index) => {
      input.addEventListener('change', e => {
        this.datasets[index].borderColor = e.target.value;
        input.previousElementSibling.style.backgroundColor = e.target.value;
      });
    });
    
    // Background color inputs
    this.shadowRoot.querySelectorAll('.dataset-bg-color').forEach((input, index) => {
      input.addEventListener('change', e => {
        this.datasets[index].backgroundColor = this.hexToRgba(e.target.value, 0.2);
        input.previousElementSibling.style.backgroundColor = e.target.value;
      });
    });
    
    // Border width inputs
    this.shadowRoot.querySelectorAll('.dataset-border-width').forEach((input, index) => {
      input.addEventListener('change', e => {
        this.datasets[index].borderWidth = parseInt(e.target.value);
      });
    });
    
    // Tension inputs
    this.shadowRoot.querySelectorAll('.dataset-tension').forEach((input, index) => {
      input.addEventListener('input', e => {
        const value = parseFloat(e.target.value);
        this.datasets[index].tension = value;
        input.nextElementSibling.querySelector('.tension-value').textContent = value;
      });
    });
    
    // Point style inputs
    this.shadowRoot.querySelectorAll('.dataset-point-style').forEach((input, index) => {
      input.addEventListener('change', e => {
        this.datasets[index].pointStyle = e.target.value;
      });
    });
    
    // Point radius inputs
    this.shadowRoot.querySelectorAll('.dataset-point-radius').forEach((input, index) => {
      input.addEventListener('change', e => {
        this.datasets[index].pointRadius = parseInt(e.target.value);
        this.datasets[index].pointHoverRadius = parseInt(e.target.value) + 2;
      });
    });
    
    // Line style inputs
    this.shadowRoot.querySelectorAll('.dataset-line-style').forEach((input, index) => {
      input.addEventListener('change', e => {
        switch (e.target.value) {
          case 'solid':
            this.datasets[index].borderDash = [];
            break;
          case 'dashed':
            this.datasets[index].borderDash = [5, 5];
            break;
          case 'dotted':
            this.datasets[index].borderDash = [2, 2];
            break;
        }
      });
    });
    
    // Fill style inputs
    this.shadowRoot.querySelectorAll('.dataset-fill').forEach((input, index) => {
      input.addEventListener('change', e => {
        this.datasets[index].fill = e.target.value === 'false' ? false : e.target.value;
      });
    });
  }
  
  updateTabUI() {
    // Update tab buttons
    const tabButtons = this.shadowRoot.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
      if (button.dataset.tab === this.activeTab) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
    
    // Update tab content
    const tabContents = this.shadowRoot.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
      if (content.id === `${this.activeTab}-tab`) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  }
  
  addDataset() {
    const lastDataset = this.datasets[this.datasets.length - 1];
    const colorIndex = this.datasets.length % this.colorPalettes[0].colors.length;
    
    this.datasets.push({
      label: `Dataset ${this.datasets.length + 1}`,
      data: lastDataset.data.map(() => Math.floor(Math.random() * 100)),
      borderColor: this.colorPalettes[0].colors[colorIndex],
      backgroundColor: this.hexToRgba(this.colorPalettes[0].colors[colorIndex], 0.2),
      tension: 0.4,
      fill: false,
      borderWidth: 2,
      pointStyle: 'circle',
      pointRadius: 3,
      pointHoverRadius: 5,
      borderDash: []
    });
    
    this.renderDatasetsContainer();
  }
  
  removeDataset(index) {
    if (this.datasets.length > 1) {
      this.datasets.splice(index, 1);
      this.renderDatasetsContainer();
    }
  }
  
  renderDatasetsContainer() {
    const container = this.shadowRoot.querySelector('#datasets-container');
    container.innerHTML = this.renderDatasets();
    this.setupDatasetListeners();
  }
  
  updateChartType(type) {
    switch (type) {
      case 'basic':
        this.datasets.forEach(dataset => {
          dataset.tension = 0;
          dataset.fill = false;
          dataset.stepped = false;
        });
        break;
      case 'multi-axis':
        this.updateToMultiAxis();
        break;
      case 'stepped':
        this.datasets.forEach(dataset => {
          dataset.stepped = true;
          dataset.tension = 0;
        });
        break;
      case 'interpolated':
        this.datasets.forEach(dataset => {
          dataset.stepped = false;
          dataset.tension = 0.4;
          dataset.fill = false;
        });
        break;
      case 'points':
        this.datasets.forEach(dataset => {
          dataset.pointRadius = 6;
          dataset.pointHoverRadius = 8;
          dataset.tension = 0;
        });
        break;
      case 'filled':
        this.datasets.forEach(dataset => {
          dataset.fill = 'origin';
        });
        break;
    }
    
    this.renderDatasetsContainer();
  }
  
  updateToMultiAxis() {
    if (this.datasets.length >= 2) {
      // Create a second Y axis
      this.chartConfig.options.scales.y1 = {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false
        },
        title: {
          display: true,
          text: 'Secondary Axis'
        }
      };
      
      // Assign second dataset to the second Y axis
      this.datasets[1].yAxisID = 'y1';
      
      // Ensure first dataset is explicitly assigned to primary axis
      this.datasets[0].yAxisID = 'y';
    }
  }
  
  updateFontFamily(fontFamily) {
    const defaultFont = {
      family: fontFamily
    };
    
    this.chartConfig.options.plugins.title.font = {
      ...this.chartConfig.options.plugins.title.font,
      family: fontFamily
    };
    
    this.chartConfig.options.scales.x.title.font = {
      ...this.chartConfig.options.scales.x.title.font,
      family: fontFamily
    };
    
    this.chartConfig.options.scales.y.title.font = {
      ...this.chartConfig.options.scales.y.title.font,
      family: fontFamily
    };
    
    this.chartConfig.options.font = defaultFont;
  }
  
  updateAxisFontSize(size) {
    this.chartConfig.options.scales.x.ticks = {
      ...this.chartConfig.options.scales.x.ticks,
      font: {
        size: size
      }
    };
    
    this.chartConfig.options.scales.y.ticks = {
      ...this.chartConfig.options.scales.y.ticks,
      font: {
        size: size
      }
    };
    
    this.chartConfig.options.scales.x.title.font = {
      ...this.chartConfig.options.scales.x.title.font,
      size: size + 2
    };
    
    this.chartConfig.options.scales.y.title.font = {
      ...this.chartConfig.options.scales.y.title.font,
      size: size + 2
    };
  }
  
  updateGridLines(value) {
    const xGrid = value === 'both' || value === 'x';
    const yGrid = value === 'both' || value === 'y';
    
    this.chartConfig.options.scales.x.grid = {
      display: xGrid
    };
    
    this.chartConfig.options.scales.y.grid = {
      display: yGrid
    };
  }
  
  updateChartBackground(color) {
    document.documentElement.style.setProperty('--chart-background', color);
  }
  
  updateDefaultBorderWidth(width) {
    this.datasets.forEach(dataset => {
      dataset.borderWidth = width;
    });
    
    this.renderDatasetsContainer();
  }
  
  applyColorToSelectedDataset(color) {
    // Find any selected dataset or use the first one
    const datasetContainer = this.shadowRoot.querySelector('.dataset-container.selected') || 
                             this.shadowRoot.querySelector('.dataset-container');
    
    if (datasetContainer) {
      const index = parseInt(datasetContainer.dataset.index);
      const dataset = this.datasets[index];
      
      // Update colors
      dataset.borderColor = color;
      dataset.backgroundColor = this.hexToRgba(color, 0.2);
      
      // Update UI
      const borderColorInput = datasetContainer.querySelector('.dataset-border-color');
      const bgColorInput = datasetContainer.querySelector('.dataset-bg-color');
      
      borderColorInput.value = color;
      borderColorInput.previousElementSibling.style.backgroundColor = color;
      
      bgColorInput.value = this.rgbaToHex(this.hexToRgba(color, 0.2));
      bgColorInput.previousElementSibling.style.backgroundColor = this.hexToRgba(color, 0.2);
    }
  }
  
  saveChartSettings() {
    // Get all current settings
    const chartSettings = {
      type: this.shadowRoot.querySelector('#chart-type').value,
      labels: this.labels,
      datasets: JSON.parse(JSON.stringify(this.datasets)),
      options: JSON.parse(JSON.stringify(this.chartConfig.options))
    };
    
    // Create JSON blob
    const blob = new Blob([JSON.stringify(chartSettings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chart-settings.json';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }
  
  updateChart() {
    // Update chart config with current settings
    this.chartConfig.data.labels = this.labels;
    this.chartConfig.data.datasets = this.datasets;
    
    // Create or update chart
    this.renderChart();
    
    // Switch to preview tab
    this.activeTab = 'preview';
    this.updateTabUI();
  }
  
  renderChart(canvas) {
    // Get canvas element
    canvas = canvas || this.shadowRoot.querySelector('#chart-preview');
    
    // Destroy existing chart if it exists
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    
    // Create new chart
    this.chartInstance = new Chart(canvas, this.chartConfig);
  }
  
  // Helper methods
  hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  rgbaToHex(rgba) {
    // Parse RGBA string
    const match = rgba.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)/);
    
    if (!match) return '#000000';
    
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  
  // Element attributes
  static get observedAttributes() {
    return ['chart-type', 'chart-title'];
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'chart-type' && oldValue !== newValue) {
      this.updateChartType(newValue);
    }
    
    if (name === 'chart-title' && oldValue !== newValue) {
      this.chartConfig.options.plugins.title.text = newValue;
      if (this.chartInstance) {
        this.chartInstance.update();
      }
    }
  }
}

// Register the custom element
if (!customElements.get('wix-chart-builder')) {
  customElements.define('wix-chart-builder', WixChartBuilder);
}
