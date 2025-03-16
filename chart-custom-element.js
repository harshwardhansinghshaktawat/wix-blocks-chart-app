// chart-custom-element.js
class ChartCustomElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.chartInstance = null;
    this.showEditButton = true; // Default state
  }

  connectedCallback() {
    this.renderUI();
    this.loadChartJS();
  }

  renderUI() {
    this.shadowRoot.innerHTML = `
      <style>
        .container { font-family: Arial, sans-serif; padding: 20px; }
        .tabs { display: flex; gap: 10px; margin-bottom: 20px; }
        .tab-button { padding: 10px; cursor: pointer; background: #ddd; border-radius: 5px; }
        .tab-button.active { background: #007bff; color: white; }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        canvas { max-width: 100%; }
        .final-output { display: none; padding: 20px; background: #f0f0f0; min-height: 400px; }
        .editor-button { padding: 10px; background: #007bff; color: white; border: none; cursor: pointer; }
      </style>
      <div class="container">
        <div class="editor">
          <div class="tabs">
            <button class="tab-button active" data-tab="data">Chart Data</button>
            <button class="tab-button" data-tab="options">Chart Options</button>
            <button class="tab-button" data-tab="layout">Layout & Color</button>
            <button class="tab-button" data-tab="preview">Preview</button>
          </div>
          <div id="data" class="tab-content active">
            <textarea id="chartData" rows="5" cols="50" placeholder="Enter data in JSON format (e.g., { labels: ['Jan', 'Feb'], datasets: [{ data: [10, 20] }] })"></textarea>
          </div>
          <div id="options" class="tab-content">
            <select id="chartType">
              <option value="basic">Basic Line Chart</option>
              <option value="multiAxis">Multi-Axis Line Chart</option>
              <option value="stepped">Stepped Line Chart</option>
              <option value="interpolated">Interpolated Line Chart</option>
              <option value="points">Line Chart with Points</option>
              <option value="filled">Filled Line Chart</option>
            </select>
          </div>
          <div id="layout" class="tab-content">
            <label>Line Color: <input type="color" id="lineColor" value="#007bff"></label><br>
            <label>Font: <select id="fontFamily">
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
            </select></label>
          </div>
          <div id="preview" class="tab-content">
            <canvas id="previewChart"></canvas>
            <button id="updateChart">Update Chart</button>
          </div>
        </div>
        <div class="final-output">
          <canvas id="finalChart"></canvas>
          <button class="editor-button" id="openEditor" style="display: ${this.showEditButton ? 'block' : 'none'}">Open Editor</button>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  loadChartJS() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => this.initializeChart();
    this.shadowRoot.appendChild(script);
  }

  setupEventListeners() {
    const tabs = this.shadowRoot.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.shadowRoot.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        this.shadowRoot.querySelector(`#${tab.dataset.tab}`).classList.add('active');
      });
    });

    this.shadowRoot.querySelector('#updateChart').addEventListener('click', () => this.updateChart());
    this.shadowRoot.querySelector('#openEditor').addEventListener('click', () => this.showEditor());
    this.shadowRoot.querySelector('#chartData').addEventListener('input', () => this.previewChart());
  }

  initializeChart() {
    this.previewChart();
  }

  getChartConfig(type, data, options) {
    const baseConfig = {
      type: 'line',
      data: data,
      options: {
        scales: { y: { beginAtZero: true } },
        plugins: { legend: { labels: { font: { family: options.fontFamily } } } }
      }
    };

    switch (type) {
      case 'multiAxis':
        baseConfig.options.scales.y1 = { position: 'right' };
        break;
      case 'stepped':
        baseConfig.data.datasets[0].stepped = true;
        break;
      case 'interpolated':
        baseConfig.data.datasets[0].tension = 0.4;
        break;
      case 'points':
        baseConfig.data.datasets[0].pointRadius = 5;
        break;
      case 'filled':
        baseConfig.data.datasets[0].fill = true;
        break;
    }
    baseConfig.data.datasets[0].borderColor = options.lineColor;
    return baseConfig;
  }

  previewChart() {
    const dataInput = this.shadowRoot.querySelector('#chartData').value;
    const type = this.shadowRoot.querySelector('#chartType').value;
    const lineColor = this.shadowRoot.querySelector('#lineColor').value;
    const fontFamily = this.shadowRoot.querySelector('#fontFamily').value;

    let data;
    try {
      data = JSON.parse(dataInput || '{"labels": ["Jan", "Feb"], "datasets": [{"data": [10, 20]}]}');
    } catch (e) {
      data = { labels: ['Error'], datasets: [{ data: [0] }] };
    }

    if (this.chartInstance) this.chartInstance.destroy();
    const ctx = this.shadowRoot.querySelector('#previewChart').getContext('2d');
    this.chartInstance = new Chart(ctx, this.getChartConfig(type, data, { lineColor, fontFamily }));
  }

  updateChart() {
    const dataInput = this.shadowRoot.querySelector('#chartData').value;
    const type = this.shadowRoot.querySelector('#chartType').value;
    const lineColor = this.shadowRoot.querySelector('#lineColor').value;
    const fontFamily = this.shadowRoot.querySelector('#fontFamily').value;

    let data;
    try {
      data = JSON.parse(dataInput || '{"labels": ["Jan", "Feb"], "datasets": [{"data": [10, 20]}]}');
    } catch (e) {
      data = { labels: ['Error'], datasets: [{ data: [0] }] };
    }

    this.shadowRoot.querySelector('.editor').style.display = 'none';
    const finalOutput = this.shadowRoot.querySelector('.final-output');
    finalOutput.style.display = 'block';
    if (this.chartInstance) this.chartInstance.destroy();
    const ctx = this.shadowRoot.querySelector('#finalChart').getContext('2d');
    this.chartInstance = new Chart(ctx, this.getChartConfig(type, data, { lineColor, fontFamily }));
  }

  showEditor() {
    this.shadowRoot.querySelector('.editor').style.display = 'block';
    this.shadowRoot.querySelector('.final-output').style.display = 'none';
  }

  static get observedAttributes() {
    return ['edit-button-visibility'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'edit-button-visibility') {
      this.showEditButton = newValue === 'show';
      const editButton = this.shadowRoot.querySelector('#openEditor');
      if (editButton) editButton.style.display = this.showEditButton ? 'block' : 'none';
    }
  }
}

customElements.define('chart-custom-element', ChartCustomElement);
