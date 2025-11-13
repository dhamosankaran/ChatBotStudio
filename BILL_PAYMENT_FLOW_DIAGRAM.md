# 💳 Bill Payment Flow - Visual Diagram

## 🗺️ Complete Flow Map

```
┌─────────────────────────────────────────────────────────────────┐
│                        BILL PAYMENT FLOW                         │
│                     (16 Nodes, 3 APIs)                          │
└─────────────────────────────────────────────────────────────────┘

                            🏁 START
                               │
                               ↓
                    ┌──────────────────────┐
                    │  WELCOME_SCREEN      │
                    │  (Menu)              │
                    │                      │
                    │  💳 Pay Bills        │───────┐
                    │  💰 Check Balance    │──┐    │
                    │  🏧 Find ATM         │──┼────┼──→ END_OTHER_SERVICE
                    └──────────────────────┘  │    │
                                              │    │
                              ┌───────────────┘    │
                              ↓                    │
                    ┌──────────────────────┐       │
                    │  API_GET_PAYEES      │       │
                    │  (API - GET)         │       │
                    │                      │       │
                    │  GET /bills/payees   │       │
                    └──────────┬───────────┘       │
                              │                    │
                    ┌─────────┴──────────┐         │
                    ↓                    ↓         │
          ┌─────────────────┐   ┌────────────┐    │
          │ SELECT_PAYEE    │   │ API_ERROR  │    │
          │ (Menu)          │   │ (Screen)   │    │
          │                 │   └─────┬──────┘    │
          │ Electric Co.    │         │           │
          │ Water Utility   │         └───────────┼──→ END_SCREEN
          │ Internet        │                     │
          └────────┬────────┘                     │
                   │                              │
                   ↓                              │
          ┌─────────────────┐                     │
          │ API_GET_ACCOUNTS│                     │
          │ (API - GET)     │                     │
          │                 │                     │
          │ GET /accounts   │                     │
          └────────┬────────┘                     │
                   │                              │
         ┌─────────┴──────────┐                   │
         ↓                    ↓                   │
┌──────────────────┐   ┌────────────┐            │
│ SELECT_ACCOUNT   │   │ API_ERROR  │            │
│ (Menu)           │   │ (Screen)   │            │
│                  │   └─────┬──────┘            │
│ Checking x8041   │         │                   │
│ Savings x5523    │         └───────────────────┘
│ Investment x3099 │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│ ENTER_AMOUNT     │
│ (Menu)           │
│                  │
│ $50   ──────────┼───┐
│ $100  ──────────┼───┼───┐
│ $200  ──────────┼───┼───┼───┐
└──────────────────┘   │   │   │
                       │   │   │
         ┌─────────────┘   │   │
         ↓                 │   │
┌─────────────────────┐    │   │
│ CONFIRM_SCREEN_50   │    │   │
│ (Message)           │    │   │
│                     │    │   │
│ Pay $50?            │    │   │
│ ✅ Yes  ──────────┐ │    │   │
│ ❌ Cancel         │ │    │   │
└───────────────────┼─┘    │   │
                    │      │   │
                    ↓      │   │
         ┌─────────────┐   │   │
         │ API_PAY_50  │   │   │
         │ (API-POST)  │   │   │
         └──────┬──────┘   │   │
                │          │   │
         [Similar for     │   │
          $100 & $200]    │   │
                    │      ↓   ↓
                    │   [CONFIRM_100]
                    │   [API_PAY_100]
                    │             │
                    │             ↓
                    │        [CONFIRM_200]
                    │        [API_PAY_200]
                    │             │
                    └─────────────┴────→ (All converge)
                                 │
                    ┌────────────┴─────────────┐
                    ↓                          ↓
         ┌────────────────────┐      ┌─────────────┐
         │ PAYMENT_SUCCESS    │      │  API_ERROR  │
         │ (Message)          │      │  (Screen)   │
         │                    │      └──────┬──────┘
         │ ✅ Confirmation    │             │
         │ PAY-2024-567890    │             │
         │                    │             │
         │ Pay Another Bill   │─────┐       │
         │ Main Menu         │──────┼───────┼──→ WELCOME_SCREEN
         │ Done              │      │       │
         └────────┬───────────┘      │       │
                  │                  │       │
                  ↓                  │       │
         ┌────────────────┐          │       │
         │  END_SCREEN    │ ←────────┴───────┘
         │  (End)         │
         │                │
         │  Thank you! 😊 │
         └────────────────┘
```

---

## 📊 Node Breakdown by Type

### Flow Control (2 nodes)
```
🏁 START               → Entry point
🛑 END_SCREEN          → Flow termination
🛑 END_OTHER_SERVICE   → Alt ending
```

### User Interaction (6 nodes)
```
📋 WELCOME_SCREEN          → Main menu (3 buttons)
📋 SELECT_PAYEE_SCREEN     → Choose payee (dynamic)
📋 SELECT_ACCOUNT_SCREEN   → Choose account (dynamic)
📋 ENTER_AMOUNT_SCREEN     → Select amount (3 buttons)
💬 PAYMENT_SUCCESS_SCREEN  → Show confirmation
💬 API_ERROR_SCREEN        → Error handling
```

### Confirmation Screens (3 nodes)
```
💬 CONFIRM_PAYMENT_SCREEN_50   → Confirm $50
💬 CONFIRM_PAYMENT_SCREEN_100  → Confirm $100
💬 CONFIRM_PAYMENT_SCREEN_200  → Confirm $200
```

### API Integration (5 nodes)
```
🔌 API_GET_PAYEES      → GET /v1/bills/payees
🔌 API_GET_ACCOUNTS    → GET /v1/user/accounts
🔌 API_PAY_BILL_50     → POST /v1/bills/pay
🔌 API_PAY_BILL_100    → POST /v1/bills/pay
🔌 API_PAY_BILL_200    → POST /v1/bills/pay
```

---

## 🔄 Data Flow & Variables

### Variables Created During Flow:

```
┌─────────────────────────────────────────────────────────┐
│  STAGE 1: Get Payees                                    │
├─────────────────────────────────────────────────────────┤
│  payee_list_data {                                      │
│    payees: [                                            │
│      { payee_id, name, nickname, account_number }       │
│    ]                                                    │
│  }                                                      │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STAGE 2: User Selects Payee                           │
├─────────────────────────────────────────────────────────┤
│  selected_payee_name: "Electric Company"               │
│  selected_payee_id: "p1"                               │
│  selected_payee_account: "9876543210"                  │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STAGE 3: Get Accounts                                  │
├─────────────────────────────────────────────────────────┤
│  account_list_data {                                    │
│    accounts: [                                          │
│      { id, name, last_four, balance }                   │
│    ]                                                    │
│  }                                                      │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STAGE 4: User Selects Account                         │
├─────────────────────────────────────────────────────────┤
│  selected_account_name: "Checking"                     │
│  selected_account_last_four: "8041"                    │
│  selected_account_balance: "5,234.50"                  │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STAGE 5: Process Payment                               │
├─────────────────────────────────────────────────────────┤
│  payment_response {                                     │
│    status: "success"                                    │
│    confirmation_number: "PAY-2024-567890"              │
│    message: "Bill payment scheduled successfully"       │
│    payee: "Electric Company"                           │
│    amount: "100.00"                                    │
│  }                                                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Screen Connections Map

### Navigation Matrix:

| From Screen | Button/Action | To Screen |
|------------|---------------|-----------|
| START | Auto | welcome_screen |
| welcome_screen | 💳 Pay Bills | api_get_payees |
| welcome_screen | 💰 Check Balance | end_other_service |
| welcome_screen | 🏧 Find ATM | end_other_service |
| api_get_payees | Success | select_payee_screen |
| api_get_payees | Error | api_error_screen |
| select_payee_screen | [Dynamic] Electric Co | api_get_accounts |
| select_payee_screen | [Dynamic] Water | api_get_accounts |
| select_payee_screen | [Dynamic] Internet | api_get_accounts |
| select_payee_screen | ⬅️ Back | welcome_screen |
| api_get_accounts | Success | select_account_screen |
| api_get_accounts | Error | api_error_screen |
| select_account_screen | [Dynamic] Checking | enter_amount_screen |
| select_account_screen | [Dynamic] Savings | enter_amount_screen |
| select_account_screen | [Dynamic] Investment | enter_amount_screen |
| select_account_screen | ⬅️ Back | select_payee_screen |
| enter_amount_screen | $50 | confirm_payment_screen_50 |
| enter_amount_screen | $100 | confirm_payment_screen_100 |
| enter_amount_screen | $200 | confirm_payment_screen_200 |
| enter_amount_screen | ⬅️ Back | select_account_screen |
| confirm_payment_50 | ✅ Yes | api_pay_bill_50 |
| confirm_payment_50 | ❌ Cancel | welcome_screen |
| confirm_payment_100 | ✅ Yes | api_pay_bill_100 |
| confirm_payment_100 | ❌ Cancel | welcome_screen |
| confirm_payment_200 | ✅ Yes | api_pay_bill_200 |
| confirm_payment_200 | ❌ Cancel | welcome_screen |
| api_pay_bill_50 | Success | payment_success_screen |
| api_pay_bill_50 | Error | api_error_screen |
| api_pay_bill_100 | Success | payment_success_screen |
| api_pay_bill_100 | Error | api_error_screen |
| api_pay_bill_200 | Success | payment_success_screen |
| api_pay_bill_200 | Error | api_error_screen |
| payment_success_screen | 💳 Pay Another | api_get_payees |
| payment_success_screen | 🏠 Main Menu | welcome_screen |
| payment_success_screen | ✅ Done | end_screen |
| api_error_screen | 🔄 Try Again | welcome_screen |
| api_error_screen | ❌ Exit | end_screen |

**Total Connections**: 38 paths

---

## 📱 User Journey Examples

### Happy Path (Success):
```
1. User: Opens chatbot
2. Bot: "Welcome! How can I help?"
3. User: [Clicks] 💳 Pay Bills
4. Bot: [API Call] Getting payees... ⏳
5. Bot: "Which bill would you like to pay?"
       • Electric Company - Home Electric
       • Water Utility - Water Bill
       • Internet Provider - Home Internet
6. User: [Clicks] Electric Company - Home Electric
7. Bot: [API Call] Getting accounts... ⏳
8. Bot: "Select the account to pay from:"
       • Checking - x8041 ($5,234.50)
       • Savings - x5523 ($12,450.50)
       • Investment - x3099 ($28,750.00)
9. User: [Clicks] Checking - x8041 ($5,234.50)
10. Bot: "You're paying Electric Company.
         How much would you like to pay?
         Account: Checking - x8041
         Available: $5,234.50"
         • $50  • $100  • $200
11. User: [Clicks] $100
12. Bot: "Please confirm your payment:
         💳 To: Electric Company
         💰 Amount: $100.00
         🏦 From: Checking - x8041
         Do you want to proceed?"
         • ✅ Yes, Pay $100  • ❌ Cancel
13. User: [Clicks] ✅ Yes, Pay $100
14. Bot: [API Call] Processing payment... ⏳
15. Bot: "✅ Payment Successful!
         Confirmation Number: PAY-2024-567890
         Your payment to Electric Company has been processed."
         • 💳 Pay Another Bill
         • 🏠 Main Menu
         • ✅ Done
```

### Error Path:
```
1-3. Same as happy path
4. Bot: [API Call] Error! ❌
5. Bot: "⚠️ We're sorry, we're experiencing technical difficulties..."
       • 🔄 Try Again
       • ❌ Exit
```

### Cancel Path:
```
1-12. Same as happy path
13. User: [Clicks] ❌ Cancel
14. Bot: Back to "Welcome! How can I help?"
```

---

## 🎨 Color Coding on Canvas

When you load the template, nodes will appear color-coded:

```
🏁 Green Header    = START nodes (entry points)
🔌 Blue Header     = API nodes (external calls)
📋 Purple Header   = MENU nodes (user choices)
💬 Blue Header     = MESSAGE nodes (display info)
🔀 Orange Header   = CONDITIONAL nodes (logic)
🛑 Red Header      = END nodes (terminators)
```

---

## 🔢 Statistics

### Flow Complexity:
- **Total Screens**: 16
- **User Decision Points**: 8
- **API Calls**: 5 (3 unique endpoints)
- **Dynamic Buttons**: 2 screens (payees & accounts)
- **Static Buttons**: 17 buttons total
- **Variable Substitutions**: 7 variables used
- **Error Handling Paths**: 5 error branches
- **Success Paths**: 3 amount variations
- **Navigation Options**: 38 total connections

### User Interactions Required:
- Minimum clicks to complete: **5 clicks**
  1. Pay Bills
  2. Select Payee
  3. Select Account
  4. Select Amount
  5. Confirm Payment

---

## 📋 Checklist for Demo

Use this to verify everything works:

### Before Demo:
- [ ] Studio loaded at `http://localhost:8080/citiflow-studio.html`
- [ ] Template loads without errors
- [ ] All 16 nodes visible on canvas
- [ ] Can click and configure nodes
- [ ] Dropdowns populate with screen IDs

### During Demo:
- [ ] Show canvas overview
- [ ] Click 3-4 different node types
- [ ] Point out dropdown selectors
- [ ] Highlight API configurations
- [ ] Show JSON tab
- [ ] Deploy to Live Preview
- [ ] Complete full payment journey
- [ ] Show success confirmation
- [ ] Export JSON

### Key Points to Emphasize:
- [ ] No coding required
- [ ] Smart dropdowns (no typos)
- [ ] 25 pre-configured APIs
- [ ] Real-time testing
- [ ] Production-ready export
- [ ] Business user friendly

---

**Use this diagram as a reference during your demo!** 🎯


