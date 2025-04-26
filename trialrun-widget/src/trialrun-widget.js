import { LitElement, html, css } from 'lit';

export class TrialRunWidget extends LitElement {
  static properties = {
    sandboxId: { type: String },
    config: { type: Object },
    messages: { type: Array },
    inputValue: { type: String },
    loading: { type: Boolean },
    error: { type: String },
    mcpTags: { type: Array },
    actionTags: { type: Array },
    selectedMcpTags: { type: Array },
    selectedActionTags: { type: Array },
    // New dimension properties
    playgroundWidth: { type: String },
    playgroundHeight: { type: String },
    cardWidth: { type: String },
    cardHeight: { type: String },
    botMessageOpacity: { type: Number },
    userMessageOpacity: { type: Number },
    buttonOpacity: { type: Number },
    backgroundOpacity: { type: Number }
  };

  constructor() {
    super();
    this.sandboxId = '';
    this.config = null;
    this.messages = [];
    this.inputValue = '';
    this.loading = true;
    this.error = '';
    // Example tags - these would come from config in a real implementation
    this.mcpTags = ['Tag1', 'Tag2', 'Tag3', 'Tag4'];
    this.actionTags = ['Action1', 'Action2', 'Action3', 'Action4'];
    this.selectedMcpTags = [];
    this.selectedActionTags = [];
    // Default dimensions
    this.playgroundWidth = '100%';
    this.playgroundHeight = '100%';
    this.cardWidth = '1200px';
    this.cardHeight = '800px';
    this.botMessageOpacity = 1;
    this.userMessageOpacity = 1;
    this.buttonOpacity = 1;
    this.backgroundOpacity = 1;
  }

  connectedCallback() {
    super.connectedCallback();
    // Get the sandbox ID from the attribute
    this.sandboxId = this.getAttribute('sandbox-id');
    
    // Get dimension attributes
    this.playgroundWidth = this.getAttribute('playground-width') || this.playgroundWidth;
    this.playgroundHeight = this.getAttribute('playground-height') || this.playgroundHeight;
    this.cardWidth = this.getAttribute('card-width') || this.cardWidth;
    this.cardHeight = this.getAttribute('card-height') || this.cardHeight;
    
    if (this.sandboxId) {
      this.fetchConfig();
    }
  }

  async fetchConfig() {
    try {
      this.loading = true;
      const response = await fetch('https://api-rough-bush-2430.fly.dev/handshake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sandbox_id: this.sandboxId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch config: ${response.statusText}`);
      }

      this.config = await response.json();
      this.loading = false;
      
      // Add initial bot message
      this.messages = [
        { 
          role: 'assistant', 
          content: 'Hello! How can I help you today?'
        }
      ];
      
      // If config contains tags, use them
      if (this.config?.mcpTags) {
        this.mcpTags = this.config.mcpTags;
      }
      if (this.config?.actionTags) {
        this.actionTags = this.config.actionTags;
      }
      
      // If config contains customization, use it
      if (this.config?.customization) {
        // Set opacity values explicitly
        this.botMessageOpacity = this.config.customization.botMessageOpacity || 1;
        this.userMessageOpacity = this.config.customization.userMessageOpacity || 1;
        this.buttonOpacity = this.config.customization.buttonOpacity || 1;
        this.backgroundOpacity = this.config.customization.backgroundOpacity || 1;
      }
      
      // If config contains dimensions, use them
      if (this.config?.dimensions) {
        this.playgroundWidth = this.config.dimensions.playgroundWidth || this.playgroundWidth;
        this.playgroundHeight = this.config.dimensions.playgroundHeight || this.playgroundHeight;
        this.cardWidth = this.config.dimensions.cardWidth || this.cardWidth;
        this.cardHeight = this.config.dimensions.cardHeight || this.cardHeight;
      }
    } catch (error) {
      this.error = error.message;
      this.loading = false;
      console.error('Error fetching config:', error);
    }
  }

  async sendMessage() {
    if (!this.inputValue.trim() || !this.config?.base_url) return;
    
    const userMessage = this.inputValue.trim();
    this.messages = [
      ...this.messages,
      { role: 'user', content: userMessage }
    ];
    
    this.inputValue = '';
    this.loading = true;
    
    try {
      const response = await fetch(`${this.config.base_url}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: this.messages,
          sandbox_id: this.sandboxId,
          mcpTags: this.selectedMcpTags,
          actionTags: this.selectedActionTags
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      const data = await response.json();
      this.messages = [
        ...this.messages,
        { role: 'assistant', content: data.response || data.message || 'No response' }
      ];
    } catch (error) {
      console.error('Error sending message:', error);
      this.messages = [
        ...this.messages,
        { role: 'assistant', content: 'Sorry, there was an error processing your request.' }
      ];
    } finally {
      this.loading = false;
    }
  }

  handleInput(e) {
    this.inputValue = e.target.value;
  }

  handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
    }
  }

  toggleMcpTag(tag) {
    if (this.selectedMcpTags.includes(tag)) {
      this.selectedMcpTags = this.selectedMcpTags.filter(t => t !== tag);
    } else {
      this.selectedMcpTags = [...this.selectedMcpTags, tag];
    }
    this.requestUpdate();
  }

  toggleActionTag(tag) {
    if (this.selectedActionTags.includes(tag)) {
      this.selectedActionTags = this.selectedActionTags.filter(t => t !== tag);
    } else {
      this.selectedActionTags = [...this.selectedActionTags, tag];
    }
    this.requestUpdate();
  }

  render() {
    if (!this.sandboxId) {
      return html`<div class="error">Sandbox ID is required</div>`;
    }

    if (this.loading && !this.config) {
      return html`
        <div class="loading-container">
          <div class="loading-spinner"></div>
        </div>
      `;
    }

    const customization = this.config?.customization || {
      botMessageColor: '#4A5568',
      userMessageColor: '#3182CE',
      buttonColor: '#38B2AC',
      backgroundColor: '#1A202C'
    };

    // Apply dynamic dimensions
    const backgroundStyle = {
      backgroundColor: this._hexToRgba(customization.backgroundColor, this.backgroundOpacity),
      width: this.playgroundWidth,
      height: this.playgroundHeight
    };

    const cardStyle = {
      maxWidth: this.cardWidth,
      maxHeight: this.cardHeight
    };

    return html`
      <div class="background" style=${this._styleObjectToString(backgroundStyle)}>
        <div class="chat-card" style=${this._styleObjectToString(cardStyle)}>
          <div class="chat-container">
            <div class="chat-header">
              <div class="chat-title">TrialRun Chat</div>
            </div>
            <div class="chat-messages">
              ${this.messages.map(msg => html`
               <div class="message ${msg.role === 'user' ? 'user-message' : 'bot-message'}"
     style="background-color: ${msg.role === 'user' 
                              ? this._hexToRgba(customization.userMessageColor, this.userMessageOpacity) 
                              : this._hexToRgba(customization.botMessageColor, this.botMessageOpacity)}">
                ${msg.content}
              </div>
              `)}
              ${this.loading ? html`<div class="typing-indicator">Bot is typing...</div>` : ''}
            </div>
            <div class="input-section">
              <div class="input-with-mcps">
                <div class="mcp-section">
                  <div class="tags-label">MCPs</div>
                  <div class="tags-container">
                    ${this.mcpTags.map(tag => html`
                      <div class="tag" 
                           @click=${() => this.toggleMcpTag(tag)}
                           style="background-color: ${customization.buttonColor}">
                        ${tag}
                      </div>
                    `)}
                  </div>
                </div>
                <div class="input-wrapper">
                  <textarea 
                    placeholder="Type your message..." 
                    .value=${this.inputValue}
                    @input=${this.handleInput}
                    @keydown=${this.handleKeyDown}
                    style="background-color: ${customization.userMessageColor}; opacity: 0.8;"
                  ></textarea>
                  <button 
                    @click=${this.sendMessage}
                    style="background-color: ${customization.buttonColor};"
                    class="send-button"
                  >
                    →
                  </button>
                </div>
              </div>
              <div class="action-section">
                <div class="tags-label">Actions</div>
                <div class="action-tags-container">
                  ${this.actionTags.map(tag => html`
                    <div class="tag" 
                         @click=${() => this.toggleActionTag(tag)}
                         style="background-color: ${customization.buttonColor}">
                      ${tag}
                    </div>
                  `)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Helper method to convert a style object to a string
  _styleObjectToString(styleObj) {
    return Object.entries(styleObj)
      .map(([key, value]) => {
        // Convert camelCase to kebab-case
        const kebabKey = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        return `${kebabKey}: ${value}`;
      })
      .join('; ');
  }

  // Helper method to convert hex to rgba
  _hexToRgba(hex, opacity) {
    if (!hex) return 'transparent';
    
    // Remove the hash if it exists
    hex = hex.replace('#', '');
    
    // Parse the hex values
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Return rgba value
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  static styles = css`
    :host {
      --z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      display: block;
    }
    
    .background {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      box-sizing: border-box;
    }
    
    .chat-card {
      background-color: rgba(0, 0, 0, 0.51);
      border-radius: 12px;
      width: 100%;
      height: 100%;
      padding: 0;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      overflow: hidden;
    }
    
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
    
    .chat-header {
      padding: 16px;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .chat-title {
      font-weight: bold;
    }
    
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .message {
      padding: 10px 14px;
      border-radius: 18px;
      max-width: 80%;
      word-break: break-word;
      color: white;
    }
    
    .user-message {
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    
    .bot-message {
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    
    .typing-indicator {
      align-self: flex-start;
      color: rgba(255, 255, 255, 0.7);
      font-style: italic;
      margin-top: 8px;
    }
    
    .input-section {
      padding: 12px;
      display: flex;
      gap: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .input-with-mcps {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 8px;
    }
    
    .mcp-section {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    
    .action-section {
      display: flex;
      flex-direction: column;
      width: 25%;
    }
    
    .tags-label {
      color: white;
      font-weight: bold;
      margin-bottom: 8px;
    }
    
    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 8px;
    }
    
    .action-tags-container {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    
    .tag {
      padding: 4px 8px;
      border-radius: 12px;
      color: white;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .tag:hover {
      opacity: 0.8;
    }
    
    .input-wrapper {
      position: relative;
      display: flex;
      width: 100%;
    }
    
    textarea {
      flex: 1;
      border: none;
      border-radius: 18px;
      padding: 10px 14px;
      padding-right: 40px; /* Make room for the button */
      resize: none;
      height: 40px;
      color: white;
      width: 100%;
    }
    
    .send-button {
      position: absolute;
      right: 5px;
      top: 50%;
      transform: translateY(-50%);
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      cursor: pointer;
      padding: 0;
      font-size: 16px;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
    }
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .error {
      color: red;
      padding: 10px;
      border: 1px solid red;
      border-radius: 4px;
      background-color: rgba(255, 0, 0, 0.1);
    }
    
    /* Responsive styling */
    @media (max-width: 768px) {
      .message {
        max-width: 90%;
      }
      
      .input-section {
        flex-direction: column;
      }
      
      .action-section {
        width: 100%;
        margin-top: 8px;
      }
      
      .action-tags-container {
        flex-direction: row;
        flex-wrap: wrap;
      }
    }
  `;
}

customElements.define('trialrun-widget', TrialRunWidget);
