# CitiFlow Studio v2 - Updates & Improvements

## 🎉 Major Enhancements

### 1. **❓ Help Panel** - Moved to Top Right Corner
- **What Changed**: FAQs removed from left sidebar tab, now accessible via help button in header
- **Location**: Green help button (❓) in top right corner of the application
- **Features**:
  - Slides in from the right side
  - Overlay background for focus
  - Searchable FAQ content
  - Easy access without losing workspace context
  
**Why This Helps Business Users**:
- Always accessible from any view
- Doesn't take up sidebar space
- Quick reference while building flows
- Non-intrusive design

---

### 2. **🔌 Expanded API Library** - 25 Banking APIs
**Previously**: 8 APIs  
**Now**: 25 APIs covering all major banking intents

#### New API Categories:

**Accounts** (3 APIs)
- Get User Accounts
- Get Account Transactions
- Check Account Balance

**Locations** (2 APIs)
- Find Nearest ATMs
- Find Branch Locations

**Transactions** (2 APIs)
- Transfer Funds
- Schedule Transfer

**Credit Cards** (5 APIs)
- Get Credit Card Info
- Activate Credit Card
- Report Lost/Stolen Card
- Make Credit Card Payment
- Get Rewards Points Balance

**Payments** (3 APIs)
- Pay Bill
- Get Payees List
- Setup Auto-Pay

**Profile** (2 APIs)
- Get User Profile
- Update Contact Information

**Security** (2 APIs)
- Change Password
- Setup Two-Factor Authentication

**International** (1 API)
- Get Exchange Rates

**Services** (2 APIs)
- Request Check Book
- Get Account Statements

**Support** (2 APIs)
- Dispute Transaction
- Schedule Branch Appointment

**Loans** (2 APIs)
- Get Loan Information
- Check Loan Eligibility

#### Search Functionality
- **Real-time search bar** at top of APIs tab
- Search across:
  - API names
  - Descriptions
  - Endpoints
  - Categories
- **Live count display**: "Showing X of 25 APIs"
- Instant filtering as you type

**Why This Helps Business Users**:
- Cover 95% of common banking intents
- Easy discovery of available APIs
- Find exactly what you need quickly
- Understanding data structures before building

---

### 3. **🎯 Improved Navigation & Flow Building**

#### Smart Screen ID Dropdowns
**Previously**: Manual typing of screen IDs everywhere  
**Now**: Dropdown selectors with fallback text input

**Where Applied**:
- START node: "Go To Screen" dropdown
- MENU/MESSAGE nodes: Each button has a dropdown
- API nodes: Success and error path dropdowns
- CONDITIONAL nodes: True and false path dropdowns

**How It Works**:
1. Dropdown shows all existing screen IDs from your canvas
2. Select from dropdown OR type a custom ID
3. Dropdowns update automatically as you add nodes
4. No more typos in screen IDs!

#### Enhanced Field Guidance
Every configuration field now includes:
- **Placeholder text** with examples
- **Helper text** below fields explaining usage
- **Smart hints** for best practices

**Examples**:
- "Use lowercase with underscores" (Screen IDs)
- "Check the APIs tab for available endpoints" (API URLs)
- "Access later using {{variable_name.field}}" (Variables)
- "Use {{variable_name}} for dynamic values" (Messages)

**Why This Helps Business Users**:
- No need to memorize screen IDs
- Prevent typos and broken links
- Visual confirmation of connections
- Self-documenting interface

---

## 📊 UI Layout Changes

### Before:
```
┌──────────┬────────────┬─────────────┐
│ Nodes    │  Canvas    │   Config   │
│ APIs     │            │     or     │
│ FAQs  ←─ │            │  Preview   │
└──────────┴────────────┴─────────────┘
```

### After:
```
┌───────────────────────[Help ❓]─────┐  ← NEW!
│                                      │
├──────────┬────────────┬─────────────┤
│ Nodes    │  Canvas    │   Config   │
│ APIs ←── │            │     or     │
│ (25 APIs)│  Better    │  Preview   │
│ +Search  │  Forms!    │            │
└──────────┴────────────┴─────────────┘
```

---

## 🚀 How to Use the New Features

### Using the Help Panel
1. Click the green **❓** button in the top right
2. Search for any topic (e.g., "button", "API", "variable")
3. Click questions to expand answers
4. Click outside or X to close

### Finding and Using APIs
1. Click **🔌 APIs** tab in left panel
2. Use search bar to find APIs:
   - Type "card" to see all credit card APIs
   - Type "transfer" for money movement
   - Type "location" for ATMs/branches
3. Click "📄 View Mock Response" to see data structure
4. Click "✨ Use This API" to add to canvas
5. Configure in right panel using dropdowns

### Building Flows More Easily
1. Add nodes to canvas first
2. Give each a Screen ID (e.g., "welcome_screen")
3. When connecting nodes:
   - Use the **dropdown** to select existing screens
   - OR type a new screen ID
4. Dropdowns auto-update as you add nodes
5. No more typos or broken connections!

---

## 💡 Pro Tips for Business Users

### 1. **Name Screen IDs Descriptively**
- Good: `welcome_screen`, `check_balance`, `select_account`
- Bad: `screen1`, `s2`, `temp`

### 2. **Use the API Search**
- Search by intent: "transfer", "check", "activate"
- Search by category: "card", "loan", "security"
- View mock responses before building

### 3. **Build in Order**
1. Create all nodes first
2. Name them with Screen IDs
3. Then use dropdowns to connect
4. Test in Live Preview

### 4. **Use the Help Panel**
- Press ❓ anytime you're stuck
- Search for specific topics
- Learn best practices

### 5. **Start with Templates**
- Load "Check Account Balance" template
- See how professional flows are built
- Learn patterns and conventions

---

## 🔧 Technical Details

### API Categories
All 25 APIs are tagged with categories for better organization:
- Accounts (3)
- Locations (2)
- Transactions (2)
- Credit Cards (5)
- Payments (3)
- Profile (2)
- Security (2)
- International (1)
- Services (2)
- Support (2)
- Loans (2)

### Screen ID Dropdown Logic
- Scans all nodes on canvas
- Filters for nodes with screen_id set
- Populates dropdown dynamically
- Preserves custom-typed values
- Dual input (dropdown + text field)

### Search Implementation
- Real-time filtering (no button clicks)
- Searches across multiple fields
- Case-insensitive matching
- Live result count
- No results messaging

---

## 📝 What's Next (Future Enhancements)

Based on user feedback, future versions could include:

1. **Visual Connectors** - Lines showing flow between nodes
2. **Auto-Layout** - Automatic node arrangement
3. **Validation** - Check for broken links before deploy
4. **Templates Library** - More pre-built flows
5. **Copy/Paste Nodes** - Duplicate nodes easily
6. **Undo/Redo** - Revert changes
7. **Flow Testing** - Step-through debugger
8. **Collaboration** - Multi-user editing

---

## 🎯 Summary of Improvements

| Feature | Before | After | Impact |
|---------|--------|-------|--------|
| FAQs | Tab in sidebar | Help button (top right) | ⬆️ Better access |
| APIs | 8 APIs | 25 APIs | ⬆️ 3x coverage |
| API Search | None | Real-time search | ⬆️ Easy discovery |
| Screen IDs | Manual typing | Smart dropdowns | ⬆️ No typos |
| Field Help | None | Placeholders + hints | ⬆️ Self-guided |
| Left Panel | 3 tabs | 2 tabs | ⬆️ More focused |

---

## 🆘 Getting Help

1. **In-App Help**: Click ❓ button (top right)
2. **API Reference**: Click 🔌 APIs tab → Browse or search
3. **Templates**: Click 📋 Load Template → See examples
4. **Documentation**: Read this guide!

---

**Built for business users to create sophisticated banking chatbots without writing code.**

Last Updated: November 10, 2024

