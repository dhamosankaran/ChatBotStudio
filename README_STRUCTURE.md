# CitiFlow Studio - Project Structure

## 📁 Folder Organization

This folder contains the **refactored and organized** CitiFlow Studio project with clean separation of concerns.

## 🚀 Quick Start

To run the application:

1. Open `index.html` in a modern web browser (Chrome, Firefox, Edge, or Safari)
2. The application will load with all styles and scripts properly linked
3. Start building your chatbot flows!

> **Note:** This is a static web application that runs entirely in the browser. No server setup required!

## 📂 File Structure

```
CitiFlowStudio/
├── index.html                          # Main HTML structure
├── styles.css                          # All CSS styling (extracted from original)
├── app.js                              # All JavaScript logic (extracted from original)
├── citiflow-studio-original.html      # Original monolithic file (backup)
│
├── README_STRUCTURE.md                 # This file - explains project structure
├── README.md                           # Original project README
├── DEVELOPER_GUIDE.md                  # Developer documentation
│
├── CITIFLOW_STUDIO_GUIDE.md           # User guide for CitiFlow Studio
├── CITIFLOW_STUDIO_v2_UPDATES.md      # Version 2 updates and features
├── DEMO_QUICK_REFERENCE.md            # Quick reference guide for demos
├── RUN_PROTOTYPE.md                    # Instructions for running the prototype
├── PROJECT_SUMMARY.md                  # Overall project summary
│
├── BILL_PAYMENT_DEMO_GUIDE.md         # Guide for bill payment flow demo
└── BILL_PAYMENT_FLOW_DIAGRAM.md       # Flow diagram for bill payment
```

## 🎯 Core Files

### `index.html`
- Clean HTML structure without embedded styles or scripts
- References external CSS and JavaScript files
- Contains all UI elements and layout structure
- Fully responsive and accessible

### `styles.css`
- **1,720 lines** of pure CSS
- Complete styling for all components
- Includes:
  - Layout and grid system
  - Component-specific styles
  - Animations and transitions
  - Responsive design rules
  - Color scheme and theming

### `app.js`
- **2,750+ lines** of JavaScript
- Complete application logic including:
  - Node management and canvas rendering
  - Drag-and-drop functionality
  - Flow configuration management
  - API integration and mock responses
  - Chat preview and testing
  - Template management
  - Export/import functionality

## 🔧 Benefits of This Structure

### 1. **Maintainability**
   - Easy to find and modify specific code
   - Clear separation of concerns (HTML/CSS/JS)
   - Better organization for team collaboration

### 2. **Performance**
   - Browser can cache CSS and JS separately
   - Faster page loads after initial visit
   - Better debugging capabilities

### 3. **Development Experience**
   - Syntax highlighting works properly in editors
   - Easier to use version control (Git)
   - Can use CSS/JS linting tools
   - Better IDE support and autocomplete

### 4. **Scalability**
   - Easy to add new features
   - Can split JS into multiple modules if needed
   - Can add preprocessors (SASS, TypeScript) later

## 📚 Documentation Files

### User Guides
- **CITIFLOW_STUDIO_GUIDE.md**: Complete user guide with tutorials
- **DEMO_QUICK_REFERENCE.md**: Quick reference for common tasks
- **RUN_PROTOTYPE.md**: Step-by-step setup instructions

### Developer Resources
- **DEVELOPER_GUIDE.md**: Technical documentation for developers
- **CITIFLOW_STUDIO_v2_UPDATES.md**: New features and changes in v2

### Flow Demonstrations
- **BILL_PAYMENT_DEMO_GUIDE.md**: Detailed bill payment flow guide
- **BILL_PAYMENT_FLOW_DIAGRAM.md**: Visual flow diagrams

### Project Overview
- **PROJECT_SUMMARY.md**: High-level project overview
- **README.md**: Original project README

## 🛠️ Development Workflow

### Making Changes

#### To modify styles:
```bash
# Edit styles.css
# Refresh browser to see changes
```

#### To modify functionality:
```bash
# Edit app.js
# Refresh browser to see changes
```

#### To modify structure:
```bash
# Edit index.html
# Refresh browser to see changes
```

### Adding New Features

1. **New UI Component**: Add HTML in `index.html`, styles in `styles.css`
2. **New Functionality**: Add JavaScript in `app.js`
3. **New Template**: Update template section in `app.js`

## 🔄 Comparison with Original

### Original Structure (citiflow-studio-original.html)
```
└── citiflow-studio.html (4,747 lines - everything in one file)
    ├── HTML structure
    ├── <style> tag with 1,720 lines of CSS
    └── <script> tag with 2,750+ lines of JavaScript
```

### New Structure
```
├── index.html (305 lines - clean HTML only)
├── styles.css (1,720 lines - all styles)
└── app.js (2,750+ lines - all logic)
```

## 🚦 Testing

After making changes, test:

1. **Load the application** - Open `index.html` in browser
2. **Check console** - Look for JavaScript errors (F12 → Console)
3. **Test features** - Try creating nodes, connecting them, deploying flows
4. **Check responsiveness** - Test on different screen sizes

## 📦 Deployment

To deploy this application:

1. **Static Hosting**: Upload all files to any static host (GitHub Pages, Netlify, Vercel)
2. **Web Server**: Place files in web server directory (Apache, Nginx)
3. **Local Development**: Simply open `index.html` in browser

### Required Files for Deployment
```
CitiFlowStudio/
├── index.html    ← Required
├── styles.css    ← Required
└── app.js        ← Required
```

## 🐛 Troubleshooting

### Styles not loading?
- Check that `styles.css` is in the same folder as `index.html`
- Verify the `<link>` tag in `index.html` has correct path
- Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)

### JavaScript not working?
- Check that `app.js` is in the same folder as `index.html`
- Verify the `<script>` tag in `index.html` has correct path
- Check browser console for errors (F12)

### Features missing?
- Ensure you're opening `index.html`, not `citiflow-studio-original.html`
- Make sure all three files (HTML, CSS, JS) are from the same version

## 📞 Support

For questions or issues:
1. Check the documentation files in this folder
2. Review the `DEVELOPER_GUIDE.md` for technical details
3. Refer to `CITIFLOW_STUDIO_GUIDE.md` for usage instructions

## ✅ Version Information

- **Original File**: 4,747 lines (monolithic)
- **Refactored Structure**: 3 clean, manageable files
- **Extraction Date**: November 2024
- **Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)

---

**Note**: The `citiflow-studio-original.html` file is kept as a backup reference. The new structure (`index.html` + `styles.css` + `app.js`) is functionally identical but much better organized.

