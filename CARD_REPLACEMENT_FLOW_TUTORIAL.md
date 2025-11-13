# 💳 Credit Card Replacement Flow - Step-by-Step Tutorial

## Overview
Build a complete credit card replacement flow with API integration, error handling, and user confirmations.

## Flow Structure

```
START
  ↓
GET_CARDS_API (Fetch user's cards)
  ↓
CARD_SELECTION_MENU (Show cards as buttons)
  ↓
REASON_MENU (Lost/Stolen/Damaged)
  ↓
ADDRESS_CONFIRMATION (Current vs New)
  ↓
CONFIRMATION_MESSAGE (Summary)
  ↓
REPLACE_CARD_API (Process replacement)
  ↓ (success)
SUCCESS_MESSAGE
  ↓
END
  
  ↓ (error)
ERROR_MESSAGE
  ↓
RETRY_MENU
  ↓
(back to REPLACE_CARD_API or END)
```

---

## Step-by-Step Build Instructions

### 🏁 **Step 1: Add START Node**

**Action:** Drag **START** node from left palette to canvas (position: left side, top)

**Configuration:**
1. Click the START node
2. In right config panel:
   - **Screen ID:** `start`
   - **Go To Screen:** Select "Custom" → Type `get_cards`

---

### 🔌 **Step 2: Add GET_CARDS_API Node**

**Action:** Drag **API** node to canvas (position: right of START)

**Configuration:**
1. Click the API node
2. **Screen ID:** `get_cards`
3. **API Selection:** Choose **"Get User Credit Cards"** from dropdown
   - Category: "Card Management"
   - Method: GET
   - If you don't see it, refresh browser: `Cmd+Shift+R`
4. **On Success → Go To:** `card_selection`
5. **On Error → Go To:** `api_error`

**Mock Response (Automatic):**
```json
{
  "status": "success",
  "cards": [
    { "card_id": "card_001", "card_type": "Platinum Card", "last_four": "4532", "status": "active" },
    { "card_id": "card_002", "card_type": "Gold Rewards Card", "last_four": "8901", "status": "active" },
    { "card_id": "card_003", "card_type": "Cash Back Card", "last_four": "2468", "status": "active" }
  ],
  "total_cards": 3
}
```

**Variables Stored:** `{cards}`, `{total_cards}`, `{status}`

**📝 Note:** In production, button labels would be dynamically generated from `{cards}` array

---

### 📋 **Step 3: Add CARD_SELECTION_MENU Node**

**Action:** Drag **MENU** node to canvas (position: right of GET_CARDS_API)

**Configuration:**
1. Click the MENU node
2. **Screen ID:** `card_selection`
3. **Message Text:**
```
Which credit card would you like to replace?

Select from your active cards below:
```

4. **Add Buttons:** (Click "+ Add Button")
   - **Button 1:**
     - Label: `💳 Platinum Card (...4532)`
     - Go To: `reason_selection`
     - Type: Custom ID
   
   - **Button 2:**
     - Label: `💳 Gold Rewards (...8901)`
     - Go To: `reason_selection`
     - Type: Custom ID
   
   - **Button 3:**
     - Label: `❌ Cancel`
     - Go To: `cancel_flow`
     - Type: Custom ID

**Note:** In production, these buttons would be generated dynamically from `{cards}` variable

---

### 📝 **Step 4: Add REASON_SELECTION_MENU Node**

**Action:** Drag **MENU** node to canvas (position: right of CARD_SELECTION)

**Configuration:**
1. Click the MENU node
2. **Screen ID:** `reason_selection`
3. **Message Text:**
```
Why do you need a replacement card?

Please select the reason:
```

4. **Add Buttons:**
   - **Button 1:**
     - Label: `🔒 Lost Card`
     - Go To: `address_confirmation`
   
   - **Button 2:**
     - Label: `🚨 Stolen Card`
     - Go To: `address_confirmation`
   
   - **Button 3:**
     - Label: `💔 Damaged Card`
     - Go To: `address_confirmation`
   
   - **Button 4:**
     - Label: `⬅️ Back`
     - Go To: `card_selection`

---

### 🏠 **Step 5: Add ADDRESS_CONFIRMATION_MENU Node**

**Action:** Drag **MENU** node to canvas (position: below REASON_SELECTION)

**Configuration:**
1. Click the MENU node
2. **Screen ID:** `address_confirmation`
3. **Message Text:**
```
Where should we send your replacement card?

Current Address:
123 Main Street, Apt 4B
New York, NY 10001
```

4. **Add Buttons:**
   - **Button 1:**
     - Label: `✅ Current Address`
     - Go To: `confirmation_summary`
   
   - **Button 2:**
     - Label: `📍 Different Address`
     - Go To: `new_address_input`
   
   - **Button 3:**
     - Label: `⬅️ Back`
     - Go To: `reason_selection`

---

### 📄 **Step 6: Add CONFIRMATION_SUMMARY Message**

**Action:** Drag **MESSAGE** node to canvas (position: right of ADDRESS)

**Configuration:**
1. Click the MESSAGE node
2. **Screen ID:** `confirmation_summary`
3. **Message Text:**
```
📋 Replacement Summary:

• Card: Platinum Card (...4532)
• Reason: Lost Card
• Address: 123 Main Street, Apt 4B, NY 10001
• Estimated Arrival: 5-7 business days
• Your old card will be deactivated

Ready to proceed?
```

4. **Go To Screen:** `final_confirmation`

---

### ✅ **Step 7: Add FINAL_CONFIRMATION_MENU Node**

**Action:** Drag **MENU** node to canvas (position: right of CONFIRMATION_SUMMARY)

**Configuration:**
1. Click the MENU node
2. **Screen ID:** `final_confirmation`
3. **Message Text:**
```
⚠️ Important:

Once confirmed, your current card will be immediately deactivated for security.

Proceed with replacement?
```

4. **Add Buttons:**
   - **Button 1:**
     - Label: `✅ Confirm Replacement`
     - Go To: `process_replacement`
   
   - **Button 2:**
     - Label: `❌ Cancel`
     - Go To: `cancel_flow`

---

### 🔌 **Step 8: Add PROCESS_REPLACEMENT_API Node**

**Action:** Drag **API** node to canvas (position: right of FINAL_CONFIRMATION)

**Configuration:**
1. Click the API node
2. **Screen ID:** `process_replacement`
3. **API Selection:** Choose **"Replace Credit Card"** from dropdown
   - Category: "Card Management"
   - Method: POST
4. **Request Body (handled automatically by mock API):**
```json
{
  "card_id": "card_001",
  "reason": "lost",
  "address": "current"
}
```
5. **On Success → Go To:** `success_message`
6. **On Error → Go To:** `error_message`

**Mock Response (Automatic):**
```json
{
  "status": "success",
  "reference_number": "REF-2024-CC-789123",
  "message": "Card replacement processed successfully",
  "old_card_status": "deactivated",
  "new_card": {
    "card_type": "Platinum Card",
    "last_four": "7890",
    "estimated_delivery": "5-7 business days"
  }
}
```

**Variables Available:** `{reference_number}`, `{new_card.last_four}`, `{new_card.estimated_delivery}`

---

### ✅ **Step 9: Add SUCCESS_MESSAGE Node**

**Action:** Drag **MESSAGE** node to canvas (position: right of PROCESS_REPLACEMENT)

**Configuration:**
1. Click the MESSAGE node
2. **Screen ID:** `success_message`
3. **Message Text:**
```
✅ Card Replacement Confirmed!

Your replacement card has been ordered successfully.

• Reference Number: {reference_number}
• New Card Last 4 Digits: {new_card.last_four}
• Estimated Arrival: {new_card.estimated_delivery}
• Your old card is now deactivated

Tracking information will be sent to your email.

What would you like to do next?
```

**📝 Note:** The `{variable}` syntax will be replaced with actual values from the API response when deployed

4. **Go To Screen:** `success_menu`

---

### 📋 **Step 10: Add SUCCESS_MENU Node**

**Action:** Drag **MENU** node to canvas (position: below SUCCESS_MESSAGE)

**Configuration:**
1. Click the MENU node
2. **Screen ID:** `success_menu`
3. **Message Text:**
```
Need anything else?
```

4. **Add Buttons:**
   - **Button 1:**
     - Label: `📧 Email Receipt`
     - Go To: `email_receipt`
   
   - **Button 2:**
     - Label: `🏠 Main Menu`
     - Go To: `start`
   
   - **Button 3:**
     - Label: `✅ Done`
     - Go To: `end_flow`

---

### ❌ **Step 11: Add ERROR_MESSAGE Node**

**Action:** Drag **MESSAGE** node to canvas (position: below PROCESS_REPLACEMENT)

**Configuration:**
1. Click the MESSAGE node
2. **Screen ID:** `error_message`
3. **Message Text:**
```
❌ Unable to Process Replacement

We encountered an error while processing your card replacement request.

Error: {error_message}

Don't worry - your current card is still active.
```

4. **Go To Screen:** `error_menu`

---

### 🔄 **Step 12: Add ERROR_MENU Node**

**Action:** Drag **MENU** node to canvas (position: right of ERROR_MESSAGE)

**Configuration:**
1. Click the MENU node
2. **Screen ID:** `error_menu`
3. **Message Text:**
```
What would you like to do?
```

4. **Add Buttons:**
   - **Button 1:**
     - Label: `🔄 Try Again`
     - Go To: `process_replacement`
   
   - **Button 2:**
     - Label: `📞 Contact Support`
     - Go To: `contact_support`
   
   - **Button 3:**
     - Label: `❌ Cancel`
     - Go To: `cancel_flow`

---

### 🔀 **Step 13: Add API_ERROR Conditional Node**

**Action:** Drag **CONDITIONAL** node to canvas (position: below GET_CARDS_API)

**Configuration:**
1. Click the CONDITIONAL node
2. **Screen ID:** `api_error`
3. **Condition:** `{status_code} === 404`
4. **If True → Go To:** `no_cards_message`
5. **If False → Go To:** `generic_error`

---

### 📭 **Step 14: Add NO_CARDS_MESSAGE Node**

**Action:** Drag **MESSAGE** node to canvas (position: right of API_ERROR)

**Configuration:**
1. Click the MESSAGE node
2. **Screen ID:** `no_cards_message`
3. **Message Text:**
```
📭 No Cards Found

We couldn't find any active credit cards on your account.

If you believe this is an error, please contact support.
```

4. **Go To Screen:** `contact_support`

---

### 📞 **Step 15: Add CONTACT_SUPPORT Message**

**Action:** Drag **MESSAGE** node to canvas (position: bottom right)

**Configuration:**
1. Click the MESSAGE node
2. **Screen ID:** `contact_support`
3. **Message Text:**
```
📞 Contact Customer Support

• Phone: 1-800-CITI-CARD
• Hours: 24/7
• Online: citi.com/support
• Chat: Available in app

A support representative can assist you with card replacement.
```

4. **Go To Screen:** `end_flow`

---

### ❌ **Step 16: Add CANCEL_FLOW Message**

**Action:** Drag **MESSAGE** node to canvas (position: bottom center)

**Configuration:**
1. Click the MESSAGE node
2. **Screen ID:** `cancel_flow`
3. **Message Text:**
```
❌ Replacement Cancelled

Your card replacement has been cancelled. Your current card remains active.

Need help with something else?
```

4. **Go To Screen:** `start`

---

### 🛑 **Step 17: Add END Node**

**Action:** Drag **END** node to canvas (position: bottom right)

**Configuration:**
1. Click the END node
2. **Screen ID:** `end_flow`
3. **Ending Message:**
```
Thank you for using Citi Mobile Banking! 

Have a great day! 👋
```

---

## 🔗 Manual Connections (Optional)

If you want to add visual connections between nodes:

1. **Hover over any node** - small circles (ports) appear on edges
2. **Click and drag** from a port on one node
3. **Drop on another node** to create a connection
4. **Connection shows as green line** labeled "Manual"

---

## 🧪 Testing Your Flow

### Step 1: Deploy
1. Click **"🚀 Deploy & Test Flow"** button (top right)
2. Wait for "Flow deployed successfully!" message

### Step 2: Test in Live Preview
The **Live Preview** panel (left side) will show your chatbot.

**Test Scenarios:**

**✅ Happy Path:**
1. Bot shows card selection
2. Select "Platinum Card"
3. Choose "Lost Card"
4. Confirm current address
5. Review summary
6. Confirm replacement
7. See success message

**❌ Error Path:**
1. If API fails → Shows error message
2. Options to retry or contact support

**🔄 Cancel Flow:**
1. Click cancel at any step
2. Returns to appropriate screen

### Step 3: Verify
- ✅ All buttons work
- ✅ Messages display correctly
- ✅ API calls trigger (mock data shows)
- ✅ Error handling works
- ✅ Can navigate back
- ✅ Flow completes at END node

---

## 📊 Node Summary

| Node Type | Count | Purpose |
|-----------|-------|---------|
| START | 1 | Entry point |
| API | 2 | Get cards, Process replacement |
| MESSAGE | 5 | Information displays |
| MENU | 5 | User choices |
| CONDITIONAL | 1 | Error routing |
| END | 1 | Flow termination |
| **TOTAL** | **15** | **Complete flow** |

---

## 🎯 Configuration Checklist

Before testing, verify:

- [ ] All nodes have unique Screen IDs
- [ ] START node points to first screen
- [ ] All menu buttons have destinations
- [ ] API nodes have success/error paths
- [ ] Messages flow logically
- [ ] END node is reachable
- [ ] Cancel/back buttons work
- [ ] Error messages are clear
- [ ] Variables are used correctly

---

## 💡 Tips

1. **Use Clear Screen IDs:** `card_selection`, not `screen1`
2. **Test Each Path:** Success, error, cancel
3. **Add Back Buttons:** Let users navigate back
4. **Clear Messages:** Users should understand next steps
5. **Handle Errors:** Always provide retry/support options
6. **Use Variables:** Display user data dynamically
7. **Consistent Flow:** Logical progression

---

## 🚀 Next Steps

1. **Build the flow** following steps above
2. **Deploy & Test** using the preview panel
3. **Iterate:** Fix any issues
4. **Export JSON** to save your flow
5. **Use in production** with real APIs

---

**Ready to build? Start with Step 1 and follow along! The config panel on the right will guide you through each node's settings.** 🎉

