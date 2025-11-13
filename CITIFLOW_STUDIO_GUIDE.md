# CitiFlow Studio - No-Code ChatBot Builder

## Overview
CitiFlow Studio is a comprehensive no-code platform for building menu-driven banking chatbots. Business users can visually design conversation flows with drag-and-drop components, integrate APIs, and test their chatbots in real-time.

## 🎯 Key Features Built

### 1. **Flow Builder Canvas**
- Visual drag-and-drop interface for building conversation flows
- Node types available:
  - **🏁 Start**: Entry point for your chatbot
  - **💬 Message**: Display text to users
  - **📋 Menu**: Show interactive buttons for user choices
  - **🔌 API Call**: Integrate external banking APIs
  - **🔀 Condition**: Create branching logic based on variables
  - **🛑 End Flow**: Terminate conversations

### 2. **🔌 API Library Tab**
Located in the left panel, this provides:
- **8 Pre-configured Banking APIs** with full documentation:
  - Get User Accounts
  - Get Account Transactions
  - Find Nearest ATMs
  - Transfer Funds
  - Get Credit Card Info
  - Pay Bill
  - Get User Profile
  - Get Exchange Rates

**Features:**
- View API method (GET/POST)
- See endpoint URLs
- Read detailed descriptions
- **View Mock Response Data** - Click "📄 View Mock Response" to see sample data
- **One-Click Integration** - Click "✨ Use This API" to automatically create an API node on the canvas

### 3. **❓ FAQ Section**
Comprehensive help system with 30+ questions organized into 6 categories:

#### Categories:
- **🚀 Getting Started** - Flow basics, screen IDs, initial setup
- **💬 Messages & Menus** - Button creation, variable usage, dynamic buttons
- **🔌 API Integration** - How to integrate, use responses, error handling
- **🔀 Logic & Conditions** - Conditional branching, operators, complex flows
- **🎨 Best Practices** - Button limits, naming conventions, navigation patterns
- **🧪 Testing & Deployment** - Testing flows, exporting JSON, templates

**Features:**
- **Real-time Search** - Type keywords to filter FAQs
- Expandable/collapsible questions
- Context-sensitive help for flow building

### 4. **Live Preview Panel**
- Real-time chatbot testing on the right side
- Interactive chat interface
- Test flows as users would experience them
- Reset conversation anytime
- Shows typing indicators and animations

### 5. **Configuration Panel**
- Node-specific property editing
- API endpoint configuration
- Button management (add/remove/edit)
- Conditional logic setup
- Variable management

## 🚀 How to Use

### Opening the Studio
```bash
# Navigate to the Prototype folder
cd /Users/kalaidhamu/Desktop/KalaiDhamu/LLM/General/LLM_Studio/Prototype

# Open in browser
open citiflow-studio.html
```

### Building Your First Flow

1. **Explore API Library**
   - Click "🔌 APIs" tab in left panel
   - Browse available banking APIs
   - Click "View Mock Response" to see sample data
   - Click "✨ Use This API" to add to canvas

2. **Check FAQs**
   - Click "❓ FAQs" tab
   - Search for topics like "flow", "button", "API"
   - Read best practices

3. **Build the Flow**
   - Return to "📦 Nodes" tab
   - Drag START node to canvas
   - Add MENU nodes for choices
   - Add API nodes for data retrieval
   - Add MESSAGE nodes to display results
   - Connect them using Screen IDs

4. **Configure Nodes**
   - Click any node to select it
   - Configure properties in right panel
   - Set Screen IDs (e.g., "welcome_screen")
   - Add buttons with navigation targets
   - Set API success/error paths

5. **Test Your Flow**
   - Click "🚀 Deploy Flow" in header
   - Interact with chatbot in preview panel
   - Click buttons and test navigation
   - Use "Reset Conversation" to restart

6. **Export**
   - Click "💾 Export JSON" to download
   - Share with developers for deployment

## 📊 Pre-built Templates

The studio includes ready-to-use templates:

### 1. Check Account Balance Flow
Complete banking flow demonstrating:
- Welcome screen with menu options
- API integration to fetch accounts
- Dynamic button generation from API data
- Variable substitution in messages
- Error handling screens
- Navigation back to main menu

### 2. Welcome Flow
Simple starter template showing:
- Basic greeting
- Menu navigation
- End screen

## 🎨 UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│  CitiFlow Studio Header                                      │
│  [Load Template] [Export JSON] [Deploy Flow]                │
├──────────┬────────────────────────┬─────────────────────────┤
│ Left     │  Canvas Area          │  Right Panel            │
│ Panel    │                       │                         │
│          │                       │  - Config Panel         │
│ 📦 Nodes │  [Drag & Drop        │  - Node Properties      │
│ 🔌 APIs  │   Flow Builder]      │                         │
│ ❓ FAQs  │                       │  OR                     │
│          │                       │                         │
│          │                       │  - Live Preview         │
│          │                       │  - Chat Interface       │
└──────────┴────────────────────────┴─────────────────────────┘
```

## 💡 Business User Benefits

### No Technical Skills Required
- Visual interface - no coding needed
- Pre-built components
- Ready-to-use API integrations
- Comprehensive help system

### Rapid Prototyping
- Build flows in minutes
- Test immediately
- Iterate quickly
- Export for production

### API Discovery Made Easy
- Browse available APIs
- See example responses
- Understand data structures
- One-click integration

### Self-Service Learning
- Searchable FAQ system
- Context-sensitive help
- Best practices included
- Template examples

## 🔧 Technical Details

### Mock API Data
All APIs return realistic mock data for testing:
- Account balances
- Transaction histories
- ATM locations
- Transfer confirmations
- Credit card details
- User profiles
- Exchange rates

### JSON Export Format
Exports standard CitiFlow configuration:
```json
{
  "start_screen_id": "welcome_screen",
  "screens": {
    "welcome_screen": {
      "type": "MESSAGE_SCREEN",
      "message_text": "Welcome!",
      "buttons": [...]
    }
  }
}
```

### Variable System
- Store API responses: `{{api_response.field}}`
- Dynamic button data: `{{item.property}}`
- User selections: `{{selected_account}}`
- Used in messages and conditions

## 📝 Example Flow Scenarios

### 1. Account Balance Check
```
Start → Welcome Menu → API: Get Accounts → 
Select Account → Show Balance → Main Menu
```

### 2. Find ATM
```
Start → Welcome Menu → API: Find ATMs → 
Show ATM List → Get Directions → Main Menu
```

### 3. Fund Transfer
```
Start → Welcome Menu → API: Get Accounts → 
Select From Account → Select To Account → 
Enter Amount → API: Transfer → Confirmation → Main Menu
```

### 4. Transaction History
```
Start → Welcome Menu → API: Get Accounts → 
Select Account → API: Get Transactions → 
Show Transactions → Filter Options → Main Menu
```

## 🎓 Learning Path for Business Users

### Beginner (15 minutes)
1. Load a template to see how flows work
2. Click through the FAQ sections
3. Test the flow in Live Preview
4. Try modifying button labels

### Intermediate (30 minutes)
1. Explore API Library
2. Create a simple 3-screen flow
3. Add an API call node
4. Configure success/error paths
5. Test and export

### Advanced (1 hour)
1. Build a complete banking flow
2. Use dynamic buttons with API data
3. Add conditional branches
4. Implement error handling
5. Create reusable navigation patterns

## 🚀 Next Steps

The current implementation focuses on flow building. Future enhancements could include:
- User authentication/login
- Dashboard for managing multiple flows
- Analytics and usage tracking
- Version control for flows
- Multi-language support
- Custom branding options
- Integration with real APIs
- Role-based access control

## 📞 Support

Use the built-in FAQ system (❓ tab) for immediate help on:
- Flow building concepts
- API integration
- Best practices
- Testing and deployment

## 🎉 Getting Started Now

1. Open `citiflow-studio.html` in your browser
2. Click "📋 Load Template" to see an example
3. Explore the "🔌 APIs" tab to see available integrations
4. Check "❓ FAQs" for any questions
5. Start building your own flow!

---

**Built for business users to create sophisticated banking chatbots without writing code.**

