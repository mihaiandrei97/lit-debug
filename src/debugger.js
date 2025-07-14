import { LitElement, html, css } from 'lit';

class LitDebugger extends LitElement {
  static properties = {
    target: { type: Object },
    selected: { type: Object },
    components: { type: Array },
    isOpen: { type: Boolean },
    activeTab: { type: String },
    selectors: { type: Array }, // Array of CSS selectors to monitor
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
      max-height: 300px;
      overflow-y: auto;
    }

    .component-tree-container {
      background: var(--surface);
      height: 100%;
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

    .component-tree {
      padding: 8px 0;
    }

    .component-tree-node {
      position: relative;
      margin-left: 16px;
      padding: 2px 0;
    }

    .component-tree-node:first-child {
      margin-left: 0;
    }

    .component-tree-node::before {
      content: '';
      position: absolute;
      left: -12px;
      top: 14px;
      width: 8px;
      height: 1px;
      background: var(--border);
    }

    .component-tree-node::after {
      content: '';
      position: absolute;
      left: -12px;
      top: 0;
      width: 1px;
      height: 100%;
      background: var(--border);
    }

    .component-tree-node:last-child::after {
      height: 14px;
    }

    .component-tree-node.root::before,
    .component-tree-node.root::after {
      display: none;
    }

    .component-item {
      display: block;
      width: 100%;
      padding: 8px 12px;
      text-align: left;
      background: none;
      border: none;
      cursor: pointer;
      transition: background 0.2s ease;
      font-size: 13px;
      color: var(--text);
      border-radius: 4px;
      margin: 2px 4px;
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
      color: var(--primary-color);
      font-weight: 500;
      font-size: 11px;
      margin-left: 4px;
    }

    .component-count, .component-children {
      color: var(--text-secondary);
      font-size: 10px;
      margin-left: 4px;
    }

    .component-class {
      color: var(--warning-color);
      font-size: 10px;
      margin-left: 4px;
    }

    .component-tree:focus {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }

    /* Enhanced Selectors Section */
    .selectors-section {
      background: var(--surface);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 20px;
      border: 1px solid var(--border);
      transition: all 0.2s ease;
    }

    .selectors-section:hover {
      border-color: var(--primary-color);
      box-shadow: 0 2px 8px rgba(33, 150, 243, 0.1);
    }

    .selectors-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .selectors-header h4 {
      margin: 0;
      color: var(--text);
      font-size: 14px;
      font-weight: 600;
    }

    .selectors-info {
      font-size: 11px;
      color: var(--text-secondary);
    }

    .selector-count {
      background: var(--primary-color);
      color: white;
      padding: 2px 8px;
      border-radius: 10px;
      font-weight: 500;
    }

    .auto-detected {
      background: var(--success-color);
      color: white;
      padding: 2px 8px;
      border-radius: 10px;
      font-weight: 500;
    }

    .selector-input-container {
      position: relative;
    }

    .selector-input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid var(--border);
      border-radius: 6px;
      font-size: 13px;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
      transition: all 0.2s ease;
      background: var(--background);
      box-sizing: border-box;
    }

    .selector-input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
      background: white;
    }

    .selector-input:hover {
      border-color: var(--primary-dark);
    }

    .input-hint {
      font-size: 11px;
      color: var(--text-secondary);
      margin-top: 6px;
      padding-left: 4px;
      opacity: 0.8;
    }

    .selector-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 12px;
    }

    .selector-tag {
      display: inline-flex;
      align-items: center;
      background: var(--primary-color);
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-family: monospace;
      font-weight: 500;
      gap: 6px;
    }

    .remove-selector {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
      padding: 0;
      margin: 0;
      opacity: 0.8;
      transition: opacity 0.2s ease;
    }

    .remove-selector:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
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

    .component-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .component-header h3 {
      margin: 0;
    }

    .highlight-btn {
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .highlight-btn:hover {
      background: var(--primary-dark);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
    }

    .highlight-btn:active {
      transform: translateY(0);
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

    .circular-warning {
      display: inline-block;
      margin-left: 8px;
      font-size: 12px;
      cursor: help;
      opacity: 0.8;
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

    .tab:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .tab:disabled:hover {
      color: var(--text-secondary);
      background: transparent;
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
    this.componentTree = [];
    this.isOpen = false;
    this.activeTab = 'selectors'; // Changed default tab to selectors
    this.activeSubTab = 'properties'; // For the properties tab sub-tabs
    // Selectors will be auto-detected from first child or provided via attribute
    this.selectors = [];
    this._highlightOverlay = null;
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Find components after a short delay to let DOM settle
    setTimeout(() => {
      this._findComponents();
    }, 100);
    
    // Also find when DOM content is loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this._findComponents();
      });
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    
    // If selectors property changed, find components
    if (changedProperties.has('selectors')) {
      this._findComponents();
    }
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
          <div class="tabs">
            <button 
              class="tab ${this.activeTab === 'selectors' ? 'active' : ''}"
              @click=${() => this._setActiveTab('selectors')}
            >
              🎯 Selectors
            </button>
            <button 
              class="tab ${this.activeTab === 'tree' ? 'active' : ''}"
              @click=${() => this._setActiveTab('tree')}
            >
              📦 Components (${this.components.length})
            </button>
            <button 
              class="tab ${this.activeTab === 'properties' ? 'active' : ''}"
              @click=${() => this._setActiveTab('properties')}
              ?disabled=${!this.selected}
            >
              � Selected
            </button>
          </div>
          
          <div class="tab-content">
            ${this._renderMainTabContent()}
          </div>
        </div>
      </div>
    `;
  }

  _onSlotChange(e) {
    // Refresh components when slot content changes
    this._findComponents();
  }

  _findComponents() {
    // Determine selectors to use
    let selectorsToUse = [];
    
    // Use current selectors if they exist, otherwise auto-detect from first child
    if (this.selectors && this.selectors.length > 0) {
      selectorsToUse = this.selectors;
    } else {
      // Auto-detect from first web component (element with "-" in tag name)
      const allChildren = Array.from(this.querySelectorAll('*'));
      const firstWebComponent = allChildren.find(el => el.tagName?.includes('-'));
      
      if (firstWebComponent && firstWebComponent.tagName) {
        const tagName = firstWebComponent.tagName.toLowerCase();
        selectorsToUse = [tagName];
        this.selectors = selectorsToUse; // Update the property
      }
    }
    
    if (selectorsToUse.length === 0) {
      console.warn('No selectors provided and no child elements found');
      return;
    }
    
    const components = new Set();
    
    // Use querySelectorAll with the determined selectors
    selectorsToUse.forEach(selector => {
      try {
        // Search in document
        document.querySelectorAll(selector).forEach(el => components.add(el));
        
        // Also search in shadow DOM of existing components
        components.forEach(comp => {
          if (comp.shadowRoot) {
            comp.shadowRoot.querySelectorAll(selector).forEach(el => components.add(el));
          }
        });
      } catch (e) {
        console.warn(`Invalid selector: ${selector}`, e);
      }
    });
    
    this.components = [...components];
    
    // Build hierarchical structure
    this.componentTree = this._buildComponentHierarchy();
    
    // Auto-select first component if none selected
    if (this.components.length > 0 && !this.selected) {
      this._select(this.components[0]);
    }
    
    this.requestUpdate();
  }

  _updateSelectors(e) {
    const value = e.target.value.trim();
    if (value) {
      // Split by comma and clean up
      this.selectors = value.split(',').map(s => s.trim()).filter(s => s);
    } else {
      this.selectors = [];
    }
  }

  _removeSelector(selectorToRemove) {
    this.selectors = this.selectors.filter(s => s !== selectorToRemove);
    this.requestUpdate();
  }

  _onSelectorFocus(e) {
    e.target.parentElement.parentElement.style.borderColor = 'var(--primary-color)';
    e.target.parentElement.parentElement.style.boxShadow = '0 4px 12px rgba(33, 150, 243, 0.15)';
  }

  _onSelectorBlur(e) {
    e.target.parentElement.parentElement.style.borderColor = 'var(--border)';
    e.target.parentElement.parentElement.style.boxShadow = 'none';
  }

  _highlightSelected() {
    if (!this.selected) return;
    
    // Remove existing highlight
    this._removeHighlight();
    
    // Create highlight overlay
    const rect = this.selected.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    this._highlightOverlay = document.createElement('div');
    this._highlightOverlay.style.cssText = `
      position: absolute;
      left: ${rect.left + scrollX}px;
      top: ${rect.top + scrollY}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      background: rgba(33, 150, 243, 0.3);
      border: 2px solid var(--primary-color);
      pointer-events: none;
      z-index: 9999;
      animation: pulse 2s ease-in-out 3;
    `;
    
    // Add pulse animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.7; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(this._highlightOverlay);
    
    // Auto-remove after 6 seconds
    setTimeout(() => this._removeHighlight(), 6000);
    
    // Scroll to element
    this.selected.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  _removeHighlight() {
    if (this._highlightOverlay && this._highlightOverlay.parentNode) {
      this._highlightOverlay.parentNode.removeChild(this._highlightOverlay);
      this._highlightOverlay = null;
    }
  }

  _handleKeyNavigation(e) {
    if (!this.components.length) return;
    
    const currentIndex = this.selected ? this.components.indexOf(this.selected) : -1;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = currentIndex < this.components.length - 1 ? currentIndex + 1 : 0;
        this._select(this.components[nextIndex]);
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : this.components.length - 1;
        this._select(this.components[prevIndex]);
        break;
      case 'Enter':
        e.preventDefault();
        this._highlightSelected();
        break;
    }
  }

  _buildComponentHierarchy() {
    const buildNode = (element) => {
      const node = {
        element: element,
        children: []
      };

      // Find child components
      const childComponents = this.components.filter(comp => {
        return comp !== element && this._isDescendant(element, comp);
      });

      // Filter out components that are nested deeper
      const directChildren = childComponents.filter(child => {
        return !childComponents.some(other => 
          other !== child && this._isDescendant(other, child)
        );
      });

      directChildren.forEach(child => {
        node.children.push(buildNode(child));
      });

      return node;
    };

    // Find root components (components with no parent components)
    const rootComponents = this.components.filter(comp => {
      return !this.components.some(other => 
        other !== comp && this._isDescendant(other, comp)
      );
    });

    return rootComponents.map(root => buildNode(root));
  }

  _isDescendant(parent, child) {
    // Check if child is a descendant of parent
    let current = child.parentElement;
    while (current) {
      if (current === parent) return true;
      current = current.parentElement;
    }
    
    // Also check shadow DOM
    if (parent.shadowRoot) {
      return parent.shadowRoot.contains(child);
    }
    
    return false;
  }

  _renderComponentTree() {
    if (!this.componentTree || this.componentTree.length === 0) {
      return html`<div style="padding: 16px; text-align: center; color: var(--text-secondary);">No components found</div>`;
    }

    return this.componentTree.map(node => this._renderComponentTreeNode(node, 0, true));
  }

  _renderComponentTreeNode(node, level, isRoot = false) {
    const isSelected = node.element === this.selected;
    const instanceCount = this.components.filter(c => c.tagName === node.element.tagName).length;
    
    return html`
      <div class="component-tree-node ${isRoot ? 'root' : ''}" style="margin-left: ${level * 16}px">
        <button 
          class="component-item ${isSelected ? 'selected' : ''}"
          @click=${() => this._select(node.element)}
          title="Click to select"
        >
          <span class="component-tag">${node.element.tagName.toLowerCase()}</span>
          ${node.element.id ? html`<span class="component-id">#${node.element.id}</span>` : ''}
          ${instanceCount > 1 ? html`<span class="component-count">(${instanceCount} instances)</span>` : ''}
          ${node.children.length > 0 ? html`<span class="component-children">[${node.children.length} children]</span>` : ''}
        </button>
        ${node.children.map(child => this._renderComponentTreeNode(child, level + 1))}
      </div>
    `;
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
    
    // Switch to properties tab when a component is selected
    if (this.selected) {
      this.activeTab = 'properties';
    }
    
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

  _safeStringify(value, space = 2) {
    const seen = new WeakSet();
    
    return JSON.stringify(value, (key, val) => {
      if (typeof val === 'object' && val !== null) {
        if (seen.has(val)) {
          return '[Circular Reference]';
        }
        seen.add(val);
      }
      
      // Handle common non-serializable objects
      if (val instanceof HTMLElement) {
        return `[HTMLElement: ${val.tagName}]`;
      }
      if (val instanceof Event) {
        return `[Event: ${val.type}]`;
      }
      if (typeof val === 'function') {
        return `[Function: ${val.name || 'anonymous'}]`;
      }
      if (val instanceof Node) {
        return `[Node: ${val.nodeName}]`;
      }
      
      return val;
    }, space);
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
    
    let stringifiedValue = '';
    let hasCircularRef = false;
    
    if (isArray || isObject) {
      try {
        stringifiedValue = this._safeStringify(value, 2);
        hasCircularRef = stringifiedValue.includes('[Circular Reference]');
      } catch (e) {
        stringifiedValue = `[Error: ${e.message}]`;
        hasCircularRef = true;
      }
    }
    
    return html`
      <div class="property-group">
        <label class="property-label">
          ${key}
          <span class="property-type">${typeLabel}</span>
          ${hasCircularRef ? html`<span class="circular-warning" title="Contains circular references or non-serializable objects">⚠️</span>` : ''}
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
                  .value=${stringifiedValue}
                  @input=${(e) => this._updateProp(el, key, e.target.value)}
                  placeholder=${isArray 
                    ? "Enter JSON array, e.g. ['item1', 'item2']"
                    : "Enter JSON object, e.g. {'key': 'value'}"
                  }
                  ?readonly=${hasCircularRef}
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

  _renderMainTabContent() {
    switch (this.activeTab) {
      case 'selectors':
        return this._renderSelectorsTab();
      case 'tree':
        return this._renderTreeTab();
      case 'properties':
        return this._renderPropertiesTab();
      default:
        return this._renderSelectorsTab();
    }
  }

  _renderSelectorsTab() {
    return html`
      <div class="selectors-section">
        <div class="selectors-header">
          <h4>🎯 Component Selectors</h4>
          <div class="selectors-info">
            ${this.selectors.length > 0 
              ? html`<span class="selector-count">${this.selectors.length} selector${this.selectors.length > 1 ? 's' : ''}</span>`
              : html`<span class="auto-detected">Auto-detected</span>`
            }
          </div>
        </div>
        
        <div class="selector-input-container">
          <input 
            type="text" 
            class="selector-input"
            placeholder="e.g., my-element, .component, [data-widget]"
            .value=${this.selectors.join(', ')}
            @input=${this._updateSelectors}
            @focus=${this._onSelectorFocus}
            @blur=${this._onSelectorBlur}
          />
          <div class="input-hint">
            💡 Separate multiple selectors with commas
          </div>
        </div>
        
        <!-- Show current selectors as tags -->
        ${this.selectors.length > 0 ? html`
          <div class="selector-tags">
            ${this.selectors.map(selector => html`
              <span class="selector-tag">
                ${selector}
                <button 
                  class="remove-selector" 
                  @click=${() => this._removeSelector(selector)}
                  title="Remove selector"
                >×</button>
              </span>
            `)}
          </div>
        ` : ''}
      </div>
    `;
  }

  _renderTreeTab() {
    return html`
      <div class="component-tree-container">
        <div class="component-tree" @keydown=${this._handleKeyNavigation} tabindex="0">
          ${this._renderComponentTree()}
        </div>
      </div>
    `;
  }

  _renderPropertiesTab() {
    if (!this.selected) {
      return html`
        <div class="empty-state">
          <div class="empty-state-icon">🎯</div>
          <p>Select a component to inspect its properties</p>
        </div>
      `;
    }

    return html`
      <div class="selected-component-details">
        <div class="component-header">
          <h3>${this.selected.tagName.toLowerCase()}</h3>
          <button 
            class="highlight-btn"
            @click=${() => this._highlightSelected()}
            title="Highlight component on page"
          >
            🎯 Highlight
          </button>
        </div>
        <div class="tabs">
          <button 
            class="tab ${this.activeSubTab === 'properties' ? 'active' : ''}"
            @click=${() => this._setSubTab('properties')}
          >
            📋 Properties
          </button>
          <button 
            class="tab ${this.activeSubTab === 'performance' ? 'active' : ''}"
            @click=${() => this._setSubTab('performance')}
          >
            📊 Performance
          </button>
        </div>
        <div class="tab-content">
          ${this._renderSelectedComponentContent()}
        </div>
      </div>
    `;
  }

  _setSubTab(subTab) {
    this.activeSubTab = subTab;
    this.requestUpdate();
  }

  _renderSelectedComponentContent() {
    const subTab = this.activeSubTab || 'properties';
    switch (subTab) {
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
    
    // Don't try to update properties that contain circular references
    if (typeof raw === 'string' && raw.includes('[Circular Reference]')) {
      console.warn(`Cannot update property ${key}: contains circular references`);
      return;
    }
    
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
