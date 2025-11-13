# 🚀 Quick Build Guide - Card Replacement Flow

## 🎯 Your Mission
Build a complete Credit Card Replacement flow with 15 nodes in ~20 minutes!

---

## 📋 Node List (Build Order)

### Phase 1: Happy Path (Nodes 1-10)
```
1. START              → go_to: get_cards
2. API (Get Cards)    → success: card_selection | error: api_error
3. MENU (Card List)   → buttons point to: reason_selection
4. MENU (Reason)      → buttons point to: address_confirmation
5. MENU (Address)     → buttons point to: confirmation_summary
6. MESSAGE (Summary)  → go_to: final_confirmation
7. MENU (Confirm)     → buttons: process_replacement | cancel_flow
8. API (Process)      → success: success_message | error: error_message
9. MESSAGE (Success)  → go_to: success_menu
10. MENU (Next Steps) → buttons: email_receipt | start | end_flow
```

### Phase 2: Error Handling (Nodes 11-14)
```
11. MESSAGE (Error)       → go_to: error_menu
12. MENU (Error Options)  → buttons: process_replacement | contact_support | cancel_flow
13. CONDITIONAL (API Err) → if_true: no_cards_message | if_false: generic_error
14. MESSAGE (No Cards)    → go_to: contact_support
```

### Phase 3: Support & End (Nodes 15-17)
```
15. MESSAGE (Contact)  → go_to: end_flow
16. MESSAGE (Cancel)   → go_to: start
17. END (Terminate)    → final message
```

---

## ⚡ Speed Build Tips

### 🎨 Layout Strategy
Arrange nodes in **3 horizontal rows**:

**Row 1 (Top):** Happy path
```
[START] → [API-Get] → [Menu-Card] → [Menu-Reason] → [Menu-Addr] → [Msg-Summary] → [Menu-Confirm] → [API-Process] → [Msg-Success] → [Menu-Done]
```

**Row 2 (Middle):** Error handling
```
                      [Conditional] → [Msg-NoCards]
                           ↓
                      [Msg-Error] → [Menu-ErrorOpts]
```

**Row 3 (Bottom):** Support & End
```
[Msg-Cancel] → [Msg-Contact] → [END]
```

---

## 🔧 Configuration Shortcuts

### For START Node:
- Screen ID: `start`
- Go To: Type `get_cards`

### For API Nodes:
- Use the **dropdown** to select pre-built APIs
- Always set **both** success and error paths
- Common: `success: next_screen`, `error: error_message`

### For MENU Nodes:
- Message: Keep it short and clear
- Buttons: 2-4 options ideal
- Always include "Back" or "Cancel" option
- Go To: Use dropdown or type custom Screen ID

### For MESSAGE Nodes:
- Use emojis for visual interest: ✅ ❌ 📋 💳
- Break text into short paragraphs
- Go To: Next logical step

### For CONDITIONAL Nodes:
- Condition: `{variable} === value`
- If True: Success/valid path
- If False: Error/alternative path

---

## 🎯 Screen ID Naming Convention

Use descriptive, lowercase names with underscores:

**✅ Good:**
- `card_selection`
- `reason_selection`
- `address_confirmation`
- `process_replacement`
- `success_message`

**❌ Bad:**
- `screen1`
- `node2`
- `CardSelection` (camelCase)
- `card-selection` (hyphens)

---

## 🔗 Connection Cheat Sheet

### Auto-Connections (Preferred):
- Set "Go To Screen" in config panel
- Connections draw automatically
- Labeled with connection type (default/success/error/button)

### Manual Connections (Optional):
- Drag from port (small circles on node edges)
- Drop on target node
- Shows as green "Manual" connection

---

## 📝 Message Templates

### Success Message:
```
✅ [Action] Successful!

[Details]

• [Info 1]
• [Info 2]
• [Info 3]

What would you like to do next?
```

### Error Message:
```
❌ [Problem Description]

[Error details]

Don't worry - [reassurance]
```

### Confirmation Message:
```
📋 Summary:

• [Detail 1]
• [Detail 2]
• [Detail 3]

Ready to proceed?
```

### Info Message:
```
ℹ️ [Headline]

[Explanation]

[Call to action]
```

---

## 🧪 Testing Workflow

### 1. Deploy
Click **"🚀 Deploy & Test Flow"** button

### 2. Test Paths
- ✅ **Happy Path:** Start → Select card → Choose reason → Confirm address → Success
- ❌ **Error Path:** Trigger API error → See error handling
- 🔄 **Cancel Path:** Click cancel → Returns properly
- ⬅️ **Back Buttons:** Navigate backwards

### 3. Check
- [ ] All buttons clickable
- [ ] Messages display correctly
- [ ] Flow reaches END
- [ ] Errors handled gracefully
- [ ] Can navigate back

---

## 🐛 Common Issues & Fixes

### Issue: Config panel not showing
**Fix:** Click the node directly (not near edges)

### Issue: Button doesn't go anywhere
**Fix:** Check "Go To Screen" field has valid Screen ID

### Issue: Connection not drawing
**Fix:** Make sure target Screen ID exists

### Issue: API node not working
**Fix:** Set both success AND error "Go To" screens

### Issue: Flow stops unexpectedly
**Fix:** Check each node's "Go To" points to valid screen

### Issue: Can't connect nodes manually
**Fix:** Drag from port (small circle), not node body

---

## 💡 Pro Tips

1. **Build in phases:** Happy path first, then errors
2. **Test often:** Deploy after every 3-5 nodes
3. **Use templates:** Copy/paste similar messages
4. **Name clearly:** Future-you will thank you
5. **Add back buttons:** Always give users an escape
6. **Handle all errors:** No dead ends
7. **Use variables:** `{card_name}`, `{reason}`, etc.
8. **Save frequently:** Export JSON as backup

---

## 📊 Progress Tracker

Mark off as you complete:

**Phase 1: Happy Path**
- [ ] START node
- [ ] Get Cards API
- [ ] Card Selection Menu
- [ ] Reason Selection Menu
- [ ] Address Confirmation Menu
- [ ] Summary Message
- [ ] Final Confirmation Menu
- [ ] Process Replacement API
- [ ] Success Message
- [ ] Success Menu

**Phase 2: Error Handling**
- [ ] Error Message
- [ ] Error Menu
- [ ] API Error Conditional
- [ ] No Cards Message

**Phase 3: Support & End**
- [ ] Contact Support Message
- [ ] Cancel Flow Message
- [ ] END node

**Final Steps:**
- [ ] All Screen IDs unique
- [ ] All buttons connected
- [ ] Deployed successfully
- [ ] Tested all paths
- [ ] Exported JSON

---

## 🎉 You're Ready!

1. Open: http://localhost:8765/index.html
2. Follow the **CARD_REPLACEMENT_FLOW_TUTORIAL.md** step-by-step
3. Use this guide for quick reference
4. Build, test, iterate!

**Estimated Time:** 15-25 minutes
**Difficulty:** Intermediate
**Nodes:** 17 total

**Let's build something amazing! 🚀**

