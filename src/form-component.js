import { LitElement, css, html } from 'lit';

export class FormComponent extends LitElement {
  static properties = {
    formData: { type: Object },
    isValid: { type: Boolean },
    errorMessage: { type: String },
    submitCount: { type: Number }
  };

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      margin: 1rem 0;
      font-family: sans-serif;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: #333;
    }

    input, select, textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #4CAF50;
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
    }

    button {
      background-color: #4CAF50;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      margin-right: 0.5rem;
    }

    button:hover {
      background-color: #45a049;
    }

    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .error {
      color: #f44336;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .success {
      color: #4CAF50;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-stats {
      margin-top: 1rem;
      padding: 0.5rem;
      background-color: #f5f5f5;
      border-radius: 4px;
      font-size: 0.875rem;
    }
  `;

  constructor() {
    super();
    this.formData = {
      name: '',
      email: '',
      category: 'general',
      message: '',
      newsletter: false,
      preferredDate: ''
    };
    this.isValid = false;
    this.errorMessage = '';
    this.submitCount = 0;
  }

  render() {
    return html`
      <form @submit=${this._handleSubmit}>
        <h3>Contact Form</h3>
        
        <div class="form-group">
          <label for="name">Name:</label>
          <input 
            type="text" 
            id="name" 
            .value=${this.formData.name}
            @input=${this._handleNameChange}
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            .value=${this.formData.email}
            @input=${this._handleEmailChange}
            required
          />
        </div>

        <div class="form-group">
          <label for="category">Category:</label>
          <select 
            id="category" 
            .value=${this.formData.category}
            @change=${this._handleCategoryChange}
          >
            <option value="general">General</option>
            <option value="support">Support</option>
            <option value="sales">Sales</option>
            <option value="feedback">Feedback</option>
          </select>
        </div>

        <div class="form-group">
          <label for="message">Message:</label>
          <textarea 
            id="message" 
            rows="4" 
            .value=${this.formData.message}
            @input=${this._handleMessageChange}
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label for="preferredDate">Preferred Contact Date:</label>
          <input 
            type="date" 
            id="preferredDate" 
            .value=${this.formData.preferredDate}
            @input=${this._handleDateChange}
            min=${new Date().toISOString().split('T')[0]}
          />
        </div>

        <div class="form-group">
          <label>
            <input 
              type="checkbox" 
              .checked=${this.formData.newsletter}
              @change=${this._handleNewsletterChange}
            />
            Subscribe to newsletter
          </label>
        </div>

        <button type="submit" ?disabled=${!this.isValid}>
          Submit (${this.submitCount})
        </button>
        
        <button type="button" @click=${this._clearForm}>
          Clear
        </button>

        ${this.errorMessage ? html`<div class="error">${this.errorMessage}</div>` : ''}
        
        <div class="form-stats">
          <strong>Form Stats:</strong><br>
          Valid: ${this.isValid ? 'Yes' : 'No'}<br>
          Submit Count: ${this.submitCount}<br>
          Newsletter: ${this.formData.newsletter ? 'Yes' : 'No'}<br>
          Preferred Date: ${this.formData.preferredDate || 'Not selected'}
        </div>
      </form>
      <card-component></card-component>
    `;
  }

  _handleNameChange(e) {
    this.formData = { ...this.formData, name: e.target.value };
    this._validateForm();
  }

  _handleEmailChange(e) {
    this.formData = { ...this.formData, email: e.target.value };
    this._validateForm();
  }

  _handleCategoryChange(e) {
    this.formData = { ...this.formData, category: e.target.value };
    this._validateForm();
  }

  _handleMessageChange(e) {
    this.formData = { ...this.formData, message: e.target.value };
    this._validateForm();
  }

  _handleNewsletterChange(e) {
    this.formData = { ...this.formData, newsletter: e.target.checked };
    this._validateForm();
  }

  _handleDateChange(e) {
    this.formData = { ...this.formData, preferredDate: e.target.value };
    this._validateForm();
  }

  _validateForm() {
    const { name, email, message } = this.formData;
    this.isValid = name.trim() !== '' && email.trim() !== '' && message.trim() !== '';
    this.errorMessage = this.isValid ? '' : 'Please fill in all required fields';
  }

  _handleSubmit(e) {
    e.preventDefault();
    if (this.isValid) {
      this.submitCount++;
      this.errorMessage = '';
      console.log('Form submitted:', this.formData);
      // Simulate form submission
      setTimeout(() => {
        this.errorMessage = '';
      }, 2000);
    }
  }

  _clearForm() {
    this.formData = {
      name: '',
      email: '',
      category: 'general',
      message: '',
      newsletter: false,
      preferredDate: ''
    };
    this.isValid = false;
    this.errorMessage = '';
  }
}

window.customElements.define('form-component', FormComponent);
