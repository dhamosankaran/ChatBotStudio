# Testing Instructions for CitiFlow Studio

## Issue Reported
- Config panel not opening when clicking nodes
- Unable to edit Screen IDs, messages, buttons

## Diagnostic Steps

### Step 1: Clear Browser Cache
**IMPORTANT:** Before testing, clear your browser cache to ensure you're seeing the latest code:

1. **Chrome/Edge:**
   - Press `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
   - Or: DevTools → Network tab → Check "Disable cache"

2. **Safari:**
   - Press `Cmd + Option + E` to empty caches
   - Then `Cmd + R` to reload

3. **Firefox:**
   - Press `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)

### Step 2: Open the Application
1. Open `index.html` in your browser
   - Recommended: Use a local server (avoid opening file:// directly)
   - Server running at: http://localhost:8765

### Step 3: Open Browser Console
1. Press `F12` or `Right-click → Inspect`
2. Go to the **Console** tab
3. Keep this open during testing to see debug logs

### Step 4: Load a Template or Add Nodes
**The canvas is EMPTY by default!** You must add nodes first:

**Option A: Load a Template**
1. Click "📋 Load Template" button (top)
2. Select any template (e.g., "Welcome Flow")
3. Wait for nodes to appear on canvas

**Option B: Drag Nodes Manually**
1. Find the left palette with node types
2. Drag "Start" node to canvas
3. Drag "Message" node to canvas
4. Drag "Menu" node to canvas

### Step 5: Test Node Selection
1. **Click on any node** on the canvas
2. **Watch the console** - you should see logs like:
   ```
   🔍 Click event fired on node: node_1 target: canvas-node-body
   🖱️ Node clicked: node_1 MESSAGE
   ✅ Selecting node: node_1
   📊 Current nodes array: [...]
   🔄 Calling renderCanvas...
   🔄 Calling renderConfigPanel...
   ✅ selectNode complete
   ```

3. **Check the right panel** - it should show configuration options

### Step 6: Visual Inspection
1. **Right panel should be visible** (360px wide, white background)
2. **Config panel should show:**
   - "Configure [NODE_TYPE]" title
   - Screen ID input field
   - Message text area (for MESSAGE/MENU nodes)
   - Button list (for MENU nodes)
   - API configuration (for API nodes)

### Step 7: Test Connection Ports
1. **Look for connection ports** on each node:
   - Small circles on top, bottom, left, right edges
   - Should have white fill with blue border
   - Hover should enlarge them

2. **Test drag-to-connect:**
   - Click and hold on a connection port
   - Drag to another node
   - Release on the target node
   - A green "Manual" connection should appear

## Expected Console Output (Example)

When clicking a node, you should see:
```
🔍 Click event fired on node: node_1 target: canvas-node-content
🖱️ Node clicked: node_1 MESSAGE
✅ Selecting node: node_1
📊 Current nodes array: [{id: "node_1", type: "MESSAGE", ...}]
📊 Node exists? {id: "node_1", type: "MESSAGE", ...}
🔄 Calling renderCanvas...
🎨 Rendering canvas with 3 nodes
🔄 Calling renderConfigPanel...
⚙️ Rendering config panel for: node_1
📦 Config panel element: <div id="configPanel" class="config-panel">...</div>
📦 Config panel visible? block
📝 Rendering MESSAGE config panel for node: {id: "node_1", ...}
✅ selectNode complete
```

## Common Issues & Solutions

### Issue 1: No console logs when clicking nodes
**Cause:** Nodes not added to canvas OR clicking wrong area
**Solution:** 
- Make sure you loaded a template or dragged nodes to canvas
- Click the center of the node, not the edges or delete button

### Issue 2: Config panel is blank/empty
**Cause:** CSS not loading OR selectedNode is null
**Solution:**
- Check console for "⚙️ Rendering config panel for: node_X"
- Verify "📦 Config panel visible? block" (not "none")
- Hard refresh browser (Cmd+Shift+R)

### Issue 3: Connection ports not visible
**Cause:** CSS not loading OR zoom level too low
**Solution:**
- Check browser zoom is 100%
- Inspect a node element in DevTools
- Verify `.node-port` elements exist in DOM

### Issue 4: Cannot drag to connect
**Cause:** Event listeners not attached OR mousedown blocked
**Solution:**
- Check console for connection-related logs
- Try clicking and holding on the small circle (port)
- Make sure you're not clicking the node body

## Files to Check

If issues persist, verify these files:

1. **index.html** - Should link to `styles.css` and `app.js`
2. **styles.css** - Check `.builder-view` has `display: flex !important`
3. **app.js** - Check `createNodeElement` attaches click listeners

## Next Steps

After following all steps, report:
1. ✅ or ❌ for each step
2. Any console errors (red text)
3. Screenshot of the browser window
4. Screenshot of the console output

---

**Debug Mode:** Extra logging is enabled in this version to help diagnose issues.

