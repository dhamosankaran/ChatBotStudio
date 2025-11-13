# Devin.AI Prompt - CitiFlow Studio

## 🚀 **QUICK START (Recommended for Devin.AI)**

```bash
# Use React + Vite for 40% faster development!
npm create vite@latest citiflow-studio -- --template react
cd citiflow-studio
npm install reactflow framer-motion zustand lucide-react
npm install -D tailwindcss autoprefixer postcss
npx tailwindcss init -p
npm run dev
```

**Why React + Vite:**
- ⚡ **8-10 hours** vs 15-20 hours (vanilla JS)
- 🎯 **React Flow** provides flow builder for FREE (saves 6-8 hours!)
- 🎨 **Framer Motion** = animations in 1 line vs 20 lines
- 🤖 **Devin.AI excels** at React development
- 📦 **Production-ready** immediately

**See TECH_STACK_RECOMMENDATIONS.md for detailed comparison of all options.**

---

## 🎯 Project Overview Prompt

```
Create "CitiFlow Studio" - an enterprise-grade, no-code chatbot builder platform for financial institutions.

PROJECT NAME: CitiFlow Studio - Enterprise Chatbot Builder Platform

TECH STACK (RECOMMENDED): ⭐ React + Vite + React Flow
- React 18 (component-based architecture)
- Vite (lightning-fast build tool)
- React Flow (visual flow builder - saves 6-8 hours!)
- Framer Motion (smooth animations)
- Tailwind CSS (rapid styling)
- Zustand (simple state management)
- shadcn/ui (professional UI components)
- Lucide React (icons)

ALTERNATIVE TECH STACK: Vanilla JavaScript
- Pure HTML5, CSS3, JavaScript (ES6+)
- No frameworks - vanilla JavaScript only
- Static files served via simple HTTP server
- More verbose, takes 40% longer (15-20 hours vs 8-10 hours)

JSON-BASED FLOW CONFIGURATION:
- JSON templates for chatbot flows
- Mock API integration via local JSON files
- Template catalog system

CORE REQUIREMENTS:
Build a visual, drag-and-drop chatbot builder where business users can create conversational banking flows without coding.

WHY REACT + VITE:
✅ React Flow provides 70% of canvas functionality for FREE
✅ Devin.AI is exceptionally proficient at React
✅ Framer Motion simplifies animations (1 line vs 20)
✅ Tailwind CSS speeds up styling by 3x
✅ Component reusability accelerates development
✅ 40% faster development time (8-10 hrs vs 15-20 hrs)
✅ Still production-ready and maintainable
```

---

## 📋 Phase 1: Core Platform Setup

### Prompt 1.1 - Project Structure (React + Vite)
```
RECOMMENDED: Create React + Vite project:

npm create vite@latest citiflow-studio -- --template react
cd citiflow-studio
npm install reactflow framer-motion zustand lucide-react clsx tailwind-merge
npm install -D tailwindcss autoprefixer postcss
npx tailwindcss init -p

PROJECT STRUCTURE:
citiflow-studio/
├── src/
│   ├── components/
│   │   ├── flow/
│   │   │   ├── FlowCanvas.jsx (React Flow wrapper)
│   │   │   ├── nodes/ (START, MENU, API, CONDITIONAL, END)
│   │   │   └── ConfigPanel.jsx
│   │   ├── chat/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── BotMessage.jsx (with animations)
│   │   │   ├── UserMessage.jsx
│   │   │   ├── QuickReplies.jsx
│   │   │   └── TypingIndicator.jsx
│   │   ├── templates/
│   │   │   ├── TemplateModal.jsx
│   │   │   └── TemplateCard.jsx
│   │   ├── master-builder/
│   │   │   └── MasterBuilderWizard.jsx
│   │   └── ui/ (shadcn components)
│   ├── hooks/
│   │   ├── useChatFlow.js
│   │   ├── useVariables.js
│   │   └── useTemplates.js
│   ├── store/
│   │   ├── chatStore.js (Zustand)
│   │   └── flowStore.js
│   ├── lib/
│   │   ├── flow-engine.js
│   │   ├── template-merger.js
│   │   └── variable-substitution.js
│   ├── data/
│   │   ├── templates/ (JSON flow templates)
│   │   │   ├── catalog.json
│   │   │   ├── card_replacement.json
│   │   │   └── [20+ more templates]
│   │   └── mocks/ (mock API responses)
│   │       ├── mock_accounts.json
│   │       ├── mock_credit_cards.json
│   │       └── [5+ more mocks]
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md

ALTERNATIVE (Vanilla JS):
CitiFlowStudio/
├── index.html
├── app.js
├── styles.css
├── templates/
└── mocks/

Run with: npm run dev (React) or python3 -m http.server (Vanilla)
```

### Prompt 1.2 - UI Layout (React Components)
```
Create a professional 3-panel layout using React components:

RECOMMENDED APPROACH (React):
// App.jsx
import { FlowCanvas } from './components/flow/FlowCanvas';
import { ChatPreview } from './components/chat/ChatPreview';
import { Toolbar } from './components/Toolbar';
import { TabSwitcher } from './components/TabSwitcher';

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Toolbar />
      <TabSwitcher />
      <div className="flex flex-1">
        <FlowCanvas className="w-[30%]" />
        <ConfigPanel className="w-[30%]" />
        <ChatPreview className="w-[40%]" />
      </div>
    </div>
  );
}

LAYOUT PANELS:

LEFT PANEL (30% width) - FlowCanvas.jsx:
- React Flow component with drag-and-drop nodes
- Custom node types: START, MESSAGE, MENU, API_CALL, CONDITIONAL, END
- Visual connections between nodes (automatic with React Flow)
- Click nodes to show config panel
- Zoom/pan controls (built into React Flow)

CENTER PANEL (30% width) - ConfigPanel.jsx:
- Dynamic configuration forms based on selected node
- Conditional rendering for each node type
- Form inputs with validation
- Helper text and placeholders

RIGHT PANEL (40% width) - ChatPreview.jsx:
- ChatWindow component with header
- ChatMessages with Framer Motion animations
- TypingIndicator component
- QuickReplies component
- ChatInput component

TOP TOOLBAR - Toolbar.jsx:
- Buttons using shadcn/ui Button component
- Icons from Lucide React
- Actions:
  * Load Template (opens TemplateModal)
  * Build Unified Bot (opens MasterBuilderWizard)
  * Export JSON
  * Import JSON
  * Deploy & Test Flow
  * Help (?)

TAB SWITCHER:
- Flow Builder | JSON Configuration tabs
- Conditional rendering of views

COLOR SCHEME (Tailwind Config):
- Primary: #667eea (purple-500)
- Secondary: #764ba2 (purple-700)
- Background: gradient-to-br from-purple-500 to-purple-700
- Chat Header: #003D6D (blue-900)
- Bot Bubbles: white
- User Bubbles: blue-500 (#007AFF)

Use Tailwind utility classes for all styling.

ALTERNATIVE (Vanilla JS):
Create similar layout with HTML divs and CSS Grid/Flexbox
(Takes longer, more verbose code)
```

---

## 📋 Phase 2: Flow Builder Canvas

### Prompt 2.1 - Canvas Implementation (React Flow)
```
RECOMMENDED: Use React Flow library for visual flow builder:

npm install reactflow

IMPLEMENTATION:
// components/flow/FlowCanvas.jsx
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import { useFlowStore } from '@/store/flowStore';
import StartNode from './nodes/StartNode';
import MessageNode from './nodes/MessageNode';
import MenuNode from './nodes/MenuNode';
import APINode from './nodes/APINode';
import ConditionalNode from './nodes/ConditionalNode';
import EndNode from './nodes/EndNode';
import 'reactflow/dist/style.css';

const nodeTypes = {
  start: StartNode,
  message: MessageNode,
  menu: MenuNode,
  api: APINode,
  conditional: ConditionalNode,
  end: EndNode
};

export function FlowCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useFlowStore();
  
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
}

CUSTOM NODE COMPONENTS:
Create 6 custom node types with distinct styling:

// components/flow/nodes/StartNode.jsx
import { Handle, Position } from 'reactflow';

export default function StartNode({ data }) {
  return (
    <div className="px-6 py-3 rounded-full bg-green-500 text-white 
                    shadow-lg border-2 border-green-600">
      <div className="flex items-center gap-2">
        <span className="text-xl">🏁</span>
        <span className="font-semibold">START</span>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

Create similar components for:
- MessageNode: Blue background
- MenuNode: Purple background
- APINode: Orange background
- ConditionalNode: Yellow background
- EndNode: Red background

Each node should:
- Display screen_id from data.config.screen_id
- Show type-specific icon
- Have input/output handles (React Flow)
- Be clickable to show config panel
- Have delete button overlay on hover

FEATURES (Built into React Flow):
✅ Drag to reposition (automatic)
✅ Connection lines (automatic)
✅ Zoom/pan (automatic)
✅ Connection editing (automatic)
✅ Visual feedback (automatic)

YOU ONLY NEED TO:
- Create custom node components (6 files)
- Style nodes with Tailwind
- Handle onClick to show config
- Manage state with Zustand

ALTERNATIVE (Vanilla JS):
Build custom canvas with manual:
- SVG drawing (~300 lines)
- Drag-drop logic (~200 lines)
- Connection algorithm (~200 lines)
- Zoom/pan (~100 lines)
Total: ~800 lines vs ~100 lines with React Flow!
```

### Prompt 2.2 - Node Configuration Panel
```
Create a dynamic configuration panel that appears when a node is clicked:

MENU NODE CONFIG:
- Screen ID (text input)
- Message Text (textarea with variable support {{variable}})
- Buttons array:
  * Add/remove buttons
  * Button label
  * Go to screen dropdown (populated from other nodes)
  * Set variable option
  * Set value option

API_CALL NODE CONFIG:
- Screen ID
- API endpoint URL
- HTTP method (GET/POST/PUT/DELETE)
- Mock file path (for testing)
- Save response to variable
- On success → screen dropdown
- On error → screen dropdown

CONDITIONAL NODE CONFIG:
- Variable to check
- Operator (equals, exists, greater_than, less_than)
- Value to compare
- If true → go to screen
- If false → go to screen

MESSAGE NODE CONFIG:
- Screen ID
- Message text (with variable substitution)
- Go to screen (optional)
- Input field option (text/number)

Implement helper text and placeholders for each field.
```

---

## 📋 Phase 3: Chat Preview & Flow Execution

### Prompt 3.1 - Chat Interface
```
Build a professional banking chat interface with:

DESIGN (match modern banking apps):
- Header: Dark blue (#003D6D)
  * Back arrow (left)
  * Bot avatar (center): "citi" logo with green status dot
  * Bot name: "Citi® Bot"
  * Status: "Connected" (green)
  * Menu icon (right)

- Messages:
  * Bot messages: White bubbles, left-aligned, with purple robot avatar
  * User messages: Blue bubbles (#007AFF), right-aligned
  * Timestamps: Below each message
  * Smooth slide-in animations

- Quick Replies:
  * Grid layout (responsive)
  * White background, subtle shadow
  * Hover effects (scale + shadow)
  * "See More" pagination for 5+ buttons

- Input:
  * Bottom bar: "Write a message..." placeholder
  * Send button: Blue circle with up arrow icon
  * Clean, modern styling

ANIMATIONS:
- Typing indicator (three animated dots)
- Bubble slide-in from left/right
- Typewriter effect (word-by-word reveal)
- Progressive reveal for multi-section messages
- Quick reply fade-in after message completes
```

### Prompt 3.2 - Flow Execution Engine
```
Implement the chatbot flow execution engine:

CORE LOGIC:
1. Load flow JSON configuration
2. Start from start_screen_id
3. Render screens based on type:
   - MESSAGE: Show message + optional buttons
   - MENU: Show message + buttons
   - API_CALL: Show loading → call mock API → navigate based on response
   - CONDITIONAL: Evaluate condition → navigate to true/false screen
   - END_SCREEN: Show message + smart quick replies

4. Variable System:
   - Store variables in chatState.variables
   - Support nested access ({{user.name}}, {{selected_card.balance}})
   - Substitute {{variables}} in messages
   - Set variables from button clicks (set_variable, set_value)
   - Set variables from API responses (save_response_to)

5. Dynamic Buttons:
   - Generate buttons from API response data
   - Use label_template with {{property}} substitution
   - Support setVariable for storing selected item
   - Navigate to specified screen

6. API Integration:
   - Fetch mock data from /mocks/*.json
   - Parse response and save to variables
   - Handle success/error paths
   - Show loading indicator

TIMING:
- Typing indicator: Show for min(800ms, wordCount * 30ms)
- Message reveal: Progressive (150ms per section) or word-by-word (50ms per word)
- Quick replies: Appear after message + animation completes
- Smooth delays between bot actions
```

---

## 📋 Phase 4: Template System

### Prompt 4.1 - Template Catalog
```
Create a comprehensive template catalog system:

FILE: templates/catalog.json

STRUCTURE:
{
  "version": "1.0.0",
  "total_templates": 20+,
  "categories": {
    "credit_cards": {
      "name": "Credit Card Services",
      "icon": "💳",
      "templates": [
        {
          "id": "card_replacement",
          "file": "card_replacement.json",
          "name": "Card Replacement",
          "description": "Replace lost, stolen, or damaged cards",
          "complexity": "medium",
          "estimated_screens": 11,
          "apis_used": ["get_cards", "replace_card"],
          "features": ["Dynamic card selection", "Reason codes", "Address verification"]
        }
        // ... more templates
      ]
    },
    "retail_banking": { ... },
    "getting_started": { ... }
  }
}

TEMPLATE MODAL:
- Show categories (Credit Cards, Banking, Getting Started)
- Display templates as cards with:
  * Icon
  * Name
  * Description
  * Complexity badge (low/medium/high)
  * Screen count
  * Estimated time
  * Features list
- Click to load template into canvas
- Search/filter functionality
```

### Prompt 4.2 - Individual Templates
```
Create 20+ production-ready banking flow templates:

TEMPLATE STRUCTURE:
{
  "start_screen_id": "screen_name",
  "screens": {
    "screen_name": {
      "screen_id": "screen_name",
      "type": "MENU|MESSAGE|API_CALL|CONDITIONAL",
      "message_text": "Text with {{variable}} support",
      "buttons": [],
      "dynamic_buttons": {},
      "api_call": {},
      "condition": {},
      "go_to_screen_id": "next_screen"
    }
  }
}

REQUIRED TEMPLATES:
1. card_replacement.json - Replace lost/stolen/damaged cards
2. check_card_balance.json - View card balance and payment info
3. recent_transactions.json - Display recent card transactions
4. dispute_transaction.json - Report unauthorized charges (conversational)
5. fund_transfer.json - Transfer between accounts
6. bill_payment.json - Pay bills to payees
7. loan_application.json - Apply for personal loan
8. autopay_setup.json - Set up automatic payments
9. wire_transfer.json - Domestic/international wires
10. beneficiary_management.json - Add/edit/delete beneficiaries
11. check_deposit.json - Mobile check deposit
12. statement_download.json - View/download statements
13. rewards_redemption.json - Redeem points
14. credit_limit_increase.json - Request limit increase
15. balance_transfer.json - Transfer balance from other cards
16. card_activation.json - Activate new card
17. stop_payment.json - Stop payment on check
18. account_opening.json - Open new account
19. view_card_statements.json - View card statements
20. credit_card_payment.json - Make card payment

Each template must:
- Be production-ready (no placeholders)
- Include error handling
- Support variable substitution
- Have clear navigation paths
- Include realistic scenarios
- NO EMOJIS in bot messages (professional banking tone)
```

---

## 📋 Phase 5: Master Template Builder (Unified Bot)

### Prompt 5.1 - Unified Bot Generator
```
Implement "Build Unified Bot" feature - a wizard that merges multiple templates into one comprehensive banking assistant:

WIZARD STEPS:
1. Select Categories (Credit Cards, Banking, Quick Services)
2. Choose Specific Templates from selected categories
3. Configure Bot (name, welcome message, menu organization)
4. Review & Generate

MENU ORGANIZATION OPTIONS:
- By Category (hierarchical): Main Menu → Category Menus → Services
- Flat List: All services in one menu

TEMPLATE MERGING LOGIC:
1. Prefix all screen IDs: templateId_screenId
   Example: card_replacement_select_card

2. Update all references:
   - screen.go_to_screen_id
   - button.go_to_screen_id
   - dynamic_buttons.go_to_screen_id
   - api_call.on_success / on_error
   - condition.go_to_screen_id

3. Create navigation structure:
   - main_menu screen
   - category_menu screens (if hierarchical)
   - support_screen

4. Add return navigation:
   - Success screens → "Back to Services" + "Main Menu"
   - Error screens → retry options + "Main Menu"
   - End screens → show smart quick replies

5. Handle conflicts:
   - Prefix variable names if needed
   - Deep copy all screen objects
   - Preserve API mock file paths
   - Maintain button order

SMART QUICK REPLIES:
After completing a task, show:
- 3 related services from same category (excluding just-completed)
- "Explore Other Services" (back to main menu)
- "Done" (graceful exit)

Exclude the service just used to avoid repetition.
```

---

## 📋 Phase 6: Professional Banking UX

### Prompt 6.1 - Animation & Polish (Framer Motion)
```
RECOMMENDED: Use Framer Motion for all animations:

npm install framer-motion

MESSAGE ANIMATIONS:

1. Typing Indicator Component:
// components/chat/TypingIndicator.jsx
import { motion } from 'framer-motion';

export function TypingIndicator() {
  return (
    <div className="flex gap-3 items-start">
      <Avatar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl px-4 py-3 flex gap-1"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

2. Bot Message with Slide-In:
// components/chat/BotMessage.jsx
import { motion } from 'framer-motion';

export function BotMessage({ text }) {
  const [showTyping, setShowTyping] = useState(true);
  
  useEffect(() => {
    const delay = Math.min(800, text.split(' ').length * 30);
    setTimeout(() => setShowTyping(false), delay);
  }, [text]);
  
  return (
    <>
      {showTyping && <TypingIndicator />}
      {!showTyping && (
        <motion.div
          initial={{ opacity: 0, x: -20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex gap-3 items-start"
        >
          <Avatar />
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <TypewriterText text={text} />
          </div>
        </motion.div>
      )}
    </>
  );
}

3. Typewriter Effect:
// components/chat/TypewriterText.jsx
export function TypewriterText({ text }) {
  const words = text.split(' ');
  
  return (
    <div>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          {word}{' '}
        </motion.span>
      ))}
    </div>
  );
}

4. Quick Replies with Stagger:
// components/chat/QuickReplies.jsx
import { motion } from 'framer-motion';

export function QuickReplies({ buttons }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: { staggerChildren: 0.1 }
        }
      }}
      className="grid grid-cols-2 gap-2 mt-3"
    >
      {buttons.map((btn, i) => (
        <motion.button
          key={i}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 }
          }}
          className="bg-white rounded-lg px-4 py-2 shadow hover:shadow-lg 
                     transition-shadow"
          onClick={() => handleClick(btn)}
        >
          {btn.label}
        </motion.button>
      ))}
    </motion.div>
  );
}

FORMATTING:
- Support markdown **bold** with react-markdown or manual parsing
- Use Tailwind for spacing and layout
- Responsive grid for financial data
- Clean component composition

ALTERNATIVE (Vanilla JS):
Write CSS keyframes manually:
@keyframes slideIn { ... } (20+ lines per animation)
Calculate delays with setTimeout (complex timing logic)
Total: 200+ lines of animation code vs 20 lines with Framer Motion!
```

### Prompt 6.2 - Build Assist Button
```
Create a prominent "Build Assist" floating button:

DESIGN:
- Position: Fixed bottom-right (30px from edges)
- Shape: Rounded pill (50px border-radius)
- Background: Linear gradient purple-to-pink (#667eea → #764ba2)
- Size: Auto height (~60px), auto width

CONTENT:
- Icon: SVG chat bubble (white) in circular background
- Primary text: "Build Assist" (bold, 15px)
- Secondary text: "AI HELPER" (uppercase, 11px)
- Layout: Horizontal flex with icon left, text right

ANIMATIONS:
- Gentle pulse effect on icon (2s infinite)
- Hover: Lift 4px + stronger shadow
- Multi-layer shadows for depth
- Smooth 300ms transitions

BEHAVIOR:
- Click to open Build Assist chat panel
- Show only in Flow Builder tab
- Hide in JSON tab and Deploy & Test view
- Z-index: 1000 (always on top)
```

---

## 📋 Phase 7: API Integration & Mocks

### Prompt 7.1 - Mock Data Files
```
Create realistic mock data files:

mocks/mock_credit_cards.json:
{
  "status": "success",
  "cards": [
    {
      "card_id": "cc_001",
      "name": "Citi Double Cash Card",
      "last_four": "4532",
      "balance": 1245.67,
      "available_credit": 8754.33,
      "credit_limit": 10000,
      "minimum_payment": 35.00,
      "payment_due_date": "2025-11-28",
      "status": "active"
    },
    {
      "card_id": "cc_002",
      "name": "Citi Premier Card",
      "last_four": "1234",
      "balance": 2450.00,
      "available_credit": 7550.00,
      "credit_limit": 10000,
      "minimum_payment": 50.00,
      "payment_due_date": "2025-11-25",
      "status": "active"
    }
  ]
}

Create similar comprehensive mock data for:
- Accounts (checking, savings, investment)
- Transactions (recent card/account activity)
- Beneficiaries (saved payment recipients)
- Rewards (points balance, redemption options)
- Statements (monthly statements list)
```

### Prompt 7.2 - API Call Handler
```
Implement async API call handler with mock support:

FEATURES:
- Show loading indicator with animated spinner
- Fetch from mock_file if specified, otherwise use URL
- Parse response and save to chatState.variables
- Support nested path saving (save_response_to: "cards.data")
- Navigate to on_success or on_error screen
- Error handling with user-friendly messages
- Timeout handling (5 second max)

EXAMPLE:
{
  "type": "API_CALL",
  "api_call": {
    "url": "https://api.bank.com/v1/cards",
    "method": "GET",
    "mock_file": "mocks/mock_credit_cards.json",
    "save_response_to": "cards"
  },
  "on_success": "select_card",
  "on_error": "api_error"
}
```

---

## 📋 Phase 8: Template Examples

### Prompt 8.1 - Card Replacement Flow
```
Create card_replacement.json template:

FLOW:
1. Get Cards (API) → 2. Select Card (dynamic buttons) → 3. Select Reason (Lost/Stolen/Damaged) → 4. Confirm Address → 5. Confirm Replacement → 6. Process (API) → 7. Success

FEATURES:
- Dynamic card selection from API
- Reason tracking (set_variable: "reason")
- Variable substitution in confirmation
- Address verification
- Success with confirmation number
- Error handling

PROFESSIONAL TONE:
- No emojis
- Clear, concise messages
- Banking-appropriate language
- Helpful instructions
```

### Prompt 8.2 - Dispute Transaction Flow
```
Create dispute_transaction.json template - make it CONVERSATIONAL and production-ready:

FLOW:
1. Get Cards (API)
2. Select Card (dynamic)
3. Get Transactions (API)
4. Select Transaction OR Describe via text input
5. Select Dispute Reason (unauthorized/wrong amount/not received/duplicate/cancelled)
6. Branch based on reason:
   - Unauthorized → Offer card blocking + replacement
   - Wrong amount → Ask for correct amount
   - Not received → Ask for delivery tracking
   - Duplicate → Identify original charge
   - Cancelled → Verify cancellation date
7. Collect details via text input
8. Review dispute summary
9. Submit (API)
10. Success with case number + next steps

KEY FEATURES:
- Empathetic messaging
- Conversational text input for descriptions
- Dynamic branching logic
- Fraud protection (card blocking)
- Temporary credit mentions
- Documentation upload instructions
- Clear next steps
```

---

## 📋 Phase 9: Advanced Features

### Prompt 9.1 - Variable Substitution
```
Implement comprehensive variable substitution system:

SUPPORT:
- Simple variables: {{card_name}}
- Nested variables: {{selected_card.balance}}
- API response data: {{api_response.confirmation_number}}
- Array access: {{cards.cards[0].name}}
- Default values: {{variable || 'default'}}

IMPLEMENTATION:
function substituteVariables(text) {
  return text.replace(/\{\{([^}]+)\}\}/g, (match, varPath) => {
    const value = getNestedValue(chatState.variables, varPath.trim());
    return value !== undefined ? value : match;
  });
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, prop) => {
    return current ? current[prop] : undefined;
  }, obj);
}

VARIABLE SOURCES:
- Button clicks (set_variable + set_value)
- API responses (save_response_to)
- User input (text/number fields)
- Dynamic button selection (set_variable from item)
```

### Prompt 9.2 - Build Assist AI Chat
```
Implement Build Assist - an AI helper that guides users:

FEATURES:
- Chat-based interface (similar to main chat)
- Provides step-by-step instructions
- Example: "Help me build a card replacement flow"
- Pre-programmed responses for common flows
- Code snippets and JSON examples
- Best practices and tips

RESPONSES TO SUPPORT:
- How to create different node types
- How to use variables
- How to connect API calls
- How to add dynamic buttons
- How to handle conditions
- Best practices for button limits
- Navigation patterns
- Error handling strategies

Keep responses concise, actionable, and include examples.
```

---

## 📋 Phase 10: Export & Deployment

### Prompt 10.1 - JSON Export/Import
```
Implement JSON export and import functionality:

EXPORT:
- Generate clean JSON from canvas nodes
- Include all screens with proper structure
- Validate before export
- Download as .json file
- Pretty-print with 2-space indentation

IMPORT:
- Upload .json file
- Validate structure (start_screen_id, screens object)
- Load into canvas with visual layout
- Auto-detect node types
- Position nodes in grid pattern
- Show success/error toast

VALIDATION:
- Check for start_screen_id
- Verify all screen references exist
- Validate button go_to_screen_id references
- Check API call structure
- Ensure no circular references
```

### Prompt 10.2 - Deploy & Test
```
Implement "Deploy & Test Flow" feature:

FUNCTIONALITY:
1. Click "Deploy & Test Flow" button
2. Generate JSON from current canvas
3. Validate flow configuration
4. Store in chatState.flowConfig
5. Reset chat and start from beginning
6. Switch to preview mode
7. Execute flow in live chat preview

ERROR HANDLING:
- If no nodes: Show helpful message
- If missing start node: Prompt to add
- If invalid connections: Highlight errors
- If missing screen IDs: Auto-generate or warn

TESTING FEATURES:
- Reset chat button
- Variable inspector (show chatState.variables)
- Step-by-step mode (optional)
- Console logging for debugging
```

---

## 📋 Phase 11: Professional Banking Design

### Prompt 11.1 - Design System
```
Implement a professional banking design system:

COLORS:
Primary Gradient: #667eea → #764ba2
Chat Header: #003D6D (banking blue)
Bot Bubbles: #FFFFFF (white)
User Bubbles: #007AFF (iOS blue)
Success: #28a745 (green)
Error: #dc3545 (red)
Warning: #ffc107 (amber)

TYPOGRAPHY:
Font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
Headings: 600-700 weight
Body: 400-500 weight
Buttons: 600 weight
Sizes: 11px-26px (hierarchy)

SPACING:
Grid: 8px base unit
Padding: 12px, 16px, 24px, 32px
Margins: Consistent vertical rhythm
Gaps: 8px, 12px, 16px, 20px

SHADOWS:
Subtle: 0 1px 2px rgba(0,0,0,0.08)
Medium: 0 4px 12px rgba(0,0,0,0.1)
Strong: 0 8px 24px rgba(102,126,234,0.4)

BORDERS:
Radius: 8px (cards), 16px (bubbles), 50px (pills)
Width: 1px (default), 2px (emphasis)
Colors: #e5e7eb (light), #d1d5db (medium)
```

### Prompt 11.2 - Responsive Design
```
Make the platform responsive:

BREAKPOINTS:
- Desktop: 1200px+ (3-panel layout)
- Tablet: 768px-1199px (2-panel, canvas + preview)
- Mobile: <768px (single panel, tabs)

ADAPTATIONS:
- Canvas: Reduce node size on smaller screens
- Chat: Full width on mobile
- Modals: Full screen on mobile
- Buttons: Stack vertically on mobile
- Toolbar: Collapse to hamburger menu

Keep professional appearance across all devices.
```

---

## 🎯 Final Prompt - Complete Integration

### **RECOMMENDED: React + Vite Version**

```
FINAL TASK: Integrate all components into a cohesive React application

PROJECT: CitiFlow Studio
TECH STACK: React 18 + Vite + React Flow + Framer Motion + Tailwind + Zustand

SETUP:
npm create vite@latest citiflow-studio -- --template react
cd citiflow-studio
npm install reactflow framer-motion zustand lucide-react clsx tailwind-merge
npm install -D tailwindcss autoprefixer postcss
npx tailwindcss init -p

COMPLETE FEATURE SET:
✅ Visual flow builder with React Flow (6 custom node types)
✅ Drag-and-drop canvas with automatic connections
✅ Dynamic configuration panel (React components)
✅ Live chat preview with Framer Motion animations
✅ 20+ production-ready JSON templates
✅ Template catalog modal with categories
✅ Master Template Builder wizard (4 steps)
✅ Variable substitution system
✅ API integration with mock data
✅ Export/Import JSON flows
✅ Deploy & Test functionality
✅ Build Assist floating button
✅ Professional banking design (Tailwind)
✅ Smooth animations (Framer Motion)
✅ Smart quick replies after task completion
✅ No emojis (professional tone)

KEY LIBRARIES & WHY:
1. React Flow - Flow builder canvas (saves 6-8 hours!)
2. Framer Motion - Declarative animations (saves 2-3 hours!)
3. Tailwind CSS - Rapid styling (saves 2-3 hours!)
4. Zustand - Simple state management
5. shadcn/ui - Professional UI components
6. Lucide React - Modern icon system

QUALITY STANDARDS:
- Production-ready React code
- No console errors or warnings
- Clean, commented components
- Consistent naming (PascalCase components, camelCase functions)
- Responsive design (Tailwind breakpoints)
- Accessible (ARIA labels, keyboard navigation)
- Fast performance (< 100ms interactions, 60fps animations)
- Professional banking appearance

COMPONENT ARCHITECTURE:
- Atomic design: atoms → molecules → organisms → templates
- Custom hooks for business logic
- Zustand stores for state
- Utility functions in /lib
- Shared UI components from shadcn/ui

TESTING:
- All 20+ templates work end-to-end
- Unified bot merges multiple templates correctly
- Variable substitution works in all scenarios
- API calls function with mock data
- React Flow canvas is smooth and responsive
- Framer Motion animations are 60fps
- No navigation errors
- Export/import JSON works flawlessly

DEVELOPMENT TIMELINE (with React):
- Agent 1 (UI Layout): 2 hours (Tailwind speeds this up)
- Agent 2 (Canvas): 2 hours (React Flow does 90% of work!)
- Agent 3 (Flow Engine): 3 hours (hooks + Zustand)
- Agent 4 (Templates): 4 hours (same JSON templates)
- Agent 5 (Integration): 2 hours (same merge logic)
- Agent 6 (Animations): 1 hour (Framer Motion!)
- Agent 7 (QA): 2 hours
- Agent 8 (Docs): 2 hours

Total: 18 hours → 8-10 hours with parallel agents ⚡

Serve on: http://localhost:5173 (Vite dev server)
Build: npm run build (production-ready static files)
```



## 📚 Additional Context for Devin

```
REFERENCE APPLICATIONS:
- Look & feel similar to: Intercom, Drift, Zendesk chat builders
- Flow builder inspired by: React Flow examples, Zapier, Make.com
- Chat interface quality: Apple iMessage, WhatsApp Web
- Professional tone: Banking apps (Chase, Bank of America, Citi)

SUCCESS CRITERIA:
1. Business users can build flows without code ✅
2. Platform feels professional for financial institutions ✅
3. All flows work end-to-end like production systems ✅
4. Animations enhance (not distract from) UX ✅
5. Templates are reusable and customizable ✅
6. Unified bot generator creates cohesive experience ✅
7. No technical debt or placeholder code ✅
8. Code is maintainable and scalable ✅



RECOMMENDATION: React + Vite + React Flow
```

---

## 🎉 **Ready-to-Use Devin.AI Prompt**

Copy this complete prompt to start with Devin.AI:

```
bas citiflow-studio
npm install reactflow framer-motion zustand lucide-react clsx tailwind-merge
npm install -D tailwindcss autoprefixer postcss
npx tailwindcss init -p

REFERENCE DOCUMENTS:
1. DEVIN_AI_PROMPT.md (this file) - Feature specifications
2. PLAYBOOK.md - Development phases and milestones
3. AGENTS.md - Multi-agent configuration
4. TECH_STACK_RECOMMENDATIONS.md - Why React + Vite

ASSIGN 8 SPECIALIZED AGENTS:
1. UI/UX Agent - Tailwind setup, layout components (2hrs)
2. Canvas Agent - React Flow setup, custom nodes (2hrs)
3. Flow Engine Agent - Execution hooks, variable system (3hrs)
4. Template Agent - 20+ banking flow JSONs (4hrs)
5. Integration Agent - Unified bot merger (2hrs)
6. Animation Agent - Framer Motion implementation (1hr)
7. QA Agent - Testing and validation (2hrs)
8. Documentation Agent - User guides (2hrs)

DEVELOPMENT PHASES:
Follow PLAYBOOK.md phases 1-8, but use React components instead of vanilla JS.

KEY ADVANTAGES:
✅ React Flow = Canvas functionality built-in (70% of work done!)
✅ Framer Motion = Animations in 1 line (vs 20 lines CSS)
✅ Tailwind = Professional design 3x faster
✅ Zustand = Clean state management
✅ Devin.AI = 30-40% more efficient with React

TIMELINE: 8-10 hours (vs 15-20 with vanilla JS)

START WITH: Agent 1 + Agent 2 in parallel
- Agent 1: Set up Tailwind, create App.jsx layout
- Agent 2: Configure React Flow with 6 custom node types

GOAL: Production-ready platform where business users build banking chatbots visually
```

