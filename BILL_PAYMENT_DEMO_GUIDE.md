# 💳 Bill Payment Flow - Demo Guide

## 🎯 Two Ways to Experience This Demo

### Option 1: Load Pre-Built Template (Quick Demo)
**Time**: 2 minutes  
**Best for**: Showing stakeholders the final result

### Option 2: Build Manually (Full Demo)
**Time**: 10-15 minutes  
**Best for**: Training business users on the studio

---

## 📺 Option 1: Quick Demo (Load Template)

### Step 1: Open the Studio
```
http://localhost:8080/citiflow-studio.html
```

### Step 2: Load the Template
1. Click **"📋 Load Template"** button (top left)
2. Select **"💳 Make Bill Payment"**
3. Canvas will populate with all nodes automatically!

### Step 3: Explore the Canvas
**What You'll See** (16 nodes total):
- 1 START node (green 🏁)
- 1 Welcome MENU
- 3 API nodes (blue 🔌) - Get Payees, Get Accounts, Pay Bill
- 5 MESSAGE/MENU screens
- 3 Confirmation screens (one per amount)
- 1 Success screen
- 1 Error screen
- 1 END node (red 🛑)

### Step 4: Click Any Node to See Configuration
**Try These**:
- Click **"api_get_payees"** node → See API configuration
- Click **"select_payee_screen"** → See dynamic buttons from API
- Click **"welcome_screen"** → See menu with 3 buttons

**Notice**:
- All Screen IDs are properly named
- Dropdowns show connections
- Placeholder text in all fields
- Helper hints below inputs

### Step 5: View the JSON
1. Click **"JSON Configuration"** tab (top)
2. See the complete flow structure
3. Notice:
   - All screens defined
   - API calls configured
   - Dynamic buttons setup
   - Variable substitution ({{payee_name}})

### Step 6: Test in Live Preview
1. Click **"🚀 Deploy Flow"** button
2. Chat preview appears on right side
3. **Test the flow**:
   - Click "💳 Pay Bills"
   - Select "Electric Company - Home Electric"
   - Choose "Checking - x8041 ($5,234.50)"
   - Select amount: "$100"
   - Confirm payment
   - See success message!

### Step 7: Show Key Features
**Point out to your audience**:
- ✅ Dynamic buttons from API data (payees, accounts)
- ✅ Variable substitution in messages
- ✅ Multi-step flow with branching
- ✅ Error handling path
- ✅ Success confirmation with details
- ✅ Navigation back to main menu

---

## 🛠️ Option 2: Build Manually (Full Demo)

### Prerequisites
- Clear canvas (or refresh page)
- 15 minutes time
- Follow step-by-step

---

### 🏗️ PART 1: Setup Welcome Screen

#### Node 1: START
1. Drag **🏁 Start** from Nodes palette
2. Place at top-left of canvas
3. Click node → Configure:
   - Screen ID: `start` (already set)
   - Go To Screen: Leave empty (will set later)

#### Node 2: Welcome Menu
1. Drag **📋 Menu** node
2. Place below START
3. Configure:
   - **Screen ID**: `welcome_screen`
   - **Message Text**: 
     ```
     Welcome to Citi Banking! How can I help you today?
     ```
   - **Add 3 Buttons**:
     - Button 1: Label: `💳 Pay Bills`, Go To: (leave empty for now)
     - Button 2: Label: `💰 Check Balance`, Go To: (leave empty)
     - Button 3: Label: `🏧 Find ATM`, Go To: (leave empty)

4. **Connect START to Welcome**:
   - Click START node again
   - In "Go To Screen" dropdown → Select `welcome_screen`
   - ✅ First connection done!

---

### 🔌 PART 2: Get Payees (API Integration)

#### Node 3: API - Get Payees
1. Click **🔌 APIs** tab in left panel
2. Search: "payees"
3. Find **"Get Payees List"**
4. Click **"✨ Use This API"** button
5. Node auto-added to canvas!
6. Click the new node → Configure:
   - **Screen ID**: `api_get_payees`
   - **API URL**: `https://api.citi.com/v1/bills/payees` (already filled)
   - **Method**: GET (already set)
   - **Save Response To**: `payee_list_data`
   - **On Success Go To**: (leave empty for now)
   - **On Error Go To**: (leave empty for now)

7. **Connect Welcome to API**:
   - Click **welcome_screen** node
   - Find "💳 Pay Bills" button
   - In dropdown → Select `api_get_payees`

---

### 📋 PART 3: Select Payee Screen

#### Node 4: Select Payee Menu
1. Drag **📋 Menu** node
2. Configure:
   - **Screen ID**: `select_payee_screen`
   - **Message Text**: 
     ```
     Which bill would you like to pay?
     ```
   - **NOTE**: Dynamic buttons will be generated from API
   - Add 1 static button:
     - Label: `⬅️ Back to Main Menu`
     - Go To: `welcome_screen` (use dropdown!)

3. **Connect API to Select Payee**:
   - Click **api_get_payees** node
   - In "On Success Go To" dropdown → Select `select_payee_screen`

---

### 🏦 PART 4: Get User Accounts

#### Node 5: API - Get Accounts
1. Click **🔌 APIs** tab
2. Search: "accounts"
3. Find **"Get User Accounts"**
4. Click **"✨ Use This API"**
5. Configure the new node:
   - **Screen ID**: `api_get_accounts`
   - **Save Response To**: `account_list_data`
   - **On Success Go To**: (set later)
   - **On Error Go To**: (set later)

---

### 💰 PART 5: Select Account Screen

#### Node 6: Select Account Menu
1. Drag **📋 Menu** node
2. Configure:
   - **Screen ID**: `select_account_screen`
   - **Message Text**: 
     ```
     Select the account to pay from:
     ```
   - Add 1 button:
     - Label: `⬅️ Back to Payees`
     - Go To: `select_payee_screen`

3. **Connect API to Select Account**:
   - Click **api_get_accounts** node
   - On Success → Select `select_account_screen`

---

### 💵 PART 6: Enter Amount Screen

#### Node 7: Amount Menu
1. Drag **📋 Menu** node
2. Configure:
   - **Screen ID**: `enter_amount_screen`
   - **Message Text**: 
     ```
     You're paying {{selected_payee_name}}.
     
     How much would you like to pay?
     
     Account: {{selected_account_name}} - x{{selected_account_last_four}}
     Available: ${{selected_account_balance}}
     ```
   - Add 4 buttons:
     - `$50` → (will create confirmation screen)
     - `$100` → (will create confirmation screen)
     - `$200` → (will create confirmation screen)
     - `⬅️ Back` → `select_account_screen`

---

### ✅ PART 7: Confirmation Screens (3 screens)

#### Node 8: Confirm $50
1. Drag **💬 Message** node
2. Configure:
   - **Screen ID**: `confirm_payment_screen_50`
   - **Message Text**:
     ```
     Please confirm your payment:
     
     💳 To: {{selected_payee_name}}
     💰 Amount: $50.00
     🏦 From: {{selected_account_name}} - x{{selected_account_last_four}}
     
     Do you want to proceed?
     ```
   - Add 2 buttons:
     - `✅ Yes, Pay $50` → (API node)
     - `❌ Cancel` → `welcome_screen`

#### Node 9-10: Repeat for $100 and $200
Create similar nodes with IDs:
- `confirm_payment_screen_100`
- `confirm_payment_screen_200`

**Connect Amount Screen**:
- Click **enter_amount_screen**
- Connect each button to respective confirmation screen

---

### 💳 PART 8: Payment API Calls (3 API nodes)

#### Node 11-13: Pay Bill APIs
1. Click **🔌 APIs** tab
2. Find **"Pay Bill"**
3. Click **"✨ Use This API"** (3 times for 3 nodes)
4. Configure each:
   - Screen IDs: `api_pay_bill_50`, `api_pay_bill_100`, `api_pay_bill_200`
   - Save Response To: `payment_response`
   - On Success: (will create success screen)
   - On Error: (will create error screen)

**Connect Confirmation to APIs**:
- Each confirmation screen's "Yes" button → respective API node

---

### 🎉 PART 9: Success Screen

#### Node 14: Payment Success
1. Drag **💬 Message** node
2. Configure:
   - **Screen ID**: `payment_success_screen`
   - **Message Text**:
     ```
     ✅ Payment Successful!
     
     Confirmation Number: {{payment_response.confirmation_number}}
     
     Your payment to {{selected_payee_name}} has been processed successfully.
     
     What would you like to do next?
     ```
   - Add 3 buttons:
     - `💳 Pay Another Bill` → `api_get_payees`
     - `🏠 Main Menu` → `welcome_screen`
     - `✅ Done` → (end screen)

**Connect APIs to Success**:
- All 3 payment API nodes → On Success → `payment_success_screen`

---

### ⚠️ PART 10: Error Handling

#### Node 15: Error Screen
1. Drag **💬 Message** node
2. Configure:
   - **Screen ID**: `api_error_screen`
   - **Message Text**:
     ```
     ⚠️ We're sorry, we're experiencing technical difficulties. 
     Please try again later or contact customer service.
     ```
   - Add 2 buttons:
     - `🔄 Try Again` → `welcome_screen`
     - `❌ Exit` → (end screen)

**Connect Error Paths**:
- **api_get_payees** → On Error → `api_error_screen`
- **api_get_accounts** → On Error → `api_error_screen`
- **api_pay_bill_50/100/200** → On Error → `api_error_screen`

---

### 🏁 PART 11: End Screen

#### Node 16: End Flow
1. Drag **🛑 End Flow** node
2. Configure:
   - **Screen ID**: `end_screen`
   - **Message Text**:
     ```
     Thank you for using Citi Banking! Have a great day! 😊
     ```

**Final Connections**:
- Success screen "Done" button → `end_screen`
- Error screen "Exit" button → `end_screen`
- Welcome screen (other options) → Create `end_other_service` end node

---

### 🚀 PART 12: Test Your Flow!

1. Click **"🚀 Deploy Flow"** button
2. Test in Live Preview:
   - Start conversation
   - Click "💳 Pay Bills"
   - Watch API call (loading indicator)
   - Select payee from dynamic buttons
   - Select account from dynamic buttons
   - Choose amount
   - Confirm
   - See success!

3. **Try the error path**:
   - Can't easily test (all APIs return success)
   - But it's configured correctly

4. **View JSON**:
   - Click "JSON Configuration" tab
   - See your complete flow structure
   - Export with "💾 Export JSON"

---

## 📊 What You've Demonstrated

### For Business Users:
✅ Visual drag-and-drop interface  
✅ No coding required  
✅ Smart dropdowns (no typos!)  
✅ API integration made easy  
✅ Dynamic buttons from API data  
✅ Real-time preview  
✅ Error handling  
✅ Professional flow building  

### Technical Features Shown:
✅ API calls with success/error paths  
✅ Variable storage and substitution  
✅ Dynamic button generation  
✅ Multi-step flows with branching  
✅ Conditional navigation  
✅ Data passing between screens  
✅ JSON export for production  

---

## 🎯 Key Talking Points for Demo

### "Look How Easy It Is!"
1. **No Code**: "See? We built this entire payment flow without writing a single line of code!"
2. **Smart Dropdowns**: "Notice how I just select from dropdowns instead of typing screen IDs?"
3. **API Library**: "We have 25 pre-configured banking APIs - just search and click!"
4. **Live Preview**: "And here it is working in real-time..."
5. **Production Ready**: "Export this JSON and give it to developers - it's ready to deploy!"

### "This Handles Real Scenarios"
- Multiple payees from API
- Different payment amounts
- Account selection
- Confirmation steps
- Success messages
- Error handling
- Navigation back to menu

### "Business Users Can Do This"
- "No IT team needed for changes"
- "Update messages anytime"
- "Add new payees by changing API"
- "Test before deploying"
- "Self-service chatbot building"

---

## 📝 Flow Summary

### Total Nodes: 16
- 1 START
- 1 Welcome menu
- 3 API calls
- 6 Message/Menu screens
- 3 Confirmation screens
- 1 Success screen
- 1 Error screen  
- 1 END

### APIs Used: 3
1. GET /v1/bills/payees - Fetch payee list
2. GET /v1/user/accounts - Fetch user accounts
3. POST /v1/bills/pay - Process payment

### Key Features:
- Dynamic buttons (payees & accounts)
- Variable substitution (7 variables)
- Multi-amount support ($50, $100, $200)
- Error handling
- Success confirmation
- Navigation paths

---

## 🎬 Demo Script (5 Minutes)

**Opening** (30 sec):
"Today I'll show you our no-code chatbot builder. Business users can create sophisticated banking flows without IT."

**Load Template** (30 sec):
[Click Load Template → Bill Payment]
"Here's a complete bill payment flow - 16 screens, 3 API integrations, all pre-built."

**Show Canvas** (1 min):
[Point to nodes]
"Green START, blue API calls, purple menus. Click any node to configure."

**Show Config** (1 min):
[Click a menu node]
"Look - dropdowns for connections. No typos. Helper text everywhere. API tab with 25 endpoints."

**Test Live** (2 min):
[Click Deploy → Test in preview]
"Now watch it work... select payee... choose account... enter amount... confirm... success!"

**Export** (30 sec):
[Click JSON tab → Export]
"Export this JSON, hand to developers, deploy to production. That's it!"

**Closing** (30 sec):
"Business users built this. No coding. Changes in minutes, not weeks. Questions?"

---

## 💡 Troubleshooting

### Issue: Dropdowns don't show screen IDs
**Fix**: Make sure Screen IDs are filled in first, then dropdowns populate

### Issue: Live Preview not working
**Fix**: Click "🚀 Deploy Flow" button after making changes

### Issue: Dynamic buttons not showing
**Fix**: Make sure API response variable names match exactly

### Issue: Variables not substituting
**Fix**: Check syntax: `{{variable_name}}` with double curly braces

---

## 🎓 Next Steps After Demo

1. **Let them try**: "Want to add a $500 amount option? Try it!"
2. **Explore APIs**: "Check the APIs tab - what else can we add?"
3. **Modify messages**: "Change the welcome message - it's easy!"
4. **Export & Share**: "Take the JSON and show your team!"

---

**Built to showcase the power of no-code chatbot building!** 🚀


