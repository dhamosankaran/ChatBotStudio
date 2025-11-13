# 💳 Card Replacement Flow - Visual Diagram

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         CREDIT CARD REPLACEMENT FLOW                        │
└────────────────────────────────────────────────────────────────────────────┘

┌──────────────────── HAPPY PATH (TOP ROW) ────────────────────────────────┐

    🏁             🔌              📋              📝              🏠
  [START]  →  [GET_CARDS]  →  [SELECT_CARD]  →  [REASON]  →  [ADDRESS]
    │             API              MENU            MENU          MENU
    │              │                │               │             │
    │         ┌────┴────┐          │               │             │
    │         ↓         ↓          │               │             │
    │     Success    Error         │               │             │
    │         │         │          │               │             │
    │         │         └──────────────────┐       │             │
    │         │                            ↓       │             │
    │         │                      [API_ERROR]   │             │
    │         │                      Conditional   │             │
    │         │                            │       │             │
    │         ↓                            │       ↓             ↓
    │                                      │
    │         📄              ✅              🔌              ✅
    └─────→ [SUMMARY]  →  [CONFIRM]  →  [PROCESS]  →  [SUCCESS]  →  [NEXT]
            MESSAGE        MENU           API          MESSAGE      MENU
                            │              │              │           │
                            │         ┌────┴────┐        │           │
                            │         ↓         ↓        │           │
                            │     Success    Error       │           │
                            │         │         │        │           │
                            │         ↓         │        │           │
                            │                   │        │           │
                            │                   ↓        │           ↓
                            │              [ERROR_MSG]   │
                            │               MESSAGE      │         🛑
                            │                   │        │        [END]
                            │                   ↓        │
                            │              [ERROR_MENU]  │
                            │                 MENU       │
                            │                   │        │
                            │         ┌─────────┼────┐   │
                            │         │         │    │   │
                            │         ↓         ↓    ↓   │
                            │      Retry    Support  │   │
                            │         │         │    │   │
                            │         └─────────┘    │   │
                            │                        │   │
                            ↓                        │   │
                         [CANCEL] ←──────────────────┘   │
                          MESSAGE                        │
                            │                            │
                            └────────────────────────────┘

┌────────────────── ERROR HANDLING (MIDDLE ROW) ───────────────────────────┐

                            [API_ERROR]
                           Conditional
                                │
                      ┌─────────┴─────────┐
                      ↓                   ↓
               [NO_CARDS_MSG]      [ERROR_MSG]
                   MESSAGE            MESSAGE
                      │                   │
                      └─────────┬─────────┘
                                ↓
                          [CONTACT_SUPPORT]
                              MESSAGE
                                │
                                ↓
                              [END]

┌─────────────── SUPPORT & TERMINATION (BOTTOM ROW) ───────────────────────┐

              [CANCEL_FLOW]         [CONTACT_SUPPORT]         [END]
                MESSAGE                  MESSAGE              🛑
                   │                        │
                   └──────────┬─────────────┘
                              ↓
                           Back to START
                            or END

└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Node Type Legend

| Icon | Type | Purpose |
|------|------|---------|
| 🏁 | START | Entry point |
| 🔌 | API | External call |
| 💬 | MESSAGE | Display info |
| 📋 | MENU | User choice |
| 🔀 | CONDITIONAL | Logic branch |
| 🛑 | END | Termination |

---

## 🔄 Flow Paths

### ✅ Success Path (Green)
```
START → GET_CARDS (success) → SELECT_CARD → REASON → ADDRESS → 
SUMMARY → CONFIRM → PROCESS (success) → SUCCESS → END
```

### ❌ Error Path (Red)
```
GET_CARDS (error) → API_ERROR → NO_CARDS → CONTACT_SUPPORT → END
PROCESS (error) → ERROR_MSG → ERROR_MENU → [Retry/Support/Cancel]
```

### ↩️ Cancel Path (Yellow)
```
Any MENU → Cancel Button → CANCEL_FLOW → START
```

### 🔙 Back Navigation (Blue)
```
Any MENU → Back Button → Previous Screen
```

---

## 📊 Node Count by Type

```
API Nodes:         2  (GET_CARDS, PROCESS)
MESSAGE Nodes:     5  (SUMMARY, SUCCESS, ERROR, NO_CARDS, CANCEL, CONTACT)
MENU Nodes:        5  (SELECT_CARD, REASON, ADDRESS, CONFIRM, SUCCESS_MENU, ERROR_MENU)
CONDITIONAL:       1  (API_ERROR)
START/END:         2  (START, END)
───────────────────────
TOTAL:            17 nodes
```

---

## 🎯 Connection Summary

### Auto-Generated Connections
- **Default** (Blue): Normal flow progression
- **Success** (Green): API success path
- **Error** (Red): API error path
- **Button** (Purple): Menu button selections

### Manual Connections (Optional)
- **Manual** (Green dashed): User-drawn connections

---

## 💡 Building Tips

### Phase 1: Build the spine (left to right, top row)
```
START → API → MENU → MENU → MENU → MSG → MENU → API → MSG → MENU → END
```

### Phase 2: Add error branches (middle area)
```
API errors → Conditionals → Error messages → Recovery menus
```

### Phase 3: Add support exits (bottom)
```
Cancel flows → Support contact → Termination
```

---

## 🔗 Key Connections

### Critical Paths to Configure:
1. **START** → `get_cards`
2. **GET_CARDS** → Success: `card_selection` | Error: `api_error`
3. **PROCESS** → Success: `success_message` | Error: `error_message`
4. **API_ERROR** → True: `no_cards_message` | False: `generic_error`
5. **CANCEL** → `start` (allows restarting)
6. All **END paths** → `end_flow`

---

## 🎬 User Journey Example

```
👤 User: "I need to replace my card"
    ↓
🤖 Bot: "Which card?" [Shows: Platinum, Gold, Cancel]
    ↓
👤 User: Clicks "Platinum Card"
    ↓
🤖 Bot: "Why do you need a replacement?" [Lost, Stolen, Damaged, Back]
    ↓
👤 User: Clicks "Lost Card"
    ↓
🤖 Bot: "Where should we send it?" [Current Address, Different Address, Back]
    ↓
👤 User: Clicks "Current Address"
    ↓
🤖 Bot: Shows summary → "Ready to proceed?" [Confirm, Cancel]
    ↓
👤 User: Clicks "Confirm Replacement"
    ↓
🔌 API: Processes replacement...
    ↓
✅ Success!
    ↓
🤖 Bot: "Replacement confirmed! Ref: REF123456789" [Email Receipt, Main Menu, Done]
    ↓
👤 User: Clicks "Done"
    ↓
🛑 END: "Thank you! Have a great day! 👋"
```

---

## 🧪 Test Checklist

- [ ] Happy path completes (START → END)
- [ ] API success handled correctly
- [ ] API error handled gracefully
- [ ] User can cancel at any point
- [ ] Back buttons work
- [ ] Error messages are clear
- [ ] Retry functionality works
- [ ] Support contact displayed
- [ ] All buttons clickable
- [ ] No dead ends
- [ ] Variables display correctly
- [ ] Flow is user-friendly

---

**Use this diagram while building to visualize the complete flow structure!**

