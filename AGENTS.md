# Devin.AI Agents Configuration for CitiFlow Studio

## 🤖 Multi-Agent Architecture

This document outlines the specialized AI agents needed to build CitiFlow Studio efficiently using Devin.AI's multi-agent capabilities.

---

## 🚀 **RECOMMENDED TECH STACK: React + Vite + React Flow**

**Why React for Devin.AI:**
- ⚡ **40% faster development** (8-10 hours vs 15-20 hours)
- 🎯 **React Flow** provides flow builder canvas FREE (saves 6-8 hours!)
- 🎨 **Framer Motion** simplifies animations (1 line vs 20 lines)
- 🤖 **Devin.AI excels** at React (trained on millions of repos)
- 📦 **Production-ready** immediately

**Quick Setup:**
```bash
npm create vite@latest citiflow-studio -- --template react
cd citiflow-studio
npm install reactflow framer-motion zustand lucide-react
npm install -D tailwindcss autoprefixer postcss
npx tailwindcss init -p
```

**See TECH_STACK_RECOMMENDATIONS.md for detailed comparison of all tech stack options.**

---

## 🎯 Agent 1: UI/UX Designer Agent

### **Role:** Frontend Interface & Visual Design

**Responsibilities:**
- Design and implement React component structure
- Set up Tailwind CSS and design system
- Ensure responsive design
- Create professional banking aesthetics
- Implement layout components

**Specific Tasks (React + Vite):**
1. Set up Tailwind CSS with custom design tokens
2. Build App.jsx with 3-panel layout (Flexbox)
3. Create Toolbar.jsx with buttons
4. Create TabSwitcher.jsx component
5. Design chat interface components (ChatHeader, ChatMessages, ChatInput)
6. Create modal components (TemplateModal, MasterBuilderWizard)
7. Design Build Assist floating button with gradient
8. Ensure professional banking look (Tailwind utilities, no emojis)

**Deliverables (React):**
- `App.jsx` - Main layout component
- `tailwind.config.js` - Custom design system
- Component library (10+ reusable components)
- Professional color palette and spacing

**Alternative Deliverables (Vanilla JS):**
- `index.html` - Complete UI structure
- `styles.css` - All styling (2900+ lines)
- Manual DOM manipulation code

**Success Criteria:**
- Professional appearance suitable for banks
- Responsive across devices
- Smooth 60fps animations
- Consistent design language
- Accessible (WCAG 2.1 AA)

**Skills Required (React):**
- React component design
- Tailwind CSS (utility-first styling)
- Responsive design (Tailwind breakpoints)
- Design systems
- Banking UI patterns

**Skills Required (Vanilla JS Alternative):**
- Advanced CSS (Grid, Flexbox, Animations)
- HTML5 best practices
- Manual DOM manipulation

---

## 🎯 Agent 2: Canvas Engineer Agent

### **Role:** Flow Builder Canvas & Visual Editor

**Responsibilities:**
- Integrate React Flow library for visual flow building
- Create custom node components (6 types)
- Configure canvas interactions
- Build configuration panel
- Handle node state management

**Specific Tasks (React + React Flow):**
1. Install and configure React Flow library
2. Create 6 custom node components (StartNode, MessageNode, MenuNode, APINode, ConditionalNode, EndNode)
3. Set up Zustand store for nodes/edges state
4. Style nodes with Tailwind CSS
5. Create ConfigPanel.jsx with dynamic forms
6. Implement node click handlers
7. Add minimap and controls (built into React Flow)
8. Configure auto-layout options

**Deliverables (React Flow):**
- `FlowCanvas.jsx` - React Flow wrapper (~100 lines)
- 6 custom node components (50-100 lines each)
- `flowStore.js` - Zustand state management
- `ConfigPanel.jsx` - Dynamic configuration forms
- **TIME SAVED: 6-8 hours** (vs building canvas from scratch!)

**Alternative Deliverables (Vanilla JS):**
- Canvas rendering functions (~800 lines)
- Manual drag-drop logic (~200 lines)
- SVG connection drawing (~200 lines)
- Zoom/pan implementation (~100 lines)
- **TIME: 6-8 hours of complex code**

**Success Criteria:**
- Smooth drag-and-drop performance
- Accurate connection rendering
- Intuitive configuration editing
- Visual feedback for all interactions
- No lag with 50+ nodes

**Skills Required (React Flow):**
- React Flow library API
- React component design
- Tailwind CSS styling
- Zustand state management
- Custom node creation

**Skills Required (Vanilla JS Alternative):**
- SVG manipulation
- Canvas rendering
- Event handling (mouse, drag)
- DOM optimization
- Complex algorithms (connection routing)

---

## 🎯 Agent 3: Flow Engine Agent

### **Role:** Chatbot Flow Execution & State Management

**Responsibilities:**
- Implement flow execution engine
- Handle different screen types
- Manage chatbot state and variables
- Process variable substitution
- Execute API calls

**Specific Tasks:**
1. Build screen router (renderScreen)
2. Implement MESSAGE screen handler
3. Implement MENU screen handler
4. Implement API_CALL screen handler
5. Implement CONDITIONAL screen handler
6. Create variable substitution system
7. Handle dynamic button generation
8. Manage chatState object
9. Process user interactions

**Deliverables:**
- `renderScreen()` function
- Screen type handlers (handleMessageScreen, handleAPIScreen, etc.)
- Variable system (substituteVariables, getNestedValue)
- Dynamic button generator
- State management

**Success Criteria:**
- All screen types execute correctly
- Variables substitute properly
- API calls work with mocks
- Conditional logic evaluates correctly
- No state corruption
- Smooth flow transitions

**Skills Required:**
- State management
- Asynchronous JavaScript
- Regular expressions
- Functional programming
- Flow control logic

---

## 🎯 Agent 4: Template Specialist Agent

### **Role:** Template Creation & Banking Flow Design

**Responsibilities:**
- Create 20+ banking flow templates
- Design conversational experiences
- Implement realistic scenarios
- Create mock API data
- Ensure production-ready quality

**Specific Tasks:**
1. Design each banking flow (user journey mapping)
2. Create JSON template files
3. Write professional bot messages
4. Design button options and navigation
5. Create mock API responses
6. Test each template end-to-end
7. Update catalog.json metadata
8. Remove all emojis (professional tone)

**Banking Flows to Create:**

**Credit Card Services (10 templates):**
1. card_replacement - Lost/stolen/damaged card replacement
2. check_card_balance - View balance, credit, payment due
3. recent_transactions - Display last 30 days activity
4. dispute_transaction - Report unauthorized charges (conversational!)
5. rewards_redemption - Redeem points for various options
6. autopay_setup - Configure automatic payments
7. credit_limit_increase - Request credit limit boost
8. balance_transfer - Transfer balance from other cards
9. card_activation - Activate new card with PIN setup
10. view_card_statements - Access monthly statements

**Retail Banking (8 templates):**
11. fund_transfer - Transfer between accounts
12. bill_payment - Pay bills to saved payees
13. check_deposit - Mobile check deposit with camera
14. wire_transfer - Domestic and international wires
15. loan_application - Personal loan application (multi-step)
16. stop_payment - Stop payment on check
17. beneficiary_management - Add/edit/delete beneficiaries
18. statement_download - Download statements and tax docs

**Quick Services (4 templates):**
19. account_opening - Open new checking/savings
20. welcome_flow - Simple greeting and navigation
21. check_balance - Basic account balance
22. credit_card_payment - Pay credit card bill

**Deliverables:**
- 20+ JSON template files
- 5+ mock data files
- catalog.json with metadata
- Template documentation

**Success Criteria:**
- Each flow works end-to-end
- Realistic banking scenarios
- Professional messaging (no emojis)
- Proper error handling
- Variable substitution works
- 5-15 screens per template

**Skills Required:**
- Banking domain knowledge
- Conversational design
- User journey mapping
- JSON schema design
- Technical writing

---

## 🎯 Agent 5: Integration Architect Agent

### **Role:** Master Template Builder & System Integration

**Responsibilities:**
- Build unified bot generator
- Implement template merging logic
- Create navigation hierarchy
- Resolve screen ID conflicts
- Ensure seamless integration

**Specific Tasks:**
1. Design 4-step wizard UI
2. Implement template selection logic
3. Build template merging engine
4. Create screen ID prefixing system
5. Generate main menu and category menus
6. Update all screen references
7. Add return navigation automatically
8. Implement smart quick replies
9. Handle deep copying to avoid mutations

**Critical Functions:**
```javascript
- mergeTemplateIntoMaster()
- createMainMenuScreen()
- createCategoryMenus()
- getCategoryTemplateButtons()
- getTemplateStartScreen()
- isEndOrSuccessScreen()
- showSmartQuickReplies()
```

**Deliverables:**
- Master Template Builder modal
- Template merging engine (500+ lines)
- Navigation generation logic
- Smart continuation system

**Success Criteria:**
- No screen ID conflicts
- All references updated correctly
- Navigation works seamlessly
- Can merge 10+ templates without issues
- Smart quick replies appear appropriately
- Both hierarchical and flat modes work

**Skills Required:**
- Complex data transformation
- Graph algorithms (navigation trees)
- Conflict resolution
- Deep copying strategies
- Performance optimization

---

## 🎯 Agent 6: Animation & Polish Agent

### **Role:** User Experience Enhancement & Visual Polish

**Responsibilities:**
- Implement all animations using Framer Motion
- Add typing indicators
- Create typewriter effects
- Polish visual details
- Optimize performance

**Specific Tasks (React + Framer Motion):**
1. Install Framer Motion library
2. Create TypingIndicator.jsx with pulsing dots animation
3. Add slide-in animations to BotMessage.jsx and UserMessage.jsx
4. Create TypewriterText.jsx component (word-by-word reveal)
5. Implement staggerChildren for QuickReplies.jsx
6. Build progressive reveal for formatted content
7. Add hover animations with whileHover prop
8. Create pulsing Build Assist button
9. Use onAnimationComplete for timing

**Animation Implementation (Framer Motion):**
```jsx
// Example: Bot message slide-in
<motion.div
  initial={{ opacity: 0, x: -20, scale: 0.95 }}
  animate={{ opacity: 1, x: 0, scale: 1 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  {message}
</motion.div>

// Example: Staggered quick replies
<motion.div variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
  {buttons.map(btn => <motion.button variants={...} />)}
</motion.div>
```

**Deliverables (Framer Motion):**
- TypingIndicator.jsx component
- BotMessage.jsx with animations
- UserMessage.jsx with animations
- TypewriterText.jsx component
- QuickReplies.jsx with stagger
- **TIME SAVED: 2-3 hours** (vs CSS keyframes!)

**Alternative Deliverables (Vanilla JS):**
- CSS animation keyframes (~200 lines)
- Complex timing calculations with setTimeout
- Manual animation sequencing
- **TIME: 2-3 hours of CSS/JS animation code**

**Success Criteria:**
- Smooth 60fps animations
- Perfect timing (messages before buttons)
- Professional feel
- Not distracting or overwhelming
- Works on all browsers

**Skills Required (Framer Motion):**
- Framer Motion API
- React hooks (useState, useEffect)
- Animation variants and transitions
- Timing and sequencing with callbacks
- Performance optimization

**Skills Required (Vanilla JS Alternative):**
- CSS animations & keyframes
- JavaScript timing (setTimeout, promises)
- Manual easing functions
- Complex animation sequencing

---

## 🎯 Agent 7: Quality Assurance Agent

### **Role:** Testing, Validation & Bug Fixing

**Responsibilities:**
- Test all features
- Validate templates
- Check cross-browser compatibility
- Performance testing
- Bug fixing

**Specific Tasks:**
1. Test each template end-to-end
2. Validate unified bot generation
3. Test variable substitution in all scenarios
4. Check API call handling
5. Verify animations work smoothly
6. Test responsive design
7. Cross-browser testing (Chrome, Firefox, Safari, Edge)
8. Performance profiling
9. Accessibility testing
10. Fix all discovered bugs

**Test Scenarios:**

**Canvas:**
- Add/delete nodes
- Drag nodes around
- Create connections
- Edit configurations
- Export/import JSON

**Chat:**
- Simple flows (3 screens)
- Complex flows (15+ screens)
- API calls (success & error)
- Variable substitution
- Dynamic buttons
- Conditional branching

**Templates:**
- Each template individually
- Unified bot with 5 templates
- Unified bot with 15 templates
- Edge cases (empty, very long messages)

**Deliverables:**
- Bug reports
- Fixed code
- Test documentation
- Performance report

**Success Criteria:**
- Zero critical bugs
- All templates work
- Smooth performance
- Professional quality
- Ready for production

**Skills Required:**
- Manual testing
- Bug identification
- Debugging
- Performance profiling
- Quality standards

---

## 🎯 Agent 8: Documentation Agent

### **Role:** Documentation, Examples & User Guides

**Responsibilities:**
- Write comprehensive documentation
- Create user guides
- Build example flows
- Write API reference
- Create demo scripts

**Specific Tasks:**
1. Write README.md (overview, quick start)
2. Create DEVELOPER_GUIDE.md (technical details)
3. Write API_REFERENCE.md (JSON schema)
4. Create USER_GUIDE.md (business users)
5. Build example templates with comments
6. Write demo scripts
7. Create video script outlines
8. Document deployment process

**Documentation Structure:**

**README.md:**
- Project overview
- Quick start (3 minutes to first flow)
- Key features
- Screenshots
- Installation
- Usage examples

**DEVELOPER_GUIDE.md:**
- Architecture overview
- File structure
- Core concepts
- API integration
- Extending the platform

**API_REFERENCE.md:**
- Flow JSON schema
- Screen types reference
- Variable system
- Dynamic buttons
- Conditional logic
- Best practices

**USER_GUIDE.md:**
- Step-by-step tutorials
- Template library guide
- Unified bot builder guide
- Tips and tricks
- Troubleshooting

**Deliverables:**
- Complete documentation set
- Inline code comments
- Example templates with explanations
- Quick reference cards

**Success Criteria:**
- New developers can onboard in < 2 hours
- Business users can build flows in < 15 minutes
- All features documented
- Examples for every concept
- Clear, concise writing

**Skills Required:**
- Technical writing
- Tutorial design
- Example creation
- Clear communication
- User empathy

---

## 🔄 Agent Collaboration Workflow

### Sequential Phases:
```
Agent 1 (UI/UX) → Agent 2 (Canvas) → Agent 3 (Flow Engine)
                                          ↓
Agent 8 (Docs) ← Agent 7 (QA) ← Agent 6 (Animations) ← Agent 4 (Templates)
                     ↓
              Agent 5 (Integration)
```

### Parallel Work Opportunities:
- **Week 1:** Agent 1 + Agent 2 (UI and Canvas together)
- **Week 2:** Agent 3 + Agent 4 (Engine and Templates together)
- **Week 3:** Agent 5 + Agent 6 (Integration and Polish together)
- **Week 4:** Agent 7 + Agent 8 (QA and Docs together)

### Handoff Points:
1. **Agent 1 → Agent 2:** HTML structure complete
2. **Agent 2 → Agent 3:** Canvas working, nodes configurable
3. **Agent 3 → Agent 4:** Flow engine ready for templates
4. **Agent 4 → Agent 5:** Templates ready to merge
5. **Agent 5 → Agent 6:** Integration complete, ready for polish
6. **Agent 6 → Agent 7:** Animations complete, ready for testing
7. **Agent 7 → Agent 8:** Bugs fixed, ready for documentation

---

## 📋 Agent Communication Protocol

### Daily Standup Format:
**Agent Name:** [1-8]
**Completed:** [What was done]
**In Progress:** [Current work]
**Blockers:** [Dependencies or issues]
**Next:** [What's coming]

### Code Review Checklist:
- [ ] Follows established patterns
- [ ] No breaking changes
- [ ] Performance acceptable
- [ ] Comments added
- [ ] Tested manually
- [ ] No console errors

### Integration Points:
**Agent 2 → Agent 3:**
- Share: Node structure, screen_id format
- Validate: JSON generation matches execution expectations

**Agent 3 → Agent 4:**
- Share: Flow schema, variable system
- Validate: Templates execute correctly

**Agent 4 → Agent 5:**
- Share: Template structure, start screens
- Validate: Merging doesn't break templates

**Agent 5 → Agent 6:**
- Share: Message rendering, quick reply timing
- Validate: Animations don't break navigation

---

## 🎯 Agent Priority Assignments

### Critical Path (Must Complete First):
1. **Agent 1** - UI Layout (foundation)
2. **Agent 2** - Canvas (core feature)
3. **Agent 3** - Flow Engine (makes it work)
4. **Agent 4** - Templates (content)
5. **Agent 5** - Integration (scalability)

### Enhancement Phase (After Core):
6. **Agent 6** - Animations (polish)
7. **Agent 7** - QA (quality)
8. **Agent 8** - Documentation (usability)

### Parallel Opportunities:
- **Agents 1 & 2** can work simultaneously (different files)
- **Agents 4 & 3** can work simultaneously (templates vs engine)
- **Agents 7 & 8** can work simultaneously (testing vs docs)

---

## 🛠️ Agent Tools & Resources

### Agent 1 (UI/UX):
**Tools:**
- CSS Grid/Flexbox generators
- Color palette tools
- Shadow generators
- Animation libraries (for reference)

**References:**
- Material Design guidelines
- Banking app screenshots (Chase, Citi)
- Intercom chat design
- Apple Human Interface Guidelines

### Agent 2 (Canvas):
**Tools:**
- SVG path generators
- Drag-and-drop libraries (for reference, don't use)
- Graph visualization tools

**References:**
- Zapier flow builder
- Make.com visual editor
- Flowchart.js patterns

### Agent 3 (Flow Engine):
**Tools:**
- JSON validators
- State management patterns
- Async/await best practices

**References:**
- Chatbot frameworks (Botpress, Rasa)
- State machine patterns
- Dialog management systems

### Agent 4 (Templates):
**Tools:**
- Banking process maps
- Conversational design tools
- JSON schema validators

**References:**
- Bank customer service scripts
- Banking app user flows
- Conversational design best practices

### Agent 5 (Integration):
**Tools:**
- JSON merge utilities
- Graph algorithms
- Deep copy libraries (for reference)

**References:**
- Multi-flow systems
- Microservices composition
- Navigation hierarchies

### Agent 6 (Animations):
**Tools:**
- Animation timing calculators
- Easing function libraries
- Performance profilers

**References:**
- Apple animation guidelines
- Material Design motion
- Framer Motion examples

### Agent 7 (QA):
**Tools:**
- Browser DevTools
- Performance analyzers
- Accessibility checkers

**References:**
- Testing best practices
- Banking app quality standards
- WCAG guidelines

### Agent 8 (Documentation):
**Tools:**
- Markdown editors
- Screenshot tools
- Diagram creators

**References:**
- Technical writing guides
- Developer documentation examples
- Tutorial best practices

---

## 📊 Agent Performance Metrics

### **RECOMMENDED: React + Vite Stack**

### Agent 1 (UI/UX):
- **React Components:** 15-20 components
- **Tailwind Config:** Custom design tokens
- **Layout Components:** App, Toolbar, TabSwitcher
- **Timeline:** 2 hours ⚡ (vs 3-4 hours vanilla)

### Agent 2 (Canvas):
- **React Flow Setup:** 1 wrapper component
- **Custom Nodes:** 6 components (~50 lines each)
- **Zustand Store:** State management
- **Timeline:** 2 hours ⚡ (vs 6-8 hours vanilla!)
- **🎯 BIGGEST TIME SAVINGS!**

### Agent 3 (Flow Engine):
- **Custom Hooks:** 5+ hooks (useChatFlow, useVariables, etc.)
- **Core Logic:** Same as vanilla (flow execution agnostic)
- **State:** Zustand stores instead of globals
- **Timeline:** 3 hours (vs 4-5 hours vanilla)

### Agent 4 (Templates):
- **Templates:** 20+ complete JSON flows
- **Total screens:** 200+ across all templates
- **Mock files:** 5+ comprehensive datasets
- **Timeline:** 4 hours (same as vanilla - JSON is tech-agnostic)

### Agent 5 (Integration):
- **Wizard:** React components (4 steps)
- **Merging Logic:** Same algorithm (JS utility functions)
- **Navigation:** Same generation logic
- **Timeline:** 2 hours (same as vanilla)

### Agent 6 (Animations):
- **Framer Motion:** 8 animation components
- **Motion Variants:** Declarative animations
- **Timing:** onAnimationComplete callbacks
- **Timeline:** 1 hour ⚡ (vs 2-3 hours vanilla!)
- **🎯 MAJOR TIME SAVINGS!**

### Agent 7 (QA):
- **Test scenarios:** 50+ test cases
- **Component testing:** React Testing Library (optional)
- **Bug fixes:** Variable (5-20 bugs typical)
- **Timeline:** 2 hours (same as vanilla)

### Agent 8 (Documentation):
- **Documents:** 8+ markdown files
- **Component docs:** PropTypes and examples
- **Total words:** 10,000+ words
- **Timeline:** 2 hours (same as vanilla)

---

### **Timeline Comparison:**

**React + Vite (Recommended):**
- Sequential: 18 hours
- Parallel: **8-10 hours** ⚡⚡⚡

**Vanilla JavaScript (Alternative):**
- Sequential: 25-30 hours
- Parallel: **15-20 hours**

**⚡ TIME SAVINGS with React: 40-50%!**

---

## 🎯 Agent Handoff Documents

### Agent 1 → Agent 2 Handoff:
**Completed:**
- index.html structure
- styles.css design system
- Toolbar and tabs working
- Professional color scheme

**For Agent 2:**
- Canvas container: `<div id="canvas">`
- Config panel: `<div id="configPanel">`
- Node should use classes: `.node`, `.node-start`, etc.
- SVG container for connections: `<svg id="connections">`

### Agent 2 → Agent 3 Handoff:
**Completed:**
- Canvas with drag-drop
- Node CRUD operations
- Connection drawing
- Config panel forms

**For Agent 3:**
- Node data structure: `{id, type, x, y, config}`
- Config structure: screen object with all properties
- JSON generation: `generateCitiFlowJSON()`
- Flow format: `{start_screen_id, screens: {}}`

### Agent 3 → Agent 4 Handoff:
**Completed:**
- Flow execution working
- Variable system implemented
- API call handler
- Dynamic buttons working

**For Agent 4:**
- Template schema validated
- Expected API response format
- Variable naming conventions
- Screen type requirements

### Agent 4 → Agent 5 Handoff:
**Completed:**
- 20+ templates created
- All tested individually
- Mock data comprehensive
- Catalog.json complete

**For Agent 5:**
- Template files ready to merge
- Start screen IDs documented
- Category mappings defined
- Friendly names provided

### Agent 5 → Agent 6 Handoff:
**Completed:**
- Unified bot generator working
- Templates merge correctly
- Navigation hierarchy built
- Smart quick replies implemented

**For Agent 6:**
- Message rendering functions identified
- Timing requirements specified
- Animation trigger points
- UX flow documented

### Agent 6 → Agent 7 Handoff:
**Completed:**
- All animations implemented
- Typewriter effect working
- Build Assist button beautiful
- Professional polish applied

**For Agent 7:**
- Complete feature list
- Known edge cases
- Performance benchmarks
- Testing scenarios

### Agent 7 → Agent 8 Handoff:
**Completed:**
- All bugs fixed
- Features validated
- Performance optimized
- Production-ready

**For Agent 8:**
- Feature descriptions
- User scenarios
- Technical details
- Screenshots/demos

---

## 🚀 Quick Start for Devin.AI

### **RECOMMENDED: Initial Prompt with React + Vite**
```
I need to build CitiFlow Studio - an enterprise no-code chatbot builder for banks.

TECH STACK: React 18 + Vite + React Flow + Framer Motion + Tailwind CSS

SETUP:
npm create vite@latest citiflow-studio -- --template react
cd citiflow-studio
npm install reactflow framer-motion zustand lucide-react clsx tailwind-merge
npm install -D tailwindcss autoprefixer postcss
npx tailwindcss init -p

ASSIGN 8 SPECIALIZED AGENTS:
1. UI/UX Agent - Set up Tailwind, create layout components (2hrs)
2. Canvas Agent - Configure React Flow, create custom nodes (2hrs) ⚡ SAVES 6 HRS!
3. Flow Engine Agent - Build execution hooks, variable system (3hrs)
4. Template Agent - Create 20+ banking flow JSONs (4hrs)
5. Integration Agent - Build unified bot merger (2hrs)
6. Animation Agent - Implement Framer Motion animations (1hr) ⚡ SAVES 2 HRS!
7. QA Agent - Test all features (2hrs)
8. Documentation Agent - Write guides (2hrs)

REFERENCE DOCUMENTS:
- DEVIN_AI_PROMPT.md (detailed prompts with React examples)
- PLAYBOOK.md (development phases)
- AGENTS.md (this file - agent configuration)
- TECH_STACK_RECOMMENDATIONS.md (why React + Vite)

KEY ADVANTAGES:
✅ React Flow = Canvas built-in (70% of work done!)
✅ Framer Motion = Animations in 1 line (vs 20 lines CSS)
✅ Tailwind CSS = Professional design 3x faster
✅ Devin.AI = 40% more efficient with React
✅ Timeline: 8-10 hours (vs 15-20 hours vanilla)

START WITH:
Agent 1 + Agent 2 in parallel:
- Agent 1: Set up Tailwind, create App.jsx with 3-panel layout
- Agent 2: Configure React Flow with 6 custom node types

RUN WITH: npm run dev (http://localhost:5173)
```

### **ALTERNATIVE: Vanilla JavaScript Prompt**
```
I need to build CitiFlow Studio - an enterprise no-code chatbot builder for banks.

TECH STACK: Pure HTML/CSS/JavaScript (no frameworks)

SETUP:
mkdir CitiFlowStudio && cd CitiFlowStudio
touch index.html app.js styles.css
mkdir templates mocks

ASSIGN AGENTS:
(Same 8 agents, but with vanilla JS tasks)

TIMELINE: 15-20 hours (40% slower than React)

START WITH:
Agent 1 - Create index.html structure and styles.css design system

RUN WITH: python3 -m http.server 8080

NOTE: React + Vite is STRONGLY RECOMMENDED for faster development.
```

---

## 📈 Success Tracking

### Phase Completion Checklist:
- [ ] Phase 1: Foundation ✅
- [ ] Phase 2: Canvas ✅
- [ ] Phase 3: Chat & Engine ✅
- [ ] Phase 4: Templates ✅
- [ ] Phase 5: Unified Bot ✅
- [ ] Phase 6: Animations ✅
- [ ] Phase 7: QA ✅
- [ ] Phase 8: Documentation ✅

### Agent Completion Tracking:
- [ ] Agent 1: UI/UX Complete
- [ ] Agent 2: Canvas Complete
- [ ] Agent 3: Flow Engine Complete
- [ ] Agent 4: Templates Complete (20+)
- [ ] Agent 5: Integration Complete
- [ ] Agent 6: Animations Complete
- [ ] Agent 7: QA Complete (zero bugs)
- [ ] Agent 8: Documentation Complete

### Final Validation:
- [ ] Platform loads without errors
- [ ] All templates work end-to-end
- [ ] Unified bot generates successfully
- [ ] Animations are smooth
- [ ] Professional appearance
- [ ] Documentation comprehensive
- [ ] Demo-ready
- [ ] Production-ready

---

## 🎉 Expected Outcome

When all agents complete their work, you'll have:

✅ **Professional Platform**
- Enterprise-grade UI
- Smooth animations
- Banking-appropriate design

✅ **Full Feature Set**
- Visual flow builder
- Live chat preview
- 20+ templates
- Unified bot generator
- Export/import
- AI assistance

✅ **Production Quality**
- Zero bugs
- Optimized performance
- Cross-browser compatible
- Comprehensive documentation
- Ready to demo or deploy

✅ **Business Value**
- Non-technical users can build bots
- Templates cover common scenarios
- Scales from simple to complex
- Professional enough for sales demos
- Customizable for different banks

**Total Development Time:** 15-20 hours (with parallel agents)
**Result:** Production-ready no-code chatbot platform for financial institutions

