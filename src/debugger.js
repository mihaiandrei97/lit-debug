import { LitElement, html, css } from 'lit';

class LitDebugger extends LitElement {
  static properties = {
    target: { type: Object },
    selected: { type: Object },
    components: { type: Array },
  };

  static styles = css`
    :host {
      display: flex;
      border: 1px solid #ccc;
      font-family: sans-serif;
      font-size: 14px;
      width: 100%;
    }
    .host {
      flex: 1;
      padding: 1rem;
    }
    .debugger {
      width: 300px;
      background: #f8f8f8;
      border-left: 1px solid #ccc;
      display: flex;
      flex-direction: column;
    }
    .component-list {
      border-bottom: 1px solid #ddd;
      max-height: 200px;
      overflow-y: auto;
    }
    .component-list button {
      display: block;
      width: 100%;
      padding: 0.5rem;
      text-align: left;
      background: none;
      border: none;
      border-bottom: 1px dashed #ccc;
      cursor: pointer;
    }
    .component-list button:hover {
      background: #eee;
    }
    .details {
      padding: 1rem;
      overflow-y: auto;
      flex: 1;
    }
    label {
      display: block;
      margin: 0.5rem 0;
    }
    input, textarea {
      width: 100%;
      box-sizing: border-box;
      font-family: monospace;
      font-size: 12px;
    }
    textarea {
      resize: vertical;
      min-height: 60px;
    }
  `;

  constructor() {
    super();
    this.target = null;
    this.selected = null;
    this.components = [];
  }

  render() {
    console.log('Rendering LitDebugger', this.target, this.selected, this.components);
    return html`
      <div class="host">
        <slot @slotchange=${this._onSlotChange}></slot>
      </div>
      <div class="debugger">
        <div class="component-list">
          ${this.components.map(
            (el, i) => html`
              <button @click=${() => this._select(el)}>
                ${el.tagName.toLowerCase()} ${el.id ? `#${el.id}` : ''}
              </button>
            `
          )}
        </div>
        <div class="details">
          ${this.selected
            ? html`
                <h3>${this.selected.tagName.toLowerCase()}</h3>
                ${this._renderProps(this.selected)}
              `
            : html`<em>Select a component</em>`}
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
    
    return html`
      <label>
        ${key} ${isArray ? '(Array)' : ''}
        ${isArray 
          ? html`
              <textarea
                rows="4"
                .value=${JSON.stringify(value, null, 2)}
                @input=${(e) => this._updateProp(el, key, e.target.value)}
                placeholder="Enter JSON array, e.g. ['item1', 'item2']"
              ></textarea>
            `
          : html`
              <input
                .value=${String(value)}
                @input=${(e) => this._updateProp(el, key, e.target.value)}
              />
            `
        }
      </label>
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

  _onPropertyChanged(e) {
    // Force re-render when properties change
    this.requestUpdate();
  }

  _updateProp(el, key, raw) {
    const old = el[key];
    let val = raw;
    
    if (Array.isArray(old)) {
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
    } else if (typeof old === 'number') {
      val = parseFloat(raw);
    } else if (typeof old === 'boolean') {
      val = raw === 'true';
    }
    
    el[key] = val;
  }
}

window.customElements.define('lit-debugger', LitDebugger);
