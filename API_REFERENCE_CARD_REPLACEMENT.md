# 🔌 API Reference - Card Replacement Flow

## Available APIs for Card Replacement

I've added **6 new mock APIs** specifically for the card replacement flow. Here's how to use them:

---

## 📋 API List

### 1. **Get User Credit Cards** ⭐ PRIMARY
- **Name:** `Get User Credit Cards`
- **Method:** GET
- **Category:** Card Management
- **Use in Step:** Step 2 (GET_CARDS_API node)

**Mock Response:**
```json
{
  "status": "success",
  "cards": [
    {
      "card_id": "card_001",
      "card_type": "Platinum Card",
      "last_four": "4532",
      "status": "active",
      "expiry_date": "12/2027",
      "card_limit": "15,000.00",
      "available_credit": "12,500.00"
    },
    {
      "card_id": "card_002",
      "card_type": "Gold Rewards Card",
      "last_four": "8901",
      "status": "active",
      "expiry_date": "06/2026"
    },
    {
      "card_id": "card_003",
      "card_type": "Cash Back Card",
      "last_four": "2468",
      "status": "active"
    }
  ],
  "total_cards": 3
}
```

**Variables Available:**
- `{cards}` - Array of card objects
- `{cards[0].card_type}` - First card type
- `{cards[0].last_four}` - First card last 4 digits
- `{total_cards}` - Count of cards

---

### 2. **Replace Credit Card** ⭐ PRIMARY
- **Name:** `Replace Credit Card`
- **Method:** POST
- **Category:** Card Management
- **Use in Step:** Step 8 (PROCESS_REPLACEMENT_API node)

**Mock Response:**
```json
{
  "status": "success",
  "reference_number": "REF-2024-CC-789123",
  "message": "Card replacement processed successfully",
  "old_card_status": "deactivated",
  "new_card": {
    "card_type": "Platinum Card",
    "last_four": "7890",
    "status": "ordered",
    "estimated_delivery": "5-7 business days"
  },
  "shipping_address": {
    "line1": "123 Main Street, Apt 4B",
    "city": "New York",
    "state": "NY",
    "zip": "10001"
  },
  "important_notes": [
    "Your old card has been deactivated for security",
    "New card will arrive in 5-7 business days",
    "Tracking information will be emailed"
  ]
}
```

**Variables Available:**
- `{reference_number}` - Confirmation number
- `{new_card.last_four}` - New card last 4 digits
- `{new_card.estimated_delivery}` - Delivery time
- `{old_card_status}` - Should be "deactivated"

---

### 3. **Get User Profile**
- **Name:** `Get User Profile`
- **Method:** GET
- **Category:** User Management
- **Use for:** Getting user's current address (optional)

**Mock Response:**
```json
{
  "status": "success",
  "user": {
    "first_name": "John",
    "last_name": "Smith",
    "email": "john.smith@email.com",
    "phone": "+1 (555) 123-4567",
    "primary_address": {
      "line1": "123 Main Street",
      "line2": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "zip": "10001"
    }
  }
}
```

**Variables Available:**
- `{user.first_name}` - User's first name
- `{user.primary_address.line1}` - Street address
- `{user.primary_address.city}` - City

---

### 4. **Validate Address**
- **Name:** `Validate Address`
- **Method:** POST
- **Category:** Utilities
- **Use for:** Address validation (optional advanced feature)

**Mock Response:**
```json
{
  "status": "success",
  "valid": true,
  "standardized_address": {
    "line1": "123 Main Street",
    "line2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "deliverable": true
  }
}
```

---

### 5. **Get Replacement Reasons**
- **Name:** `Get Replacement Reasons`
- **Method:** GET
- **Category:** Card Management
- **Use for:** Dynamic reason list (optional advanced feature)

**Mock Response:**
```json
{
  "status": "success",
  "reasons": [
    {
      "code": "lost",
      "display_name": "Lost Card",
      "description": "Card has been misplaced",
      "processing_time": "5-7 business days"
    },
    {
      "code": "stolen",
      "display_name": "Stolen Card",
      "description": "Card was stolen",
      "processing_time": "3-5 business days"
    },
    {
      "code": "damaged",
      "display_name": "Damaged Card",
      "description": "Card is physically damaged",
      "processing_time": "5-7 business days"
    }
  ]
}
```

---

### 6. **Check Replacement Status**
- **Name:** `Check Replacement Status`
- **Method:** GET
- **Category:** Card Management
- **Use for:** Tracking replacement (optional follow-up feature)

**Mock Response:**
```json
{
  "status": "success",
  "replacement": {
    "reference_number": "REF-2024-CC-789123",
    "status": "in_transit",
    "status_description": "Your new card is on the way",
    "estimated_delivery": "2024-11-18",
    "tracking_number": "USPS9405511899562000123456"
  }
}
```

---

## 🎯 API Usage in Your Flow

### Core Flow (Required):

**Step 2: Get Cards**
```
Node: API
API: "Get User Credit Cards"
Success → card_selection
Error → api_error
```

**Step 8: Process Replacement**
```
Node: API
API: "Replace Credit Card"
Success → success_message
Error → error_message
```

### Optional Enhancements:

**Get User Address (before address confirmation)**
```
Node: API
API: "Get User Profile"
Success → address_confirmation
Error → use_default_address
```

**Validate New Address (if user enters different address)**
```
Node: API
API: "Validate Address"
Success → confirmation_summary
Error → invalid_address_message
```

---

## 🔍 How to Find APIs in UI

### Method 1: API Dropdown (Recommended)
1. Add an **API node** to canvas
2. Click the node
3. In config panel → **API Selection** dropdown
4. Search or scroll to find:
   - "Get User Credit Cards"
   - "Replace Credit Card"
   - etc.

### Method 2: API Library Tab
1. Look at left palette
2. Click **"🔌 APIs"** tab (next to "📦 Nodes")
3. Use search box to find "card" or "replace"
4. Browse by category: "Card Management"

---

## 📊 API Response Variables

When an API call succeeds, response data is stored in variables you can use:

### After "Get User Credit Cards":
```javascript
{cards}              // Array of all cards
{cards[0]}           // First card object
{total_cards}        // Number like 3
{status}             // "success"
```

### After "Replace Credit Card":
```javascript
{reference_number}           // "REF-2024-CC-789123"
{message}                    // Success message
{new_card.last_four}         // "7890"
{new_card.estimated_delivery}// "5-7 business days"
{old_card_status}            // "deactivated"
```

### Using Variables in Messages:
In MESSAGE nodes, use `{variable_name}` syntax:

```
Your replacement card confirmation number is: {reference_number}

Your new card ending in {new_card.last_four} will arrive in {new_card.estimated_delivery}.
```

---

## 🧪 Testing API Responses

### In Live Preview:
1. Build your flow with API nodes
2. Deploy & Test
3. When API node executes:
   - You'll see the mock response
   - Variables will be populated
   - Flow continues to success/error path

### Check Console:
- Open browser DevTools (F12)
- Go to Console tab
- You'll see API logs like:
  ```
  🔌 API Call: Get User Credit Cards
  ✅ API Success: {cards: Array(3), total_cards: 3}
  ```

---

## 🎨 Visual API Flow

```
START
  ↓
[API: Get User Credit Cards]
  ↓ (success)
Variables: {cards}, {total_cards}
  ↓
[MENU: Show cards as buttons]
  ↓ (user selects card)
[MENU: Select reason]
  ↓
[MENU: Confirm address]
  ↓
[MESSAGE: Show summary]
  ↓
[MENU: Final confirmation]
  ↓
[API: Replace Credit Card]
  ↓ (success)
Variables: {reference_number}, {new_card}
  ↓
[MESSAGE: Success with {reference_number}]
  ↓
END
```

---

## 💡 Pro Tips

1. **API Names are Exact:** When selecting from dropdown, type partial name to filter
2. **Mock Data is Realistic:** The responses include real-world data structures
3. **Error Handling:** Always set both success AND error paths
4. **Variable Inspection:** Check console to see what variables are available
5. **Copy Variable Names:** From the API reference above, copy exact variable paths

---

## 🚀 Ready to Use

All 6 APIs are now available in your CitiFlow Studio! 

**Refresh your browser** if you don't see them yet:
```bash
Cmd + Shift + R (Mac) or Ctrl + Shift + R (Windows)
```

Then look in:
- API dropdown when configuring API nodes
- 🔌 APIs tab in left palette
- Search for "card" or "replace"

---

## 📋 Quick Checklist

- [x] 6 new APIs added to system
- [x] Mock responses with realistic data
- [x] Categories assigned (Card Management, User Management, Utilities)
- [x] Descriptions provided
- [x] Variables documented
- [x] Ready to use in Flow Builder

**Now you can build the complete Card Replacement flow with full API integration!** 🎉

