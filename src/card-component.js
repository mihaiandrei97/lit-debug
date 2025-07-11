import { LitElement, css, html } from 'lit';

export class CardComponent extends LitElement {
  static properties = {
    items: { type: Array },
    title: { type: String },
    maxItems: { type: Number },
    showIds: { type: Boolean },
    filter: { type: String },
    sortOrder: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      margin: 1rem 0;
      font-family: sans-serif;
      background-color: #f9f9f9;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #ddd;
    }

    .card-title {
      font-size: 1.2rem;
      font-weight: bold;
      color: #333;
      margin: 0;
    }

    .item-count {
      font-size: 0.875rem;
      color: #666;
      background-color: #e0e0e0;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
    }

    .controls {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .controls input, .controls select {
      padding: 0.25rem 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .controls button {
      padding: 0.25rem 0.5rem;
      border: 1px solid #4CAF50;
      background-color: #4CAF50;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .controls button:hover {
      background-color: #45a049;
    }

    .controls button.secondary {
      background-color: #f44336;
      border-color: #f44336;
    }

    .controls button.secondary:hover {
      background-color: #da190b;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      background-color: white;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .item:hover {
      background-color: #f0f0f0;
    }

    .item-content {
      flex: 1;
    }

    .item-id {
      font-size: 0.75rem;
      color: #999;
      margin-left: 0.5rem;
    }

    .item-actions {
      display: flex;
      gap: 0.25rem;
    }

    .item-actions button {
      padding: 0.25rem 0.5rem;
      border: none;
      background-color: #f44336;
      color: white;
      border-radius: 3px;
      cursor: pointer;
      font-size: 0.75rem;
    }

    .item-actions button:hover {
      background-color: #da190b;
    }

    .empty-state {
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 2rem;
    }

    .stats {
      margin-top: 1rem;
      padding: 0.5rem;
      background-color: #e8f5e8;
      border-radius: 4px;
      font-size: 0.875rem;
    }
  `;

  constructor() {
    super();
    this.items = [
      'Sample Item 1',
      'Sample Item 2',
      'Sample Item 3'
    ];
    this.title = 'Items Display';
    this.maxItems = 10;
    this.showIds = false;
    this.filter = '';
    this.sortOrder = 'asc';
  }

  render() {
    const filteredItems = this._getFilteredItems();
    const sortedItems = this._getSortedItems(filteredItems);
    const displayItems = sortedItems.slice(0, this.maxItems);

    return html`
      <div class="card-header">
        <h3 class="card-title">${this.title}</h3>
        <span class="item-count">${this.items.length} items</span>
      </div>

      <div class="controls">
        <input 
          type="text" 
          placeholder="Filter items..." 
          .value=${this.filter}
          @input=${this._handleFilterChange}
        />
        <select .value=${this.sortOrder} @change=${this._handleSortChange}>
          <option value="asc">Sort A-Z</option>
          <option value="desc">Sort Z-A</option>
        </select>
        <input 
          type="number" 
          min="1" 
          max="50" 
          .value=${this.maxItems}
          @input=${this._handleMaxItemsChange}
          title="Max items to display"
        />
        <button @click=${this._addRandomItem}>Add Random</button>
        <button @click=${this._toggleIds}>
          ${this.showIds ? 'Hide' : 'Show'} IDs
        </button>
        <button class="secondary" @click=${this._clearItems}>Clear All</button>
      </div>

      <div class="items-list">
        ${displayItems.length > 0 
          ? displayItems.map((item, index) => html`
              <div class="item">
                <div class="item-content">
                  ${item}
                  ${this.showIds ? html`<span class="item-id">#${index}</span>` : ''}
                </div>
                <div class="item-actions">
                  <button @click=${() => this._removeItem(this.items.indexOf(item))}>
                    Remove
                  </button>
                </div>
              </div>
            `)
          : html`<div class="empty-state">No items to display</div>`
        }
      </div>

      <div class="stats">
        <strong>Stats:</strong>
        Total: ${this.items.length} | 
        Filtered: ${filteredItems.length} | 
        Displayed: ${displayItems.length} | 
        Max: ${this.maxItems} | 
        Sort: ${this.sortOrder.toUpperCase()} | 
        Show IDs: ${this.showIds ? 'Yes' : 'No'}
      </div>
    `;
  }

  _getFilteredItems() {
    if (!this.filter.trim()) {
      return this.items;
    }
    return this.items.filter(item => 
      item.toLowerCase().includes(this.filter.toLowerCase())
    );
  }

  _getSortedItems(items) {
    return [...items].sort((a, b) => {
      if (this.sortOrder === 'desc') {
        return b.localeCompare(a);
      }
      return a.localeCompare(b);
    });
  }

  _handleFilterChange(e) {
    this.filter = e.target.value;
  }

  _handleSortChange(e) {
    this.sortOrder = e.target.value;
  }

  _handleMaxItemsChange(e) {
    this.maxItems = parseInt(e.target.value) || 1;
  }

  _addRandomItem() {
    const adjectives = ['Amazing', 'Fantastic', 'Cool', 'Awesome', 'Great', 'Super', 'Wonderful'];
    const nouns = ['Item', 'Thing', 'Object', 'Element', 'Component', 'Widget', 'Gadget'];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 1000);
    
    this.items = [...this.items, `${randomAdjective} ${randomNoun} ${randomNumber}`];
  }

  _removeItem(index) {
    this.items = this.items.filter((_, i) => i !== index);
  }

  _clearItems() {
    this.items = [];
  }

  _toggleIds() {
    this.showIds = !this.showIds;
  }
}

window.customElements.define('card-component', CardComponent);
