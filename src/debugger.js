import { LitElement, html, css } from 'lit';

class LitDebugger extends LitElement {
  static properties = {
    target: { type: Object },
    selected: { type: Object },
    components: { type: Array },
    isOpen: { type: Boolean },
    activeTab: { type: String },
  };

  static styles = css`
    :host {
      position: relative;
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      --primary-color: #2196F3;
      --primary-dark: #1976D2;
      --success-color: #4CAF50;
      --error-color: #F44336;
      --warning-color: #FF9800;
      --background: #ffffff;
      --surface: #f8f9fa;
      --border: #e0e0e0;
      --text: #333333;
      --text-secondary: #666666;
      --shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      --shadow-light: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .host {
      display: block;
      width: 100%;
      min-height: 200px;
    }

    .debugger-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: var(--shadow);
      transition: all 0.3s ease;
      font-size: 20px;
    }

    .debugger-toggle:hover {
      background: var(--primary-dark);
      transform: scale(1.1);
    }

    .debugger-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: 400px;
      height: 100vh;
      background: var(--background);
      box-shadow: var(--shadow);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      z-index: 999;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .debugger-panel.open {
      transform: translateX(0);
    }

    .debugger-header {
      background: var(--primary-color);
      color: white;
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: var(--shadow-light);
    }

    .debugger-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: background 0.2s ease;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .debugger-content {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .component-list {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      max-height: 200px;
      overflow-y: auto;
    }

    .component-list h4 {
      margin: 0;
      padding: 12px 16px;
      background: var(--background);
      border-bottom: 1px solid var(--border);
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
    }

    .component-item {
      display: block;
      width: 100%;
      padding: 12px 16px;
      text-align: left;
      background: none;
      border: none;
      border-bottom: 1px solid var(--border);
      cursor: pointer;
      transition: background 0.2s ease;
      font-size: 14px;
      color: var(--text);
    }

    .component-item:hover {
      background: var(--primary-color);
      color: white;
    }

    .component-item.selected {
      background: var(--primary-color);
      color: white;
      font-weight: 500;
    }

    .component-tag {
      font-weight: 500;
    }

    .component-id {
      font-size: 12px;
      opacity: 0.7;
      margin-left: 4px;
    }

    .details {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      background: var(--background);
    }

    .details h3 {
      margin: 0 0 20px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--text);
      display: flex;
      align-items: center;
    }

    .details h3::before {
      content: '⚛️';
      margin-right: 8px;
    }

    .property-group {
      margin-bottom: 20px;
    }

    .property-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: var(--text);
      font-size: 13px;
    }

    .property-type {
      display: inline-block;
      background: var(--primary-color);
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
      margin-left: 8px;
    }

    .property-input, .property-textarea {
      width: 100%;
      padding: 10px 12px;
      border: 2px solid var(--border);
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      transition: border-color 0.2s ease;
      box-sizing: border-box;
    }

    .property-input:focus, .property-textarea:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
    }

    .property-textarea {
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
      font-size: 13px;
      resize: vertical;
      min-height: 80px;
      line-height: 1.4;
    }

    .property-input[type="datetime-local"] {
      cursor: pointer;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-secondary);
    }

    .empty-state-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .scrollbar-thin {
      scrollbar-width: thin;
      scrollbar-color: var(--border) transparent;
    }

    .scrollbar-thin::-webkit-scrollbar {
      width: 6px;
    }

    .scrollbar-thin::-webkit-scrollbar-track {
      background: transparent;
    }

    .scrollbar-thin::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 3px;
    }

    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
      background: var(--text-secondary);
    }

    /* Tabs */
    .tabs {
      display: flex;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
    }

    .tab {
      padding: 12px 16px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
      transition: all 0.2s ease;
      border-bottom: 2px solid transparent;
    }

    .tab:hover {
      color: var(--text);
      background: rgba(33, 150, 243, 0.1);
    }

    .tab.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }

    .tab-content {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }

    /* Event listeners styles */
    .event-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      margin-bottom: 8px;
      background: var(--surface);
      border-radius: 6px;
      border: 1px solid var(--border);
    }

    .event-type {
      font-weight: 500;
      color: var(--text);
    }

    .event-target {
      font-size: 12px;
      color: var(--text-secondary);
      font-family: monospace;
    }

    .event-count {
      background: var(--success-color);
      color: white;
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 10px;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .debugger-panel {
        width: 100vw;
      }
    }
  `;

  constructor() {
    super();
    this.target = null;
    this.selected = null;
    this.components = [];
    this.isOpen = false;
    this.activeTab = 'properties';
  }

  render() {
    console.log('Rendering LitDebugger', this.target, this.selected, this.components);
    return html`
      <div class="host">
        <slot @slotchange=${this._onSlotChange}></slot>
      </div>
      
      <button 
        class="debugger-toggle" 
        @click=${this._toggleDebugger}
        title="Toggle Lit Debugger"
      >
        🔧
      </button>
      
      <div class="debugger-panel ${this.isOpen ? 'open' : ''}">
        <div class="debugger-header">
          <h2 class="debugger-title">🔧 Lit Debugger</h2>
          <button class="close-btn" @click=${this._toggleDebugger}>×</button>
        </div>
        
        <div class="debugger-content">
          <div class="component-list scrollbar-thin">
            <h4>Components (${this.components.length})</h4>
            ${this.components.map(
              (el) => html`
                <button 
                  class="component-item ${el === this.selected ? 'selected' : ''}"
                  @click=${() => this._select(el)}
                >
                  <span class="component-tag">${el.tagName.toLowerCase()}</span>
                  ${el.id ? html`<span class="component-id">#${el.id}</span>` : ''}
                </button>
              `
            )}
          </div>
          
          <div class="details scrollbar-thin">
            ${this.selected
              ? html`
                  <h3>${this.selected.tagName.toLowerCase()}</h3>
                  <div class="tabs">
                    <button 
                      class="tab ${this.activeTab === 'properties' ? 'active' : ''}"
                      @click=${() => this._setActiveTab('properties')}
                    >
                      📋 Properties
                    </button>
                    <button 
                      class="tab ${this.activeTab === 'performance' ? 'active' : ''}"
                      @click=${() => this._setActiveTab('performance')}
                    >
                      📊 Performance
                    </button>
                  </div>
                  <div class="tab-content">
                    ${this._renderTabContent()}
                  </div>
                `
              : html`
                  <div class="empty-state">
                    <div class="empty-state-icon">🎯</div>
                    <p>Select a component to inspect its properties</p>
                  </div>
                `}
          </div>
        </div>
      </div>
    `;
  }

  _onSlotChange(e) {
    const assigned = e.target.assignedElements?.();
    if (assigned?.length > 0) {
      this.target = assigned[0];
      this._scanComponents();
    }
  }

  _scanComponents() {
    const all = new Set();
    const walk = (el) => {
      if (el.tagName?.includes('-')) all.add(el);
      if (el.shadowRoot) el.shadowRoot.querySelectorAll('*').forEach(walk);
      el.querySelectorAll?.('*').forEach(walk);
    };
    walk(this.target);
    this.components = [...all];
    // Use _select() instead of directly setting this.selected to properly set up observers
    if (this.components.length > 0) {
      this._select(this.components[0]);
    }
  }

  _select(el) {
    // Clean up previous observer
    if (this._mutationObserver) {
      this._mutationObserver.disconnect();
    }
    
    // Clean up previous property listeners
    if (this._propertyListeners) {
      this._propertyListeners.forEach(cleanup => cleanup());
      this._propertyListeners = [];
    }
    
    this.selected = el;
    
    if (this.selected) {
      // Initialize performance tracking immediately when component is selected
      this._initializePerformanceTracking(this.selected);
      
      this._propertyListeners = [];
      
      // Set up mutation observer for DOM changes
      this._mutationObserver = new MutationObserver(() => {
        this.requestUpdate();
      });
      
      this._mutationObserver.observe(this.selected, {
        childList: true,
        subtree: true,
        attributes: true
      });
      
      if (this.selected.shadowRoot) {
        this._mutationObserver.observe(this.selected.shadowRoot, {
          childList: true,
          subtree: true,
          attributes: true
        });
      }
      
      // Set up property change detection
      const ctor = this.selected.constructor;
      const propDefs = ctor.properties || {};
      
      Object.keys(propDefs).forEach(propName => {
        const descriptor = Object.getOwnPropertyDescriptor(this.selected, propName) ||
                          Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this.selected), propName);
        
        if (descriptor && descriptor.set) {
          // Store the original setter
          const originalSetter = descriptor.set;
          const debuggerRef = this;
          
          // Create a new setter that triggers our update
          const newSetter = function(value) {
            const result = originalSetter.call(this, value);
            // Trigger debugger update after a short delay to allow for rendering
            setTimeout(() => {
              debuggerRef.requestUpdate();
            }, 10);
            return result;
          };
          
          // Replace the setter
          Object.defineProperty(this.selected, propName, {
            ...descriptor,
            set: newSetter
          });
          
          // Store cleanup function
          this._propertyListeners.push(() => {
            Object.defineProperty(this.selected, propName, descriptor);
          });
        }
      });
    }
  }

  _renderProps(el) {
  const ctor = el.constructor;
  const propDefs = ctor.properties || {};
  const propKeys = Object.keys(propDefs);

  return propKeys.map((key) => {
    const value = el[key];
    const isArray = Array.isArray(value);
    const isDate = value instanceof Date;
    const isObject = value !== null && typeof value === 'object' && !isArray && !isDate;
    
    let typeLabel = '';
    if (isArray) typeLabel = 'Array';
    else if (isDate) typeLabel = 'Date';
    else if (isObject) typeLabel = 'Object';
    else if (typeof value === 'boolean') typeLabel = 'Boolean';
    else if (typeof value === 'number') typeLabel = 'Number';
    else typeLabel = 'String';
    
    return html`
      <div class="property-group">
        <label class="property-label">
          ${key}
          <span class="property-type">${typeLabel}</span>
        </label>
        ${isDate
          ? html`
              <input
                class="property-input"
                type="datetime-local"
                .value=${this._dateToInputValue(value)}
                @input=${(e) => this._updateProp(el, key, e.target.value)}
              />
            `
          : isArray || isObject
            ? html`
                <textarea
                  class="property-textarea scrollbar-thin"
                  rows="4"
                  .value=${JSON.stringify(value, null, 2)}
                  @input=${(e) => this._updateProp(el, key, e.target.value)}
                  placeholder=${isArray 
                    ? "Enter JSON array, e.g. ['item1', 'item2']"
                    : "Enter JSON object, e.g. {'key': 'value'}"
                  }
                ></textarea>
              `
            : html`
                <input
                  class="property-input"
                  .value=${String(value)}
                  @input=${(e) => this._updateProp(el, key, e.target.value)}
                />
              `
        }
      </div>
    `;
  });
}

//   _renderProps(el) {
//     const props = {};
//     for (const key in el) {
//       const val = el[key];
//       if (
//         typeof val === 'string' ||
//         typeof val === 'number' ||
//         typeof val === 'boolean'
//       ) {
//         props[key] = val;
//       }
//     }

//     return Object.entries(props).map(
//       ([key, value]) => html`
//         <label>
//           ${key}
//           <input
//             .value=${String(value)}
//             @input=${(e) => this._updateProp(el, key, e.target.value)}
//           />
//         </label>
//       `
//     );
//   }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._mutationObserver) {
      this._mutationObserver.disconnect();
    }
    if (this._propertyListeners) {
      this._propertyListeners.forEach(cleanup => cleanup());
      this._propertyListeners = [];
    }
  }

  _toggleDebugger() {
    this.isOpen = !this.isOpen;
  }

  _setActiveTab(tab) {
    this.activeTab = tab;
  }

  _renderTabContent() {
    switch (this.activeTab) {
      case 'properties':
        return this._renderProps(this.selected);
      case 'performance':
        return this._renderPerformance(this.selected);
      default:
        return this._renderProps(this.selected);
    }
  }

  _renderPerformance(el) {
    const perf = this._getElementPerformance(el);
    
    return html`
      <div class="performance-stats">
        <div class="property-group">
          <div class="property-label">Render Count</div>
          <div class="property-input" style="background: #f5f5f5;">
            ${perf.renderCount}
          </div>
        </div>
        <div class="property-group">
          <div class="property-label">Last Render Time</div>
          <div class="property-input" style="background: #f5f5f5;">
            ${perf.lastRenderTime}ms
          </div>
        </div>
      </div>
    `;
  }

  _initializePerformanceTracking(el) {
    // Initialize performance tracking if not exists
    if (!el.__debugPerf) {
      el.__debugPerf = {
        renderCount: 0,
        renderTimes: [],
        createdAt: Date.now()
      };
      
      // Hook into the render method to track performance
      const originalRender = el.render;
      if (originalRender) {
        el.render = function() {
          const start = performance.now();
          const result = originalRender.call(this);
          const end = performance.now();
          
          this.__debugPerf.renderCount++;
          this.__debugPerf.renderTimes.push(end - start);
          
          // Keep only last render time
          if (this.__debugPerf.renderTimes.length > 1) {
            this.__debugPerf.renderTimes.shift();
          }
          
          return result;
        };
      }
    }
  }

  _getElementPerformance(el) {
    // Ensure performance tracking is initialized
    this._initializePerformanceTracking(el);
    
    const perf = el.__debugPerf;
    const lastRenderTime = perf.renderTimes.length > 0 
      ? perf.renderTimes[perf.renderTimes.length - 1].toFixed(2)
      : '0.00';
    
    return {
      renderCount: perf.renderCount,
      lastRenderTime
    };
  }

  _dateToInputValue(date) {
    if (!date || !(date instanceof Date)) return '';
    // Convert to local datetime-local format (YYYY-MM-DDTHH:MM)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  _onPropertyChanged(e) {
    // Force re-render when properties change
    this.requestUpdate();
  }

  _updateProp(el, key, raw) {
    const old = el[key];
    let val = raw;
    
    if (old instanceof Date) {
      // Handle Date objects
      val = new Date(raw);
      if (isNaN(val.getTime())) {
        console.warn(`Invalid date for ${key}:`, raw);
        return;
      }
    } else if (Array.isArray(old)) {
      try {
        val = JSON.parse(raw);
        // Validate that the parsed value is an array
        if (!Array.isArray(val)) {
          console.warn(`Expected array for ${key}, got:`, val);
          return;
        }
      } catch (e) {
        console.warn(`Invalid JSON for array property ${key}:`, e);
        return;
      }
    } else if (old !== null && typeof old === 'object' && !Array.isArray(old)) {
      try {
        val = JSON.parse(raw);
        // Validate that the parsed value is an object (and not an array or null)
        if (val === null || typeof val !== 'object' || Array.isArray(val)) {
          console.warn(`Expected object for ${key}, got:`, val);
          return;
        }
      } catch (e) {
        console.warn(`Invalid JSON for object property ${key}:`, e);
        return;
      }
    } else if (typeof old === 'number') {
      val = parseFloat(raw);
    } else if (typeof old === 'boolean') {
      val = raw === 'true';
    }
    
    el[key] = val;
  }
}

window.customElements.define('lit-debugger', LitDebugger);
