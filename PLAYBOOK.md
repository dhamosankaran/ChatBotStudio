# CitiFlow Studio - Development Playbook

## 🎯 Project Mission
Build an enterprise no-code chatbot platform that enables financial institutions to create production-ready conversational banking experiences without writing code.

---

## 🚀 **RECOMMENDED TECH STACK: React + Vite**

**Development Time Comparison:**
- **React + Vite:** 8-10 hours ⚡⚡⚡
- **Vanilla JS:** 15-20 hours

**Key Benefits:**
- ✅ **React Flow** - Flow builder canvas built-in (saves 6-8 hours!)
- ✅ **Framer Motion** - Declarative animations (saves 2-3 hours!)
- ✅ **Tailwind CSS** - Rapid professional styling (saves 2 hours!)
- ✅ **Devin.AI Proficiency** - 40% more efficient with React

**Quick Setup:**
```bash
npm create vite@latest citiflow-studio -- --template react
npm install reactflow framer-motion zustand lucide-react tailwindcss
```

**Alternative:** Vanilla HTML/CSS/JavaScript (simpler but slower)

**See TECH_STACK_RECOMMENDATIONS.md for detailed analysis.**

---

## 📋 Development Phases & Milestones

### Phase 1: Foundation (Hours 1-2 with React, 1-4 with Vanilla)
**Goal:** Set up project structure and basic UI layout

#### Milestone 1.1: Project Setup - React + Vite (20 min) ⚡
- [ ] Run `npm create vite@latest citiflow-studio -- --template react`
- [ ] Install dependencies: reactflow, framer-motion, zustand, lucide-react
- [ ] Install Tailwind: `npm install -D tailwindcss autoprefixer postcss`
- [ ] Configure Tailwind: `npx tailwindcss init -p`
- [ ] Set up project structure (components/, hooks/, store/, lib/, data/)
- [ ] Run dev server: `npm run dev`

**Deliverable:** React app running on http://localhost:5173

#### Milestone 1.1 Alternative: Project Setup - Vanilla JS (30 min)
- [ ] Create project directory structure
- [ ] Set up HTML boilerplate with 3-panel layout
- [ ] Initialize CSS with design system variables
- [ ] Create app.js with basic state management
- [ ] Set up local server (Python or Node.js)

**Deliverable:** Static site running on http://localhost:8080

#### Milestone 1.2: Header & Toolbar (45 min)
- [ ] Build header with logo and title
- [ ] Add toolbar buttons (Load Template, Export, Import, Deploy, Help)
- [ ] Implement tab switcher (Flow Builder | JSON Configuration)
- [ ] Add styling for professional appearance
- [ ] Make buttons functional (event handlers)

**Deliverable:** Clickable toolbar and tab navigation

#### Milestone 1.3: Flow Builder Canvas - React Flow (1 hour) ⚡
- [ ] Install React Flow: `npm install reactflow`
- [ ] Create FlowCanvas.jsx wrapper component
- [ ] Create 6 custom node components (StartNode, MessageNode, etc.)
- [ ] Style nodes with Tailwind CSS
- [ ] Set up flowStore.js with Zustand
- [ ] Add Background, Controls, MiniMap from React Flow
- [ ] Handle node selection to show config panel

**Deliverable:** Working React Flow canvas with drag-drop, zoom, pan (built-in!)
**TIME SAVED: 6-8 hours** vs building from scratch!

#### Milestone 1.3 Alternative: Canvas - Vanilla JS (6-8 hours)
- [ ] Create canvas container with grid background
- [ ] Implement manual node rendering
- [ ] Add drag-and-drop with mouse events
- [ ] Draw SVG connection lines manually
- [ ] Implement zoom/pan from scratch
- [ ] Add visual feedback

**Deliverable:** Custom canvas (800+ lines of complex code)

#### Milestone 1.4: Configuration Panel (45 min)
- [ ] Build dynamic config panel
- [ ] Create forms for each node type
- [ ] Add dropdown for screen connections
- [ ] Implement add/remove button functionality
- [ ] Add helper text and placeholders
- [ ] Connect panel to selected node

**Deliverable:** Clicking a node shows editable configuration

---

### Phase 2: Chat Preview & Flow Engine (Hours 5-8)

#### Milestone 2.1: Chat UI (1.5 hours)
- [ ] Build chat header (avatar, name, status)
- [ ] Create message rendering (bot vs user)
- [ ] Add message avatars and timestamps
- [ ] Implement quick reply buttons
- [ ] Style input field and send button
- [ ] Add scrolling behavior

**Deliverable:** Professional-looking chat interface

#### Milestone 2.2: Flow Execution Engine (2 hours)
- [ ] Implement screen router (renderScreen function)
- [ ] Handle MESSAGE screens
- [ ] Handle MENU screens
- [ ] Handle API_CALL screens
- [ ] Handle CONDITIONAL screens
- [ ] Handle END_SCREEN screens
- [ ] Add variable substitution system

**Deliverable:** Basic flows execute correctly

#### Milestone 2.3: Variable System (30 min)
- [ ] Create chatState.variables object
- [ ] Implement substituteVariables function
- [ ] Support nested path access ({{user.card.balance}})
- [ ] Handle set_variable from buttons
- [ ] Store API responses
- [ ] Handle user input variables

**Deliverable:** Variables work throughout flows

#### Milestone 2.4: Dynamic Buttons (1 hour)
- [ ] Parse dynamic_buttons configuration
- [ ] Generate buttons from API response arrays
- [ ] Apply label_template with substitution
- [ ] Handle set_variable for selected item
- [ ] Support pagination (See More)
- [ ] Test with mock data

**Deliverable:** Cards/accounts appear as clickable buttons from API

---

### Phase 3: Templates & Mock Data (Hours 9-12)

#### Milestone 3.1: Template Catalog (1 hour)
- [ ] Create catalog.json with categories
- [ ] Build template modal UI
- [ ] Render templates by category
- [ ] Show template metadata (complexity, screens, time)
- [ ] Implement template loading
- [ ] Add search/filter functionality

**Deliverable:** Template library with 20+ templates listed

#### Milestone 3.2: Basic Templates (1.5 hours)
- [ ] Create check_balance.json (simple API flow)
- [ ] Create welcome_flow.json (basic navigation)
- [ ] Create bill_payment.json (multi-step with API)
- [ ] Test each template end-to-end
- [ ] Verify variable substitution

**Deliverable:** 3 working templates

#### Milestone 3.3: Credit Card Templates (1.5 hours)
- [ ] card_replacement.json (reason selection, address confirm)
- [ ] check_card_balance.json (display balance, offer actions)
- [ ] recent_transactions.json (show top 5, load more option)
- [ ] dispute_transaction.json (conversational, branching logic)
- [ ] rewards_redemption.json (points, redemption options)

**Deliverable:** 5 credit card templates

#### Milestone 3.4: Banking Templates (1 hour)
- [ ] fund_transfer.json (account selection, amount entry)
- [ ] wire_transfer.json (domestic/international)
- [ ] loan_application.json (multi-step form)
- [ ] autopay_setup.json (payment config)
- [ ] beneficiary_management.json (add/edit/delete)

**Deliverable:** 5 banking templates

---

### Phase 4: Master Template Builder (Hours 13-15)

#### Milestone 4.1: Wizard UI (1 hour)
- [ ] Create master template modal
- [ ] Build 4-step wizard (Category → Templates → Config → Generate)
- [ ] Add step indicators
- [ ] Implement next/previous navigation
- [ ] Add validation for each step
- [ ] Style professionally

**Deliverable:** Wizard UI complete

#### Milestone 4.2: Template Merging Engine (1.5 hours)
- [ ] Load multiple templates
- [ ] Prefix all screen IDs (templateId_screenId)
- [ ] Update go_to_screen_id references
- [ ] Update button.go_to_screen_id
- [ ] Update dynamic_buttons.go_to_screen_id
- [ ] Update API on_success/on_error
- [ ] Update conditional references
- [ ] Handle deep copying (avoid mutations)

**Deliverable:** Templates merge without conflicts

#### Milestone 4.3: Menu Generation (30 min)
- [ ] Create main_menu screen
- [ ] Generate category menus (if hierarchical mode)
- [ ] Generate flat menu (if flat mode)
- [ ] Add support screen
- [ ] Add return navigation to success screens
- [ ] Implement smart quick replies after end_flow

**Deliverable:** Unified bot with hierarchical navigation

---

### Phase 5: Animations & Polish (Hours 16-18)

#### Milestone 5.1: Message Animations - Framer Motion (30 min) ⚡
- [ ] Install Framer Motion: `npm install framer-motion`
- [ ] Create TypingIndicator.jsx with motion.div pulsing dots
- [ ] Add slide-in to BotMessage.jsx (initial/animate props)
- [ ] Create TypewriterText.jsx with staggered words
- [ ] Add staggerChildren to QuickReplies.jsx
- [ ] Use onAnimationComplete callbacks for timing
- [ ] Smooth auto-scroll behavior

**Deliverable:** Premium animations with minimal code (~50 lines total!)
**TIME SAVED: 2-3 hours** vs CSS keyframes!

#### Milestone 5.1 Alternative: Animations - Vanilla JS (3 hours)
- [ ] Write CSS keyframes for 8 different animations
- [ ] Implement complex setTimeout timing logic
- [ ] Calculate delays manually
- [ ] Handle animation sequencing
- [ ] Debug timing issues

**Deliverable:** Animations working (200+ lines of CSS/JS)

#### Milestone 5.2: Enhanced Formatting (45 min)
- [ ] Support **bold** markdown syntax
- [ ] Format financial data beautifully
- [ ] Clean line break spacing
- [ ] Add section headers
- [ ] Style lists properly
- [ ] Improve readability

**Deliverable:** Bot messages are beautifully formatted

#### Milestone 5.3: Build Assist Button (45 min)
- [ ] Design prominent floating button
- [ ] Add gradient background
- [ ] Create SVG chat icon
- [ ] Implement pulse animation
- [ ] Add two-line text layout
- [ ] Enhance hover effects
- [ ] Position in bottom-right
- [ ] Control visibility based on active tab

**Deliverable:** Eye-catching Build Assist button

---

## 🎯 Quality Checklist

### Before Each Phase Completion:
- [ ] Code is clean and well-commented
- [ ] No console errors or warnings
- [ ] All features tested manually
- [ ] Responsive on desktop (1920x1080 and 1366x768)
- [ ] Professional appearance maintained
- [ ] Performance is smooth (no lag)

### Before Final Delivery:
- [ ] All 20+ templates work end-to-end
- [ ] Unified bot generator creates working bots
- [ ] Variable substitution works in all scenarios
- [ ] All animations are smooth
- [ ] No emojis in bot responses
- [ ] Export/Import works flawlessly
- [ ] Build Assist provides helpful guidance
- [ ] Code is production-ready
- [ ] README documentation complete

---

## 🏗️ Architecture Decisions

### Why React + Vite (Recommended)?
- ✅ **React Flow library** - Canvas functionality built-in (saves 6-8 hours!)
- ✅ **Framer Motion** - Animations simplified dramatically
- ✅ **Tailwind CSS** - Professional design 3x faster
- ✅ **Component reusability** - DRY principle (Don't Repeat Yourself)
- ✅ **Devin.AI efficiency** - 40% faster development
- ✅ **Maintainable code** - Clear component structure
- ✅ **Production-ready** - Can scale to SaaS
- ✅ **Modern ecosystem** - Tons of libraries available

### Why Vanilla JavaScript (Alternative)?
- ✅ No build process needed
- ✅ Zero dependencies
- ✅ Simplest possible setup
- ✅ Works on very old browsers
- ❌ Takes 40% longer to build
- ❌ More verbose code
- ❌ Manual DOM manipulation

**Recommendation:** Use React + Vite unless you have specific constraints requiring vanilla JS.

### Why JSON-Based Flows?
- ✅ Human-readable configuration
- ✅ Easy to export/import
- ✅ Version control friendly
- ✅ Can be generated programmatically
- ✅ Business users can understand

### Why Mock Files?
- ✅ Works without backend
- ✅ Realistic demo experience
- ✅ Easy to customize
- ✅ Fast testing iterations
- ✅ No API keys needed

### Why Template System?
- ✅ Accelerates bot building
- ✅ Teaches best practices
- ✅ Reusable across clients
- ✅ Consistent patterns
- ✅ Easy to maintain

---

## 🎨 Design Philosophy

### 1. **Professional First**
Every design decision prioritizes financial institution standards:
- No emojis in bot responses
- Banking-appropriate colors (blues, grays, greens)
- Clear, concise messaging
- Enterprise-grade UI components

### 2. **User Experience**
Optimize for business users (non-technical):
- Visual, not code-based
- Helpful hints and tooltips
- Clear error messages
- Undo/redo capabilities
- Auto-save considerations

### 3. **Performance**
Keep interactions fast:
- Lazy load templates
- Cache loaded templates
- Debounce canvas operations
- Optimize animations (GPU-accelerated)
- Minimize DOM manipulations

### 4. **Scalability**
Design for growth:
- Template system allows unlimited flows
- Unified bot supports 100+ services
- Modular code architecture
- Easy to add new node types
- Extensible API system

---

## 🧪 Testing Strategy

### Unit Testing (Manual)
**Canvas Operations:**
- [ ] Add each node type
- [ ] Drag nodes around
- [ ] Connect nodes
- [ ] Delete nodes
- [ ] Edit configuration
- [ ] Export to JSON

**Chat Preview:**
- [ ] Simple message flow
- [ ] Menu with buttons
- [ ] API call with success
- [ ] API call with error
- [ ] Conditional branching
- [ ] Variable substitution

**Templates:**
- [ ] Load each template
- [ ] Deploy and test
- [ ] Complete full flow
- [ ] Test error paths
- [ ] Verify variables display

### Integration Testing
**Unified Bot:**
- [ ] Build bot with 5 templates
- [ ] Test hierarchical navigation
- [ ] Test flat navigation
- [ ] Complete multiple flows in sequence
- [ ] Verify smart quick replies
- [ ] Test return to main menu

**Edge Cases:**
- [ ] Empty canvas deploy
- [ ] Circular flow references
- [ ] Missing screen IDs
- [ ] Invalid JSON import
- [ ] Network timeout simulation
- [ ] Very long messages
- [ ] 20+ quick reply buttons

### User Acceptance Testing
**Business User Scenarios:**
- [ ] Build a simple flow from scratch (10 min)
- [ ] Load and customize a template (5 min)
- [ ] Create unified bot with 10 services (5 min)
- [ ] Test flows end-to-end (10 min)
- [ ] Export and share JSON (2 min)

---

## 🚀 Deployment Checklist

### Pre-Deployment:
- [ ] All features working
- [ ] No console errors
- [ ] Performance optimized
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)
- [ ] Responsive on all devices
- [ ] Documentation complete
- [ ] Example templates included
- [ ] Mock data realistic

### Deployment Options:
1. **Static Hosting:** Netlify, Vercel, GitHub Pages
2. **Server:** Express.js, Python Flask
3. **Enterprise:** Custom domain with SSL

### Post-Deployment:
- [ ] Monitor for errors
- [ ] Collect user feedback
- [ ] Iterate on UX improvements
- [ ] Add requested templates
- [ ] Enhance documentation

---

## 📈 Future Enhancements (Post-V1)

### Advanced Features:
- [ ] Real API integration (not just mocks)
- [ ] User authentication
- [ ] Save flows to database
- [ ] Multi-user collaboration
- [ ] Version control for flows
- [ ] A/B testing flows
- [ ] Analytics dashboard
- [ ] Custom branding per client

### AI Features:
- [ ] AI flow generator from description
- [ ] Auto-optimize flows
- [ ] Suggest improvements
- [ ] Generate test scenarios
- [ ] Natural language flow building

### Enterprise Features:
- [ ] Role-based access control
- [ ] Audit logging
- [ ] Compliance reporting
- [ ] Multi-language support
- [ ] White-label options
- [ ] Template marketplace

---

## 🎓 Learning Resources

### For Devin to Reference:
- **Chatbot UX:** Intercom Messenger, Drift playbooks
- **Flow Builders:** Zapier interface, Make.com editor
- **Banking UX:** Chase mobile app, Bank of America website
- **Design Systems:** Material Design, Apple HIG, IBM Carbon
- **Animations:** Framer Motion principles, Apple Human Interface Guidelines

### Key Concepts:
- **Conversational Design:** How to structure dialog flows
- **State Management:** Managing chatbot context and variables
- **JSON Schema:** Defining flexible, extendable configuration
- **Progressive Enhancement:** Start simple, add complexity
- **Banking Compliance:** Professional tone, security considerations

---

## 💡 Best Practices

### Code Quality:
1. **Comment liberally** - Explain why, not just what
2. **Use meaningful names** - createMainMenuScreen(), not doStuff()
3. **Keep functions small** - Single responsibility principle
4. **Avoid magic numbers** - Use named constants
5. **Handle errors gracefully** - Never show technical errors to users

### UX Principles:
1. **Feedback** - Every action gets a response (toasts, animations)
2. **Consistency** - Same patterns throughout
3. **Clarity** - Clear labels, no jargon
4. **Forgiveness** - Easy undo, confirm destructive actions
5. **Efficiency** - Minimize clicks to complete tasks

### Banking Standards:
1. **Professional tone** - No emojis in bot responses
2. **Clear language** - Financial terms explained
3. **Security mindset** - Mention verification, confirmations
4. **Helpful** - Provide multiple channels (app, web, phone)
5. **Trustworthy** - Accurate information, reliable flows

---

## 🐛 Common Issues & Solutions

### Issue 1: "Screen not found" errors
**Cause:** Incorrect go_to_screen_id references
**Solution:** 
- Validate all screen_id references
- Use dropdown populated from available screens
- In unified bot, ensure all IDs are prefixed

### Issue 2: Variables showing {{variable}} instead of values
**Cause:** Variable not set or wrong path
**Solution:**
- Check variable is set before screen renders
- Verify nested path is correct
- Log chatState.variables for debugging
- Ensure set_variable logic executes

### Issue 3: Buttons appearing before message
**Cause:** No delay for animations
**Solution:**
- Calculate animation duration
- Use setTimeout before showing buttons
- Account for typing indicator + typewriter effect

### Issue 4: Dynamic buttons not working in unified bot
**Cause:** go_to_screen_id not prefixed
**Solution:**
- Update mergeTemplateIntoMaster to handle dynamic_buttons
- Check screen exists in template before prefixing
- Exclude only null, not 'end_flow'

### Issue 5: Animations choppy or laggy
**Cause:** Too many DOM operations or heavy CSS
**Solution:**
- Use CSS transforms (GPU-accelerated)
- Batch DOM updates
- Use requestAnimationFrame for smooth animations
- Reduce animation complexity

---

## 📊 Success Metrics

### Technical Metrics:
- **Load time:** < 2 seconds
- **Interaction response:** < 100ms
- **Animation FPS:** 60fps
- **Template load:** < 500ms
- **Unified bot generation:** < 2 seconds
- **Zero console errors**

### User Metrics:
- **Time to build first flow:** < 15 minutes (new user)
- **Time to load template:** < 30 seconds
- **Time to create unified bot:** < 5 minutes
- **User satisfaction:** "This is easy!" feedback

### Business Metrics:
- **Templates created:** 20+ production-ready
- **Reusability:** 80%+ of flows use templates
- **Adoption:** Business users build without dev help
- **Quality:** Flows work in production without bugs

---

## 🎯 Definition of Done

### For Each Feature:
- [ ] Implemented according to spec
- [ ] Tested in all scenarios
- [ ] No console errors
- [ ] Responsive design
- [ ] Professional appearance
- [ ] Documentation updated
- [ ] Code commented
- [ ] Performance acceptable

### For Each Template:
- [ ] Works end-to-end
- [ ] All variables substitute correctly
- [ ] API calls function with mocks
- [ ] Error handling implemented
- [ ] Professional messaging (no emojis)
- [ ] Navigation clear
- [ ] Realistic scenarios
- [ ] Proper metadata in catalog

### For Final Delivery:
- [ ] All phases complete
- [ ] All tests passing
- [ ] Documentation comprehensive
- [ ] Demo-ready
- [ ] Production-ready code
- [ ] Deployment instructions
- [ ] Example templates included
- [ ] User guide created

---

## 🎓 Knowledge Transfer

### For Future Developers:
**Read First:**
1. README.md - Overview and quick start
2. DEVELOPER_GUIDE.md - Technical architecture
3. API_REFERENCE.md - Flow JSON schema
4. This PLAYBOOK.md - Development process

**Key Files to Understand:**
1. `app.js` lines 3569-3700: Flow execution engine
2. `app.js` lines 4580-4750: Template merging logic
3. `app.js` lines 3820-3950: Message rendering with animations
4. `templates/catalog.json`: Template organization
5. `styles.css` lines 1600-1750: Chat interface styling

**Concepts to Master:**
1. **Flow Schema:** How screens, buttons, and navigation work
2. **Variable System:** How data flows through the chat
3. **Template Merging:** How multiple templates become one bot
4. **Animation Timing:** How to sequence UI updates
5. **Dynamic Buttons:** How API data becomes clickable options

---

## 🔄 Iteration Strategy

### Sprint 1 (Week 1): MVP
- Foundation + Canvas + Basic Chat
- Goal: Prove the concept works

### Sprint 2 (Week 2): Templates
- Create 10 core templates
- Goal: Demonstrate real banking scenarios

### Sprint 3 (Week 3): Unified Bot
- Master Template Builder
- Goal: Show scalability

### Sprint 4 (Week 4): Polish
- Animations, Build Assist, UX refinements
- Goal: Production-ready quality

### Sprint 5+ (Ongoing): Enhancements
- Additional templates
- Advanced features
- Client customizations

---

## 📞 Stakeholder Communication

### Daily Updates:
- What was completed today
- What's in progress
- Any blockers
- Demo of working features

### Weekly Demos:
- Show completed features
- Walk through user scenarios
- Collect feedback
- Adjust priorities

### Final Presentation:
- Live demo of all features
- Walk through creating a flow
- Show unified bot generation
- Demonstrate template variety
- Discuss deployment options

---

## 🎉 Success Criteria

**The project is successful when:**
1. ✅ A non-technical business user can build a working chatbot in 15 minutes
2. ✅ Templates cover 90% of common banking scenarios
3. ✅ Unified bot generator creates professional multi-service assistants
4. ✅ UI is polished enough for sales demos
5. ✅ Code is clean enough to hand off to client
6. ✅ Platform can be white-labeled for different banks
7. ✅ Stakeholders say "This is exactly what we needed!"

---

**This playbook provides a clear path from zero to production-ready platform. Follow the phases sequentially, validate each milestone, and maintain quality standards throughout.**

---

## ⚡ **Development Timeline Summary**

### **React + Vite + React Flow (Recommended):**

| Phase | Milestone | Time (React) | Time (Vanilla) | Savings |
|-------|-----------|--------------|----------------|---------|
| **Phase 1** | Foundation & Setup | 2 hours | 4 hours | 2 hours ⚡ |
| **Phase 2** | Chat & Flow Engine | 4 hours | 5 hours | 1 hour ⚡ |
| **Phase 3** | Templates & Mocks | 4 hours | 4 hours | 0 (same) |
| **Phase 4** | Master Builder | 2 hours | 2-3 hours | 0-1 hour |
| **Phase 5** | Animations & Polish | 1.5 hours | 4 hours | 2.5 hours ⚡ |
| **TOTAL** | **All Phases** | **8-10 hours** | **15-20 hours** | **40-50% faster!** |

### **Key Time Savings with React:**
1. 🎯 **React Flow** (Agent 2): 6-8 hours saved on canvas
2. 🎨 **Framer Motion** (Agent 6): 2-3 hours saved on animations
3. 🎨 **Tailwind CSS** (Agent 1): 2 hours saved on styling
4. 🔧 **Component Reuse**: 2-3 hours saved on UI patterns
5. 🤖 **Devin.AI Efficiency**: Generally faster with React

**Total Time Savings: 12-16 hours = 40-50% reduction!**

---

## 🎯 **Final Recommendation**

**For Devin.AI Development:**
- ✅ **Use React + Vite + React Flow**
- ✅ **Follow this playbook** adapted for React components
- ✅ **Reference TECH_STACK_RECOMMENDATIONS.md** for setup details
- ✅ **Use AGENTS.md** for multi-agent coordination
- ✅ **Target timeline:** 8-10 hours to production-ready platform

**Alternative:** Vanilla JS if you have specific constraints (no build step, no dependencies)
- Timeline: 15-20 hours
- More code, but simpler architecture

