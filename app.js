// Global State
let nodes = [];
let selectedNode = null;
let nodeIdCounter = 1;
let draggedNodeType = null;
let isDraggingNode = false;
let dragOffset = { x: 0, y: 0 };

// Connection State
let isDrawingConnection = false;
let connectionStart = null;
let tempConnectionLine = null;
let manualConnections = [];

// Chat State
let chatState = {
    variables: {},
    currentScreenId: null,
    flowConfig: null,
    messageHistory: []
};

// ========== JSON IMPORT/EXPORT FUNCTIONS ==========
// Define these functions FIRST to ensure they're available when HTML loads

function importJSON() {
    console.log('📁 Import JSON button clicked');

    try {
        // Create a file input element
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        input.style.display = 'none';
        
        input.onchange = function(event) {
            console.log('📄 File selected:', event.target.files[0]?.name);
            const file = event.target.files[0];
            if (!file) {
                if (document.body && document.body.contains(input)) {
                    document.body.removeChild(input);
                }
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const json = JSON.parse(e.target.result);
                    
                    // Validate JSON structure
                    if (!json.screens || typeof json.screens !== 'object') {
                        throw new Error('Invalid flow format: missing "screens" object');
                    }
                    
                    if (!json.start_screen_id) {
                        throw new Error('Invalid flow format: missing "start_screen_id"');
                    }
                    
                    if (typeof loadFlowFromJSON === 'function') {
                        loadFlowFromJSON(json);
                        showToast('✅ JSON file imported successfully!');
                        
                        // Switch to builder view
                        const builderView = document.getElementById('builderView');
                        const jsonView = document.getElementById('jsonView');
                        if (builderView && jsonView) {
                            builderView.style.display = 'flex';
                            jsonView.classList.remove('active');
                        }
                    } else {
                        showToast('❌ Flow loader not ready. Please refresh the page.');
                    }
                    
                    // Clean up
                    if (document.body && document.body.contains(input)) {
                        document.body.removeChild(input);
                    }
                } catch (error) {
                    if (typeof showToast === 'function') {
                        showToast('❌ Error parsing JSON: ' + error.message);
                    }
                    console.error('JSON parse error:', error);
                    if (document.body && document.body.contains(input)) {
                        document.body.removeChild(input);
                    }
                }
            };
            
            reader.onerror = function() {
                if (typeof showToast === 'function') {
                    showToast('❌ Error reading file');
                }
                console.error('File read error');
                if (document.body && document.body.contains(input)) {
                    document.body.removeChild(input);
                }
            };
            
            reader.readAsText(file);
        };
        
        // Add to DOM temporarily (required for some browsers)
        if (document.body) {
            document.body.appendChild(input);
            // Trigger file dialog
            input.click();
            
            // Clean up if user cancels (after a delay)
            setTimeout(() => {
                if (document.body && document.body.contains(input)) {
                    document.body.removeChild(input);
                }
            }, 1000);
        } else {
            showToast('❌ Page not ready. Please try again.');
        }
    } catch (error) {
        console.error('Error in importJSON:', error);
        if (typeof showToast === 'function') {
            showToast('❌ Error opening file dialog: ' + error.message);
        }
    }
}

function loadJSONFromText() {
    const textarea = document.getElementById('jsonTextArea');
    if (!textarea) {
        if (typeof showToast === 'function') {
            showToast('❌ JSON textarea not found!');
        }
        return;
    }
    
    const text = textarea.value.trim();
    
    if (!text) {
        if (typeof showToast === 'function') {
            showToast('❌ Please paste JSON configuration first!');
        }
        return;
    }
    
    try {
        const json = JSON.parse(text);
        
        // Validate JSON structure
        if (!json.screens || typeof json.screens !== 'object') {
            throw new Error('Invalid flow format: missing "screens" object');
        }
        
        if (!json.start_screen_id) {
            throw new Error('Invalid flow format: missing "start_screen_id"');
        }
        
        if (typeof loadFlowFromJSON === 'function') {
            loadFlowFromJSON(json);
            if (typeof showToast === 'function') {
                showToast('✅ JSON configuration loaded successfully!');
            }
            
            // Clear the textarea after successful load
            textarea.value = '';
            
            // Switch to builder view
            const builderView = document.getElementById('builderView');
            const jsonView = document.getElementById('jsonView');
            if (builderView && jsonView) {
                builderView.style.display = 'flex';
                jsonView.classList.remove('active');
            }
        } else {
            if (typeof showToast === 'function') {
                showToast('❌ Flow loader not ready. Please refresh the page.');
            }
        }
    } catch (error) {
        if (typeof showToast === 'function') {
            showToast('❌ Error parsing JSON: ' + error.message);
        }
        console.error('JSON parse error:', error);
    }
}

function handleJSONDrop(event) {
    event.preventDefault();
    
    const files = event.dataTransfer.files;
    if (files.length === 0) return;
    
    const file = files[0];
    if (!file.type.includes('json') && !file.name.endsWith('.json')) {
        if (typeof showToast === 'function') {
            showToast('❌ Please drop a JSON file!');
        }
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const json = JSON.parse(e.target.result);
            if (typeof loadFlowFromJSON === 'function') {
                loadFlowFromJSON(json);
                if (typeof showToast === 'function') {
                    showToast('✅ JSON file imported via drag & drop!');
                }
                
                // Switch to builder view
                const builderView = document.getElementById('builderView');
                const jsonView = document.getElementById('jsonView');
                if (builderView && jsonView) {
                    builderView.style.display = 'flex';
                    jsonView.classList.remove('active');
                }
            } else {
                if (typeof showToast === 'function') {
                    showToast('❌ Flow loader not ready. Please refresh the page.');
                }
            }
        } catch (error) {
            if (typeof showToast === 'function') {
                showToast('❌ Error parsing JSON: ' + error.message);
            }
            console.error('JSON parse error:', error);
        }
    };
    reader.readAsText(file);
}

// Explicitly attach to window object IMMEDIATELY to ensure global access
window.importJSON = importJSON;
window.exportJSON = exportJSON;
window.loadJSONFromText = loadJSONFromText;
window.handleJSONDrop = handleJSONDrop;

// Debug: Verify functions are attached
console.log('✅ Import/Export functions attached to window:', {
    importJSON: typeof window.importJSON,
    exportJSON: typeof window.exportJSON,
    loadJSONFromText: typeof window.loadJSONFromText,
    handleJSONDrop: typeof window.handleJSONDrop
});

// Mock API Library - Expanded with Banking Intents
const apiLibrary = [
    {
        name: 'Get User Accounts',
        method: 'GET',
        endpoint: 'https://api.citi.com/v1/user/accounts',
        description: 'Retrieves all bank accounts for the authenticated user including checking, savings, and investment accounts.',
        category: 'Accounts',
        mockResponse: {
        accounts: [
            { id: 'acc1', name: 'Checking', last_four: '8041', balance: '5,234.50' },
            { id: 'acc2', name: 'Savings', last_four: '5523', balance: '12,450.50' },
            { id: 'acc3', name: 'Investment', last_four: '3099', balance: '28,750.00' }
        ]
    }
    },
    {
        name: 'Get Account Transactions',
        method: 'GET',
        endpoint: 'https://api.citi.com/v1/accounts/{account_id}/transactions',
        description: 'Fetches recent transactions for a specific account including date, amount, description, and category.',
        category: 'Accounts',
        mockResponse: {
            transactions: [
                { date: '2024-11-08', amount: '-45.32', description: 'Amazon Purchase', category: 'Shopping' },
                { date: '2024-11-07', amount: '-12.50', description: 'Starbucks Coffee', category: 'Food & Dining' },
                { date: '2024-11-06', amount: '+2,500.00', description: 'Salary Deposit', category: 'Income' }
            ]
        }
    },
    {
        name: 'Check Account Balance',
        method: 'GET',
        endpoint: 'https://api.citi.com/v1/accounts/{account_id}/balance',
        description: 'Get the current balance for a specific account with available and pending amounts.',
        category: 'Accounts',
        mockResponse: {
            account_id: 'acc1',
            account_name: 'Checking',
            current_balance: '5,234.50',
            available_balance: '5,134.50',
            pending_amount: '100.00',
            currency: 'USD'
        }
    },
    {
        name: 'Find Nearest ATMs',
        method: 'GET',
        endpoint: 'https://api.citi.com/v1/atms/nearby',
        description: 'Locates Citi ATMs near the user based on their current location or provided coordinates.',
        category: 'Locations',
        mockResponse: {
            atms: [
                { name: 'Citi ATM - Main St', address: '123 Main Street', distance: '0.2 miles', available_24_7: true },
                { name: 'Citi ATM - Park Ave', address: '456 Park Avenue', distance: '0.5 miles', available_24_7: true },
                { name: 'Citi ATM - Downtown', address: '789 Center Plaza', distance: '0.8 miles', available_24_7: false }
            ]
        }
    },
    {
        name: 'Find Branch Locations',
        method: 'GET',
        endpoint: 'https://api.citi.com/v1/branches/nearby',
        description: 'Find Citi branch locations near the user with hours and services offered.',
        category: 'Locations',
        mockResponse: {
            branches: [
                { name: 'Citi Branch - Main Street', address: '100 Main Street', distance: '0.3 miles', hours: 'Mon-Fri 9AM-5PM', services: ['Account Opening', 'Loans', 'Safe Deposit'] },
                { name: 'Citi Branch - Downtown', address: '500 Center Plaza', distance: '1.2 miles', hours: 'Mon-Sat 9AM-6PM', services: ['Account Opening', 'Notary', 'Business Banking'] }
            ]
        }
    },
    {
        name: 'Transfer Funds',
        method: 'POST',
        endpoint: 'https://api.citi.com/v1/transfer',
        description: 'Transfers money between user accounts or to external accounts. Requires from_account, to_account, and amount.',
        category: 'Transactions',
        mockResponse: {
            status: 'success',
            transaction_id: 'TXN-2024-001234',
            message: 'Transfer completed successfully',
            amount: '500.00',
            from_account: 'Checking x8041',
            to_account: 'Savings x5523'
        }
    },
    {
        name: 'Schedule Transfer',
        method: 'POST',
        endpoint: 'https://api.citi.com/v1/transfer/schedule',
        description: 'Schedule a future or recurring fund transfer between accounts.',
        category: 'Transactions',
        mockResponse: {
            status: 'scheduled',
            schedule_id: 'SCH-2024-567890',
            message: 'Transfer scheduled successfully',
            amount: '1,000.00',
            from_account: 'Checking x8041',
            to_account: 'Savings x5523',
            scheduled_date: '2024-11-20',
            frequency: 'monthly'
        }
    },
    {
        name: 'Get Credit Card Info',
        method: 'GET',
        endpoint: 'https://api.citi.com/v1/credit-cards',
        description: 'Retrieves credit card details including available credit, current balance, payment due date, and rewards points.',
        category: 'Credit Cards',
        mockResponse: {
            cards: [
                { 
                    card_name: 'Citi Rewards Card', 
                    last_four: '4532', 
                    available_credit: '8,500.00',
                    current_balance: '1,234.50',
                    due_date: '2024-11-28',
                    minimum_payment: '35.00',
                    rewards_points: 12450
                }
            ]
        }
    },
    {
        name: 'Activate Credit Card',
        method: 'POST',
        endpoint: 'https://api.citi.com/v1/credit-cards/activate',
        description: 'Activate a newly issued credit card by providing card number and security code.',
        category: 'Credit Cards',
        mockResponse: {
            status: 'activated',
            message: 'Your Citi Rewards Card has been activated successfully',
            card_last_four: '4532',
            activation_date: '2024-11-10'
        }
    },
    {
        name: 'Report Lost/Stolen Card',
        method: 'POST',
        endpoint: 'https://api.citi.com/v1/credit-cards/report-lost',
        description: 'Report a credit or debit card as lost or stolen and request a replacement.',
        category: 'Credit Cards',
        mockResponse: {
            status: 'reported',
            message: 'Card has been blocked. Replacement card will arrive in 5-7 business days',
            old_card_last_four: '4532',
            replacement_tracking_id: 'REPL-2024-789012',
            estimated_delivery: '2024-11-17'
        }
    },
    {
        name: 'Make Credit Card Payment',
        method: 'POST',
        endpoint: 'https://api.citi.com/v1/credit-cards/payment',
        description: 'Make a payment towards credit card balance from a checking or savings account.',
        category: 'Credit Cards',
        mockResponse: {
            status: 'success',
            confirmation_number: 'PAY-CC-2024-345678',
            message: 'Payment processed successfully',
            amount: '500.00',
            from_account: 'Checking x8041',
            to_card: 'Citi Rewards x4532',
            payment_date: '2024-11-10',
            new_balance: '734.50'
        }
    },
    {
        name: 'Get Rewards Points Balance',
        method: 'GET',
        endpoint: 'https://api.citi.com/v1/rewards/balance',
        description: 'Check current rewards points balance and available redemption options.',
        category: 'Credit Cards',
        mockResponse: {
            total_points: 12450,
            cash_value: '124.50',
            tier: 'Gold',
            points_to_next_tier: 2550,
            expiring_soon: {
                points: 500,
                expiry_date: '2024-12-31'
            }
        }
    },
    {
        name: 'Pay Bill',
        method: 'POST',
        endpoint: 'https://api.citi.com/v1/bills/pay',
        description: 'Processes bill payment from user account. Requires payee information, amount, and payment date.',
        category: 'Payments',
        mockResponse: {
            status: 'success',
            confirmation_number: 'PAY-2024-567890',
            message: 'Bill payment scheduled successfully',
            payee: 'Electric Company',
            amount: '125.75',
            from_account: 'Checking x8041',
            payment_date: '2024-11-15'
        }
    },
    {
        name: 'Get Payees List',
        method: 'GET',
        endpoint: 'https://api.citi.com/v1/bills/payees',
        description: 'Retrieve list of saved bill payees with account information.',
        category: 'Payments',
        mockResponse: {
            payees: [
                { payee_id: 'p1', name: 'Electric Company', account_number: '9876543210', nickname: 'Home Electric' },
                { payee_id: 'p2', name: 'Water Utility', account_number: '1234567890', nickname: 'Water Bill' },
                { payee_id: 'p3', name: 'Internet Provider', account_number: '5555555555', nickname: 'Home Internet' }
            ]
        }
    },
    {
        name: 'Setup Auto-Pay',
        method: 'POST',
        endpoint: 'https://api.citi.com/v1/bills/autopay',
        description: 'Set up automatic bill payment for a specific payee with recurring schedule.',
        category: 'Payments',
        mockResponse: {
            status: 'activated',
            autopay_id: 'AUTO-2024-123456',
            message: 'Auto-pay activated successfully',
            payee: 'Electric Company',
            amount_type: 'full_balance',
            frequency: 'monthly',
            from_account: 'Checking x8041'
        }
    },
    {
        name: 'Get User Profile',
        method: 'GET',
        endpoint: 'https://api.citi.com/v1/user/profile',
        description: 'Retrieves authenticated user profile information including name, email, phone, and address.',
        category: 'Profile',
        mockResponse: {
            user: {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john.doe@email.com',
                phone: '+1-555-0123',
                address: '123 Main Street, New York, NY 10001',
                member_since: '2020-01-15'
            }
        }
    },
    {
        name: 'Update Contact Information',
        method: 'POST',
        endpoint: 'https://api.citi.com/v1/user/update-contact',
        description: 'Update user contact information including email, phone, and mailing address.',
        category: 'Profile',
        mockResponse: {
            status: 'success',
            message: 'Contact information updated successfully',
            updated_fields: ['email', 'phone']
        }
    },
    {
        name: 'Change Password',
        method: 'POST',
        endpoint: 'https://api.citi.com/v1/user/change-password',
        description: 'Change account password with verification of current password.',
        category: 'Security',
        mockResponse: {
            status: 'success',
            message: 'Password changed successfully',
            last_changed: '2024-11-10T10:30:00Z'
        }
    },
    {
        name: 'Setup Two-Factor Authentication',
        method: 'POST',
        endpoint: 'https://api.citi.com/v1/security/2fa/setup',
        description: 'Enable two-factor authentication for enhanced account security.',
        category: 'Security',
        mockResponse: {
            status: 'enabled',
            message: '2FA setup completed',
            method: 'sms',
            phone_last_four: '0123'
        }
    },
    {
        name: 'Get Exchange Rates',
        method: 'GET',
        endpoint: 'https://api.citi.com/v1/forex/rates',
        description: 'Provides current foreign exchange rates for currency conversion and international transactions.',
        category: 'International',
        mockResponse: {
            base_currency: 'USD',
            rates: {
                EUR: 0.92,
                GBP: 0.79,
                JPY: 149.50,
                CAD: 1.36,
                AUD: 1.53
            },
            last_updated: '2024-11-10T14:30:00Z'
        }
    },
    {
        name: 'Request Check Book',
        method: 'POST',
        endpoint: 'https://api.citi.com/v1/accounts/order-checkbook',
        description: 'Order a new checkbook for a checking account with delivery tracking.',
        category: 'Services',
        mockResponse: {
            status: 'ordered',
            order_id: 'CHK-2024-987654',
            message: 'Checkbook ordered successfully',
            account: 'Checking x8041',
            delivery_address: '123 Main Street, New York, NY 10001',
            estimated_delivery: '7-10 business days'
        }
    },
    {
        name: 'Get Account Statements',
        method: 'GET',
        endpoint: 'https://api.citi.com/v1/accounts/{account_id}/statements',
        description: 'Retrieve list of available account statements with download links.',
        category: 'Services',
        mockResponse: {
            statements: [
                { period: 'October 2024', date: '2024-10-31', format: 'PDF', size: '245 KB' },
                { period: 'September 2024', date: '2024-09-30', format: 'PDF', size: '238 KB' },
                { period: 'August 2024', date: '2024-08-31', format: 'PDF', size: '251 KB' }
            ]
        }
    },
    {
        name: 'Dispute Transaction',
        method: 'POST',
        endpoint: 'https://api.citi.com/v1/transactions/dispute',
        description: 'File a dispute for an unauthorized or incorrect transaction.',
        category: 'Support',
        mockResponse: {
            status: 'submitted',
            dispute_id: 'DISP-2024-456789',
            message: 'Dispute submitted successfully. Investigation will complete in 10 business days',
            transaction_id: 'TXN-2024-999888',
            amount: '45.32',
            temporary_credit: true
        }
    },
    {
        name: 'Schedule Branch Appointment',
        method: 'POST',
        endpoint: 'https://api.citi.com/v1/appointments/schedule',
        description: 'Schedule an appointment at a Citi branch for account services.',
        category: 'Support',
        mockResponse: {
            status: 'scheduled',
            appointment_id: 'APPT-2024-111222',
            message: 'Appointment scheduled successfully',
            branch: 'Citi Branch - Main Street',
            date: '2024-11-15',
            time: '2:00 PM',
            service: 'Account Opening Consultation'
        }
    },
    {
        name: 'Get Loan Information',
        method: 'GET',
        endpoint: 'https://api.citi.com/v1/loans',
        description: 'Retrieve information about current loans including balance, interest rate, and payment schedule.',
        category: 'Loans',
        mockResponse: {
            loans: [
                { 
                    loan_type: 'Personal Loan', 
                    account_number: '8765432',
                    original_amount: '10,000.00',
                    current_balance: '7,234.50',
                    interest_rate: '6.5%',
                    next_payment_date: '2024-11-25',
                    next_payment_amount: '312.50'
                }
            ]
        }
    },
    {
        name: 'Check Loan Eligibility',
        method: 'POST',
        endpoint: 'https://api.citi.com/v1/loans/pre-qualify',
        description: 'Check eligibility for various loan products without impacting credit score.',
        category: 'Loans',
        mockResponse: {
            status: 'pre-qualified',
            eligible_products: [
                { product: 'Personal Loan', max_amount: '25,000', estimated_rate: '6.5%' },
                { product: 'Home Equity', max_amount: '50,000', estimated_rate: '5.25%' }
            ],
            message: 'You are pre-qualified for the following products'
        }
    },
    {
        name: 'Get Credit Cards List',
        method: 'GET',
        endpoint: 'https://api.citi.com/v1/creditcards/list',
        description: 'Retrieve list of user\'s credit cards with balance, minimum payment, and due date information.',
        category: 'Credit Cards',
        mockResponse: {
            cards: [
                { 
                    card_id: 'cc1', 
                    card_name: 'Citi Rewards+', 
                    last_four: '4521', 
                    current_balance: '2,450.75',
                    minimum_payment: '75.00',
                    due_date: 'November 25, 2024',
                    available_credit: '7,549.25',
                    credit_limit: '10,000.00'
                },
                { 
                    card_id: 'cc2', 
                    card_name: 'Citi Cash Back', 
                    last_four: '8901', 
                    current_balance: '1,125.50',
                    minimum_payment: '35.00',
                    due_date: 'November 28, 2024',
                    available_credit: '8,874.50',
                    credit_limit: '10,000.00'
                },
                { 
                    card_id: 'cc3', 
                    card_name: 'Citi Premier', 
                    last_four: '3456', 
                    current_balance: '3,890.00',
                    minimum_payment: '120.00',
                    due_date: 'November 22, 2024',
                    available_credit: '11,110.00',
                    credit_limit: '15,000.00'
                }
            ]
        }
    },
    {
        name: 'Get Checking Accounts',
        method: 'GET',
        endpoint: 'https://api.citi.com/v1/accounts/checking',
        description: 'Retrieve list of user\'s checking and savings accounts for payment sources.',
        category: 'Accounts',
        mockResponse: {
            accounts: [
                { 
                    account_type: 'Checking', 
                    last_four: '8041', 
                    available_balance: '5,432.10',
                    account_nickname: 'Primary Checking'
                },
                { 
                    account_type: 'Savings', 
                    last_four: '9123', 
                    available_balance: '12,890.00',
                    account_nickname: 'Emergency Fund'
                },
                { 
                    account_type: 'Checking', 
                    last_four: '5678', 
                    available_balance: '2,100.50',
                    account_nickname: 'Business Checking'
                }
            ]
        }
    },
    {
        name: 'Process Credit Card Payment',
        method: 'POST',
        endpoint: 'https://api.citi.com/v1/creditcards/payment',
        description: 'Process a payment towards credit card balance from a checking or savings account.',
        category: 'Credit Cards',
        mockResponse: {
            status: 'success',
            confirmation_number: 'CCPAY-2024-789456',
            message: 'Payment processed successfully',
            posting_date: 'November 12, 2024',
            amount: '500.00',
            from_account: 'Checking x8041',
            to_card: 'Citi Rewards+ x4521'
        }
    },
    // ============= CARD REPLACEMENT APIs =============
    {
        name: 'Get User Credit Cards',
        method: 'GET',
        endpoint: 'https://api.citi.com/v1/cards/list',
        description: 'Retrieves all active credit cards for the user with status, type, and last four digits. Used for card replacement flows.',
        category: 'Card Management',
        mockResponse: {
            status: 'success',
            cards: [
                { 
                    card_id: 'card_001', 
                    card_type: 'Platinum Card',
                    card_number_masked: '************4532',
                    last_four: '4532',
                    status: 'active',
                    expiry_date: '12/2027',
                    cardholder_name: 'John Smith',
                    card_limit: '15,000.00',
                    available_credit: '12,500.00'
                },
                { 
                    card_id: 'card_002', 
                    card_type: 'Gold Rewards Card',
                    card_number_masked: '************8901',
                    last_four: '8901',
                    status: 'active',
                    expiry_date: '06/2026',
                    cardholder_name: 'John Smith',
                    card_limit: '10,000.00',
                    available_credit: '8,750.00'
                },
                { 
                    card_id: 'card_003', 
                    card_type: 'Cash Back Card',
                    card_number_masked: '************2468',
                    last_four: '2468',
                    status: 'active',
                    expiry_date: '03/2028',
                    cardholder_name: 'John Smith',
                    card_limit: '5,000.00',
                    available_credit: '4,200.00'
                }
            ],
            total_cards: 3
        }
    },
    {
        name: 'Replace Credit Card',
        method: 'POST',
        endpoint: 'https://api.citi.com/v1/cards/replace',
        description: 'Process credit card replacement request. Deactivates old card and orders new one. Requires card_id, reason, and shipping address.',
        category: 'Card Management',
        mockResponse: {
            status: 'success',
            reference_number: 'REF-2024-CC-789123',
            message: 'Card replacement processed successfully',
            old_card_status: 'deactivated',
            new_card: {
                card_id: 'card_001_new',
                card_type: 'Platinum Card',
                last_four: '7890',
                status: 'ordered',
                expiry_date: '12/2029',
                estimated_delivery: '5-7 business days',
                tracking_available: true
            },
            shipping_address: {
                line1: '123 Main Street, Apt 4B',
                city: 'New York',
                state: 'NY',
                zip: '10001',
                country: 'USA'
            },
            replacement_details: {
                reason: 'lost',
                request_date: '2024-11-11',
                processed_by: 'Automated System',
                confirmation_email_sent: true,
                sms_notification_sent: true
            },
            important_notes: [
                'Your old card has been deactivated for security',
                'New card will arrive in 5-7 business days',
                'Tracking information will be emailed',
                'Activate new card upon receipt'
            ]
        }
    },
    {
        name: 'Get User Profile',
        method: 'GET',
        endpoint: 'https://api.citi.com/v1/user/profile',
        description: 'Retrieves user profile information including contact details and mailing address. Used for address confirmation.',
        category: 'User Management',
        mockResponse: {
            status: 'success',
            user: {
                user_id: 'USR-123456',
                first_name: 'John',
                last_name: 'Smith',
                email: 'john.smith@email.com',
                phone: '+1 (555) 123-4567',
                primary_address: {
                    line1: '123 Main Street',
                    line2: 'Apt 4B',
                    city: 'New York',
                    state: 'NY',
                    zip: '10001',
                    country: 'USA',
                    address_type: 'residential'
                },
                secondary_address: {
                    line1: '789 Business Plaza, Suite 200',
                    line2: '',
                    city: 'Newark',
                    state: 'NJ',
                    zip: '07102',
                    country: 'USA',
                    address_type: 'business'
                },
                account_status: 'active',
                customer_since: '2019-03-15',
                preferences: {
                    email_notifications: true,
                    sms_notifications: true,
                    paperless_statements: true
                }
            }
        }
    },
    {
        name: 'Validate Address',
        method: 'POST',
        endpoint: 'https://api.citi.com/v1/address/validate',
        description: 'Validates and standardizes a shipping address. Returns corrected address or validation errors.',
        category: 'Utilities',
        mockResponse: {
            status: 'success',
            valid: true,
            standardized_address: {
                line1: '123 Main Street',
                line2: 'Apt 4B',
                city: 'New York',
                state: 'NY',
                zip: '10001',
                zip4: '10001-2345',
                country: 'USA',
                deliverable: true,
                residential: true
            },
            validation_details: {
                address_verified: true,
                usps_validated: true,
                suggestions: [],
                confidence_score: 0.95
            }
        }
    },
    {
        name: 'Get Replacement Reasons',
        method: 'GET',
        endpoint: 'https://api.citi.com/v1/cards/replacement-reasons',
        description: 'Retrieves list of valid replacement reasons with descriptions and processing times.',
        category: 'Card Management',
        mockResponse: {
            status: 'success',
            reasons: [
                {
                    code: 'lost',
                    display_name: 'Lost Card',
                    description: 'Card has been misplaced and cannot be located',
                    security_level: 'high',
                    immediate_block: true,
                    processing_time: '5-7 business days'
                },
                {
                    code: 'stolen',
                    display_name: 'Stolen Card',
                    description: 'Card was stolen or taken without authorization',
                    security_level: 'critical',
                    immediate_block: true,
                    fraud_alert: true,
                    processing_time: '3-5 business days'
                },
                {
                    code: 'damaged',
                    display_name: 'Damaged Card',
                    description: 'Card is physically damaged and cannot be used',
                    security_level: 'low',
                    immediate_block: false,
                    processing_time: '5-7 business days'
                },
                {
                    code: 'compromised',
                    display_name: 'Potentially Compromised',
                    description: 'Suspicious activity detected or card info may be compromised',
                    security_level: 'high',
                    immediate_block: true,
                    fraud_monitoring: true,
                    processing_time: '3-5 business days'
                },
                {
                    code: 'worn',
                    display_name: 'Worn Out',
                    description: 'Card chip or magnetic strip is worn and not readable',
                    security_level: 'low',
                    immediate_block: false,
                    processing_time: '7-10 business days'
                }
            ]
        }
    },
    {
        name: 'Check Replacement Status',
        method: 'GET',
        endpoint: 'https://api.citi.com/v1/cards/replacement/{reference_number}/status',
        description: 'Check the status of a card replacement request using the reference number.',
        category: 'Card Management',
        mockResponse: {
            status: 'success',
            replacement: {
                reference_number: 'REF-2024-CC-789123',
                card_type: 'Platinum Card',
                last_four_old: '4532',
                last_four_new: '7890',
                status: 'in_transit',
                status_description: 'Your new card is on the way',
                request_date: '2024-11-11',
                shipped_date: '2024-11-12',
                estimated_delivery: '2024-11-18',
                tracking_number: 'USPS9405511899562000123456',
                tracking_url: 'https://tools.usps.com/go/TrackConfirmAction',
                carrier: 'USPS',
                current_location: 'New York Distribution Center',
                shipping_address: {
                    line1: '123 Main Street, Apt 4B',
                    city: 'New York',
                    state: 'NY',
                    zip: '10001'
                }
            },
            timeline: [
                { date: '2024-11-11 10:30 AM', event: 'Replacement requested' },
                { date: '2024-11-11 10:31 AM', event: 'Old card deactivated' },
                { date: '2024-11-11 02:15 PM', event: 'New card manufactured' },
                { date: '2024-11-12 09:00 AM', event: 'Shipped via USPS' },
                { date: '2024-11-15 11:45 AM', event: 'In transit - NY Distribution Center' }
            ]
        }
    }
];

// Mock API Responses (for runtime execution)
const mockAPIResponses = {};
apiLibrary.forEach(api => {
    mockAPIResponses[api.endpoint] = api.mockResponse;
});

// Cache for loaded mock files
const mockFileCache = {};

// Load mock data file
async function loadMockFile(mockFilePath) {
    if (mockFileCache[mockFilePath]) {
        return mockFileCache[mockFilePath];
    }
    
    try {
        const response = await fetch(mockFilePath);
        if (!response.ok) {
            console.warn(`Failed to load mock file: ${mockFilePath}`);
            return null;
        }
        const data = await response.json();
        mockFileCache[mockFilePath] = data;
        return data;
    } catch (error) {
        console.error(`Error loading mock file ${mockFilePath}:`, error);
        return null;
    }
}

// FAQ Data
const faqData = [
    {
        category: '🚀 Getting Started',
        questions: [
            {
                q: 'What is a flow?',
                a: 'A flow is a complete conversation path in your chatbot. It consists of connected screens that guide users through different interactions like checking balances, finding ATMs, or transferring funds.'
            },
            {
                q: 'How do I start building a flow?',
                a: 'Start by dragging a START node from the Nodes tab onto the canvas. Then add MESSAGE or MENU nodes to create conversation steps. Connect them by setting the "Go To Screen" property in each node.'
            },
            {
                q: 'What are screen IDs?',
                a: 'Screen IDs are unique identifiers for each step in your flow. Use descriptive names like "welcome_screen" or "check_balance". These IDs are used to navigate between screens.'
            }
        ]
    },
    {
        category: '💬 Messages & Menus',
        questions: [
            {
                q: 'What is the difference between MESSAGE and MENU nodes?',
                a: 'MESSAGE nodes display text to users, while MENU nodes display text with interactive buttons. Use MENU when you want to give users choices, and MESSAGE for information display.'
            },
            {
                q: 'How do I add buttons to a menu?',
                a: 'Select a MENU node, then in the config panel on the right, click "+ Add Button". Enter the button label and the screen ID it should navigate to when clicked.'
            },
            {
                q: 'Can I use variables in messages?',
                a: 'Yes! Use double curly braces like {{variable_name}} in your message text. For example: "Your balance is ${{selected_balance}}". Variables are populated from API responses or user selections.'
            },
            {
                q: 'What are dynamic buttons?',
                a: 'Dynamic buttons are automatically generated from API data. For example, showing all user accounts as buttons. Configure this in the JSON view using "dynamic_buttons" with source_variable and label_template.'
            }
        ]
    },
    {
        category: '🔌 API Integration',
        questions: [
            {
                q: 'How do I integrate an API?',
                a: 'Drag an API node to the canvas. In the config panel, enter the API URL (check the APIs tab for available endpoints), select the method (GET/POST), and specify where to save the response data.'
            },
            {
                q: 'Where can I see available APIs?',
                a: 'Click the "🔌 APIs" tab in the left panel to browse all available banking APIs with their endpoints, descriptions, and mock response formats.'
            },
            {
                q: 'How do I use API response data?',
                a: 'Set "Save Response To Variable" in your API node (e.g., "account_data"). Then access the data in messages using {{account_data.field_name}} or use it for dynamic buttons.'
            },
            {
                q: 'What happens if an API call fails?',
                a: 'Configure "On Error Go To Screen ID" in your API node. This directs users to an error handling screen where you can show a friendly message and provide alternative options.'
            }
        ]
    },
    {
        category: '🔀 Logic & Conditions',
        questions: [
            {
                q: 'How do conditional branches work?',
                a: 'CONDITIONAL nodes check if a variable meets certain criteria (equals, exists, greater than). Based on true/false, users go to different screens. Use this for personalized experiences.'
            },
            {
                q: 'What operators can I use in conditions?',
                a: 'Available operators: "equals" (checks if variable equals a value), "exists" (checks if variable is set), "greater_than" (compares numbers). Select these in the config panel.'
            },
            {
                q: 'Can I have multiple conditions?',
                a: 'Yes! Chain multiple CONDITIONAL nodes together. Each one checks a different condition and routes users accordingly. This allows complex decision trees.'
            }
        ]
    },
    {
        category: '🎨 Best Practices',
        questions: [
            {
                q: 'How many buttons should a menu have?',
                a: 'Limit to 3-5 buttons per menu for better user experience. Too many options can overwhelm users. If you need more, consider creating categories or sub-menus.'
            },
            {
                q: 'How should I name my screens?',
                a: 'Use descriptive, lowercase names with underscores: "welcome_screen", "check_balance", "select_account". This makes your flow easier to understand and maintain.'
            },
            {
                q: 'Should I always have a way back to main menu?',
                a: 'Yes! Always include a "Main Menu" button in your screens so users can restart or navigate away. This prevents users from getting stuck in a flow.'
            },
            {
                q: 'How do I handle errors gracefully?',
                a: 'Create error screens for API failures and dead ends. Provide helpful messages and always give users options to retry or return to the main menu.'
            }
        ]
    },
    {
        category: '🧪 Testing & Deployment',
        questions: [
            {
                q: 'How do I test my flow?',
                a: 'Use the Live Preview panel on the right side. Click "🚀 Deploy Flow" to load your current flow, then interact with it as users would. Click "Reset Conversation" to restart.'
            },
            {
                q: 'How do I export my flow?',
                a: 'Click "💾 Export JSON" in the header. This downloads a JSON configuration file that can be imported into production chatbot systems or shared with developers.'
            },
            {
                q: 'Can I save and load templates?',
                a: 'Click "📋 Load Template" to see pre-built flows like Check Balance. You can also export your own flows and reload them later by importing the JSON.'
            }
        ]
    }
];

// Initialize
function init() {
    console.log('🚀 Initializing CitiFlow Studio...');
    
    // Initialize view states
    const builderView = document.getElementById('builderView');
    const jsonView = document.getElementById('jsonView');
    if (builderView) builderView.style.display = 'flex';
    if (jsonView) {
        jsonView.style.display = 'none';
        jsonView.classList.remove('active');
    }
    
    setupDragAndDrop();
    renderAPILibrary();
    renderFAQs();
    renderConfigPanel(); // Initialize config panel with empty state
    setupCanvasClickListener();

    // Setup button event listeners
    const assistSendBtn = document.getElementById('assistSendBtn');
    if (assistSendBtn) assistSendBtn.addEventListener('click', sendAssistMessage);

    const assistInput = document.getElementById('assistInput');
    if (assistInput) {
        assistInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                sendAssistMessage();
            }
        });
    }

    // Setup JSON drop handlers
    setupJSONDropHandlers();

    // Setup button event listeners
    console.log('📋 About to call setupButtonListeners...');
    setupButtonListeners();

    // Show welcome message
    setTimeout(() => {
        showToast('👋 Welcome! Click "📋 Load Template" to see a demo, or start building your own flow!');
    }, 500);

    // Optionally load default template (commented out for now - users can load manually)
    // loadCheckBalanceTemplate();
}

// Setup button event listeners
function setupButtonListeners() {
    // Header buttons
    const loadTemplateBtn = document.getElementById('loadTemplateBtn');
    if (loadTemplateBtn) loadTemplateBtn.addEventListener('click', openTemplateModal);

    const exportJSONBtn = document.getElementById('exportJSONBtn');
    const importJSONBtn = document.getElementById('importJSONBtn');
    const deployFlowBtn = document.getElementById('deployFlowBtn');
    const helpBtn = document.getElementById('helpBtn');

    // JSON view buttons
    const importJSONBtn2 = document.getElementById('importJSONBtn2');
    const exportJSONBtn2 = document.getElementById('exportJSONBtn2');
    const loadJSONFromTextBtn = document.getElementById('loadJSONFromTextBtn');

    // Tab buttons - use event delegation for better reliability
    const studioTabs = document.querySelector('.studio-tabs');
    if (studioTabs) {
        studioTabs.addEventListener('click', function(e) {
            const clickedTab = e.target.closest('.tab');
            if (clickedTab) {
                const tabText = clickedTab.textContent.trim();
                console.log('🖱️ Tab clicked:', tabText);
                if (tabText === 'Flow Builder') {
                    switchTab('builder', e);
                } else if (tabText === 'JSON Configuration') {
                    switchTab('json', e);
                }
            }
        });
        console.log('✅ Tab event listeners attached');
    }

    // Attach event listeners to buttons
    if (exportJSONBtn) exportJSONBtn.addEventListener('click', exportJSON);
    if (importJSONBtn) importJSONBtn.addEventListener('click', importJSON);
    if (deployFlowBtn) deployFlowBtn.addEventListener('click', deployFlow);
    if (helpBtn) helpBtn.addEventListener('click', toggleHelpPanel);

    if (importJSONBtn2) importJSONBtn2.addEventListener('click', importJSON);
    if (exportJSONBtn2) exportJSONBtn2.addEventListener('click', exportJSON);
    if (loadJSONFromTextBtn) loadJSONFromTextBtn.addEventListener('click', loadJSONFromText);

    console.log('✅ All button event listeners attached');
}

// Toggle Config Panel visibility
function toggleConfigPanel() {
    const panel = document.getElementById('configPanel');
    panel.classList.toggle('visible');
}

// Toggle Help Panel
function toggleHelpPanel() {
    const panel = document.getElementById('helpPanel');
    const overlay = document.getElementById('helpOverlay');
    panel.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Switch Palette Tab
function switchPaletteTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.palette-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update tab panes
    document.querySelectorAll('.palette-tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });

    if (tabName === 'nodes') {
        document.getElementById('nodesTab').classList.add('active');
    } else if (tabName === 'apis') {
        document.getElementById('apisTab').classList.add('active');
    }
}

// Render API Library
function renderAPILibrary(filteredAPIs = null) {
    const container = document.getElementById('apiLibrary');
    const countEl = document.getElementById('apiCount');
    container.innerHTML = '';

    const apisToRender = filteredAPIs || apiLibrary;
    
    // Update count
    countEl.textContent = `Showing ${apisToRender.length} of ${apiLibrary.length} APIs`;

    apisToRender.forEach((api, index) => {
        const actualIndex = apiLibrary.indexOf(api);
        const apiEl = document.createElement('div');
        apiEl.className = 'api-item';
        apiEl.dataset.category = api.category || '';
        apiEl.innerHTML = `
            <div class="api-item-header">
                <span class="api-method ${api.method.toLowerCase()}">${api.method}</span>
                <div class="api-name">${api.name}</div>
            </div>
            <div class="api-description">${api.description}</div>
            <div class="api-endpoint">${api.endpoint}</div>
            <div class="api-response-toggle" onclick="toggleAPIResponse(${actualIndex})">
                📄 View Mock Response
            </div>
            <div class="api-mock-response" id="apiResponse${actualIndex}">
                <pre>${JSON.stringify(api.mockResponse, null, 2)}</pre>
            </div>
            <button class="api-use-btn" onclick="useAPI('${api.endpoint.replace(/'/g, "\\'")}', '${api.method}')">
                ✨ Use This API
            </button>
        `;
        container.appendChild(apiEl);
    });

    // Show no results message if needed
    if (apisToRender.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #9ca3af;">
                <div style="font-size: 48px; margin-bottom: 12px;">🔍</div>
                <div>No APIs found</div>
            </div>
        `;
    }
}

// Search APIs
function searchAPIs() {
    const searchTerm = document.getElementById('apiSearch').value.toLowerCase();
    
    if (searchTerm === '') {
        renderAPILibrary();
        return;
    }

    const filtered = apiLibrary.filter(api => {
        const nameMatch = api.name.toLowerCase().includes(searchTerm);
        const descMatch = api.description.toLowerCase().includes(searchTerm);
        const endpointMatch = api.endpoint.toLowerCase().includes(searchTerm);
        const categoryMatch = (api.category || '').toLowerCase().includes(searchTerm);
        return nameMatch || descMatch || endpointMatch || categoryMatch;
    });

    renderAPILibrary(filtered);
}

function toggleAPIResponse(index) {
    const responseEl = document.getElementById(`apiResponse${index}`);
    responseEl.classList.toggle('active');
}

function useAPI(endpoint, method) {
    // Create an API node with pre-filled data
    const canvas = document.getElementById('canvas');
    const rect = canvas.getBoundingClientRect();
    const x = 400;
    const y = 200;
    
    const nodeId = `node_${nodeIdCounter++}`;
    const node = {
        id: nodeId,
        type: 'API',
        x: x,
        y: y,
        config: {
            screen_id: `api_${Date.now()}`,
            type: 'API_SCREEN',
            api_call: {
                url: endpoint,
                method: method,
                save_response_to_variable: 'api_response',
                on_success_go_to_screen_id: '',
                on_error_go_to_screen_id: ''
            }
        }
    };
    nodes.push(node);
    renderCanvas();
    selectNode(nodeId);
    
    // Switch to nodes tab to see the added node
    document.querySelector('.palette-tab').click();
    
    showToast(`✅ ${method} API node added! Configure success/error paths in the config panel.`);
}

// Render FAQs
function renderFAQs() {
    const container = document.getElementById('faqContent');
    container.innerHTML = '';

    faqData.forEach(category => {
        const categoryEl = document.createElement('div');
        categoryEl.className = 'faq-category';
        
        const titleEl = document.createElement('div');
        titleEl.className = 'faq-category-title';
        titleEl.textContent = category.category;
        categoryEl.appendChild(titleEl);

        category.questions.forEach((item, index) => {
            const faqEl = document.createElement('div');
            faqEl.className = 'faq-item';
            faqEl.dataset.question = item.q.toLowerCase();
            faqEl.dataset.answer = item.a.toLowerCase();
            
            faqEl.innerHTML = `
                <div class="faq-question" onclick="toggleFAQ(this)">
                    <span>${item.q}</span>
                    <span class="faq-icon">▼</span>
                </div>
                <div class="faq-answer">${item.a}</div>
            `;
            categoryEl.appendChild(faqEl);
        });

        container.appendChild(categoryEl);
    });
}

function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    faqItem.classList.toggle('open');
}

function searchFAQs() {
    const searchTerm = document.getElementById('faqSearch').value.toLowerCase();
    const faqItems = document.querySelectorAll('.faq-item');
    const categories = document.querySelectorAll('.faq-category');
    let visibleCount = 0;

    faqItems.forEach(item => {
        const question = item.dataset.question;
        const answer = item.dataset.answer;
        
        if (searchTerm === '' || question.includes(searchTerm) || answer.includes(searchTerm)) {
            item.style.display = 'block';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });

    // Hide empty categories
    categories.forEach(cat => {
        const visibleItems = cat.querySelectorAll('.faq-item[style="display: block;"], .faq-item:not([style*="display"])').length;
        if (searchTerm !== '' && visibleItems === 0) {
            cat.style.display = 'none';
        } else {
            cat.style.display = 'block';
        }
    });

    // Show no results message
    const existingNoResults = document.getElementById('faqNoResults');
    if (existingNoResults) {
        existingNoResults.remove();
    }

    if (searchTerm !== '' && visibleCount === 0) {
        const noResults = document.createElement('div');
        noResults.id = 'faqNoResults';
        noResults.className = 'faq-no-results';
        noResults.innerHTML = `
            <div class="faq-no-results-icon">🔍</div>
            <div>No FAQs found for "${searchTerm}"</div>
        `;
        document.getElementById('faqContent').appendChild(noResults);
    }
}

// Setup Drag and Drop
function setupDragAndDrop() {
    const nodeItems = document.querySelectorAll('.node-item');
    nodeItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            draggedNodeType = e.target.closest('.node-item').dataset.type;
        });
    });

    const canvas = document.getElementById('canvas');
    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left + canvas.parentElement.scrollLeft;
        const y = e.clientY - rect.top + canvas.parentElement.scrollTop;
        addNode(draggedNodeType, x, y);
    });
}

// Add Node to Canvas
function addNode(type, x, y) {
    const nodeId = `node_${nodeIdCounter++}`;
    const node = {
        id: nodeId,
        type: type,
        x: x,
        y: y,
        config: getDefaultConfig(type)
    };
    nodes.push(node);
    renderCanvas();
    selectNode(nodeId);
}

// Get Default Config
function getDefaultConfig(type) {
    const configs = {
        START: {
            screen_id: 'start',
            type: 'START',
            go_to_screen_id: ''
        },
        MESSAGE: {
            screen_id: '',
            type: 'MESSAGE_SCREEN',
            message_text: 'Enter your message here',
            buttons: []
        },
        MENU: {
            screen_id: '',
            type: 'MESSAGE_SCREEN',
            message_text: 'Please select an option',
            buttons: []
        },
        API: {
            screen_id: '',
            type: 'API_SCREEN',
            api_call: {
                url: '',
                method: 'GET',
                save_response_to_variable: '',
                on_success_go_to_screen_id: '',
                on_error_go_to_screen_id: ''
            }
        },
        CONDITIONAL: {
            screen_id: '',
            type: 'CONDITIONAL_SCREEN',
            condition: {
                variable: '',
                operator: 'equals',
                value: ''
            },
            go_to_screen_id: '',
            on_false_go_to_screen_id: ''
        },
        END: {
            screen_id: 'end',
            type: 'END_SCREEN',
            message_text: 'Thank you!'
        }
    };
    return configs[type] || {};
}

// Render Canvas
function renderCanvas() {
    console.log('🎨 Rendering canvas with', nodes.length, 'nodes');
    const canvas = document.getElementById('canvas');
    // Keep the SVG element
    const svg = document.getElementById('connectionSvg');
    canvas.innerHTML = '';
    canvas.appendChild(svg);

    nodes.forEach(node => {
        const nodeEl = createNodeElement(node);
        canvas.appendChild(nodeEl);
    });

    // Draw connections after nodes are rendered
    setTimeout(() => {
        drawConnections();
    }, 100);
    
    updateJSONView();
}

// Create Node Element
function createNodeElement(node) {
    const div = document.createElement('div');
    div.className = 'canvas-node';
    if (selectedNode === node.id) {
        div.classList.add('selected');
    }
    div.style.left = node.x + 'px';
    div.style.top = node.y + 'px';
    div.dataset.id = node.id;

    const icons = {
        START: { icon: '🏁', color: '#10b981', label: 'Start' },
        MESSAGE: { icon: '💬', color: '#3b82f6', label: 'Message' },
        MENU: { icon: '📋', color: '#8b5cf6', label: 'Menu' },
        API: { icon: '🔌', color: '#06b6d4', label: 'API Call' },
        CONDITIONAL: { icon: '🔀', color: '#f59e0b', label: 'Condition' },
        END: { icon: '🛑', color: '#ef4444', label: 'End' }
    };

    const nodeInfo = icons[node.type] || { icon: '📦', color: '#6b7280', label: 'Unknown' };

    div.innerHTML = `
        <div class="canvas-node-header" style="background: ${nodeInfo.color}20;">
            <div class="node-icon" style="background: ${nodeInfo.color};">${nodeInfo.icon}</div>
            <div class="canvas-node-title" style="color: ${nodeInfo.color};">${nodeInfo.label}</div>
            <button class="node-delete" onclick="deleteNode('${node.id}')">×</button>
        </div>
        <div class="canvas-node-body">
            <div class="canvas-node-content">${getNodePreview(node)}</div>
        </div>
        <!-- Connection Ports -->
        <div class="node-port port-right" data-node-id="${node.id}" data-port="right"></div>
        <div class="node-port port-left" data-node-id="${node.id}" data-port="left"></div>
        <div class="node-port port-top" data-node-id="${node.id}" data-port="top"></div>
        <div class="node-port port-bottom" data-node-id="${node.id}" data-port="bottom"></div>
    `;

    // Click to select node
    div.addEventListener('click', (e) => {
        if (e.target.closest('.node-delete')) return;
        if (e.target.closest('.node-port')) return;
        e.stopPropagation();
        console.log('🖱️ Node clicked:', node.id, node.type);
        selectNode(node.id);
    });

    // Mousedown to initiate drag
    div.addEventListener('mousedown', (e) => {
        if (e.target.closest('.node-delete')) return;
        if (e.target.closest('.node-port')) return;
        isDraggingNode = true;
        dragOffset.x = e.clientX - node.x;
        dragOffset.y = e.clientY - node.y;
    });

    // Setup connection port handlers
    setupConnectionPorts(div, node);

    return div;
}

// Get Node Preview
function getNodePreview(node) {
    const config = node.config;
    switch (node.type) {
        case 'START':
            return `Entry point → ${config.go_to_screen_id || 'Not set'}`;
        case 'MESSAGE':
        case 'MENU':
            return config.message_text || 'No message';
        case 'API':
            return config.api_call?.url || 'No URL configured';
        case 'CONDITIONAL':
            return `If ${config.condition?.variable || '?'} ${config.condition?.operator || '?'} ${config.condition?.value || '?'}`;
        case 'END':
            return config.message_text || 'Flow ends here';
        default:
            return 'Configure this node';
    }
}

// Setup Connection Ports for Drag-to-Connect
function setupConnectionPorts(nodeElement, node) {
    const ports = nodeElement.querySelectorAll('.node-port');
    
    ports.forEach(port => {
        port.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            startConnection(node.id, port, e);
        });
    });
}

// Start drawing a connection
function startConnection(nodeId, port, event) {
    isDrawingConnection = true;
    isDraggingNode = false; // Disable node dragging
    connectionStart = {
        nodeId: nodeId,
        port: port.dataset.port,
        x: event.clientX,
        y: event.clientY
    };
    
    const svg = document.getElementById('connectionSvg');
    const canvas = document.getElementById('canvas');
    const rect = canvas.getBoundingClientRect();
    const scrollLeft = canvas.parentElement.scrollLeft;
    const scrollTop = canvas.parentElement.scrollTop;
    
    // Create temporary connection line
    tempConnectionLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tempConnectionLine.setAttribute('class', 'temp-connection');
    svg.appendChild(tempConnectionLine);
    
    console.log('🔗 Started connection from:', nodeId, port.dataset.port);
}

// Update temporary connection line while dragging
function updateTempConnection(event) {
    if (!isDrawingConnection || !tempConnectionLine || !connectionStart) return;
    
    const canvas = document.getElementById('canvas');
    const rect = canvas.getBoundingClientRect();
    const scrollLeft = canvas.parentElement.scrollLeft;
    const scrollTop = canvas.parentElement.scrollTop;
    
    const startX = connectionStart.x - rect.left + scrollLeft;
    const startY = connectionStart.y - rect.top + scrollTop;
    const endX = event.clientX - rect.left + scrollLeft;
    const endY = event.clientY - rect.top + scrollTop;
    
    const pathData = createBezierPath(startX, startY, endX, endY);
    tempConnectionLine.setAttribute('d', pathData);
}

// Finish drawing connection
function finishConnection(targetNodeId) {
    if (!isDrawingConnection || !connectionStart) return;
    
    // Remove temporary line
    if (tempConnectionLine) {
        tempConnectionLine.remove();
        tempConnectionLine = null;
    }
    
    // Don't connect to self
    if (connectionStart.nodeId === targetNodeId) {
        console.log('⚠️ Cannot connect node to itself');
        cancelConnection();
        return;
    }
    
    // Check if connection already exists
    const existingConnection = manualConnections.find(conn => 
        conn.from === connectionStart.nodeId && conn.to === targetNodeId
    );
    
    if (existingConnection) {
        console.log('⚠️ Connection already exists');
        cancelConnection();
        return;
    }
    
    // Create manual connection
    manualConnections.push({
        from: connectionStart.nodeId,
        to: targetNodeId,
        type: 'manual',
        label: ''
    });
    
    console.log('✅ Created connection:', connectionStart.nodeId, '→', targetNodeId);
    
    // Reset state
    isDrawingConnection = false;
    connectionStart = null;
    
    // Redraw connections
    drawConnections();
    
    showToast('✅ Connection created! Configure it by clicking the line.');
}

// Cancel connection drawing
function cancelConnection() {
    if (tempConnectionLine) {
        tempConnectionLine.remove();
        tempConnectionLine = null;
    }
    isDrawingConnection = false;
    connectionStart = null;
}

// Node Dragging and Connection Drawing
document.addEventListener('mousemove', (e) => {
    // Handle node dragging
    if (isDraggingNode && selectedNode) {
        const canvas = document.getElementById('canvas');
        const rect = canvas.getBoundingClientRect();
        const node = nodes.find(n => n.id === selectedNode);
        if (node) {
            node.x = e.clientX - rect.left + canvas.parentElement.scrollLeft - dragOffset.x + rect.left;
            node.y = e.clientY - rect.top + canvas.parentElement.scrollTop - dragOffset.y + rect.top;
            renderCanvas();
        }
    }
    
    // Handle connection drawing
    if (isDrawingConnection) {
        updateTempConnection(e);
    }
});

document.addEventListener('mouseup', (e) => {
    // Finish connection if drawing
    if (isDrawingConnection) {
        // Check if mouse is over a node
        const target = e.target.closest('.canvas-node');
        if (target) {
            const targetNodeId = target.dataset.id;
            if (targetNodeId) {
                finishConnection(targetNodeId);
            } else {
                cancelConnection();
            }
        } else {
            cancelConnection();
        }
    }
    
    isDraggingNode = false;
});

// Select Node
function selectNode(nodeId) {
    if (selectedNode === nodeId) {
        selectedNode = null;
    } else {
        selectedNode = nodeId;
    }
    
    const panel = document.getElementById('configPanel');
    if (selectedNode) {
        panel.classList.add('visible');
    } else {
        panel.classList.remove('visible');
    }

    renderCanvas();
    renderConfigPanel();
}

// Deselect node when clicking canvas background
function setupCanvasClickListener() {
    const canvasContainer = document.getElementById('canvasContainer');
    if (canvasContainer) {
        canvasContainer.addEventListener('click', function(e) {
            // If the click is on the canvas itself and not a node, deselect
            if (e.target === canvasContainer || e.target.classList.contains('canvas')) {
                selectedNode = null;
                const panel = document.getElementById('configPanel');
                panel.classList.remove('visible');
                renderCanvas();
                renderConfigPanel();
            }
        });
    }
}

// Delete Node
function deleteNode(nodeId) {
    nodes = nodes.filter(n => n.id !== nodeId);
    if (selectedNode === nodeId) {
        selectedNode = null;
    }
    renderCanvas();
    renderConfigPanel();
}

// Render Config Panel
function renderConfigPanel() {
    const panel = document.getElementById('configPanel');
    console.log('⚙️ Rendering config panel for:', selectedNode);
    
    if (!selectedNode) {
        panel.innerHTML = `
            <div class="config-header">
                <div class="config-title">Configuration Panel</div>
                <button class="config-close-btn" onclick="toggleConfigPanel()" title="Close Configuration Panel">✕</button>
            </div>
            <div class="config-empty">
                <div class="config-empty-icon">⚙️</div>
                <p>Click a node to configure its properties</p>
                <strong>Building Your Flow:</strong>
                <ul>
                    <li>🎯 Drag nodes from left palette</li>
                    <li>🖱️ Click node to edit settings</li>
                    <li>🔗 Drag from ports to connect</li>
                    <li>📝 Set Screen IDs & messages</li>
                    <li>🔘 Add buttons for menus</li>
                </ul>
            </div>
        `;
        return;
    }

    const node = nodes.find(n => n.id === selectedNode);
    if (!node) {
        console.warn('⚠️ Node not found:', selectedNode);
        return;
    }

    console.log('📝 Rendering', node.type, 'config panel for node:', node);
    panel.innerHTML = `
        <div class="config-header">
            <div class="config-title">Configure ${node.type}</div>
            <button class="config-close-btn" onclick="toggleConfigPanel()" title="Close Configuration Panel">✕</button>
        </div>
    `;

    switch (node.type) {
        case 'START':
            renderStartConfig(panel, node);
            break;
        case 'MESSAGE':
        case 'MENU':
            renderMessageConfig(panel, node);
            break;
        case 'API':
            renderAPIConfig(panel, node);
            break;
        case 'CONDITIONAL':
            renderConditionalConfig(panel, node);
            break;
        case 'END':
            renderEndConfig(panel, node);
            break;
    }
    
    // Re-attach event listeners after innerHTML update
    attachConfigEventListeners(node);
}

// Helper function to attach event listeners
function attachConfigEventListeners(node) {
    // Event listeners for dropdowns will be attached here
    const selects = document.querySelectorAll('#configPanel select');
    selects.forEach(select => {
        if (!select.onchange) {
            const handler = select.getAttribute('data-handler');
            if (handler) {
                select.onchange = function() {
                    eval(handler);
                };
            }
        }
    });
}

// Helper: Get all available screen IDs
function getAvailableScreenIds() {
    return nodes
        .filter(n => n.config.screen_id && n.config.screen_id !== '')
        .map(n => n.config.screen_id);
}

// Helper: Create screen ID selector
function createScreenSelector(currentValue, onChangeHandler, placeholder = 'Select or type screen ID') {
    const availableScreens = getAvailableScreenIds();
    const selectId = 'sel_' + Math.random().toString(36).substr(2, 9);
    
    let html = `
        <select class="form-select" id="${selectId}" onchange="${onChangeHandler}">
            <option value="">-- ${placeholder} --</option>
            ${availableScreens.map(screenId => 
                `<option value="${screenId}" ${currentValue === screenId ? 'selected' : ''}>${screenId}</option>`
            ).join('')}
        </select>
        <input type="text" class="form-input" style="margin-top: 8px;" placeholder="Or type custom ID..." 
            value="${currentValue && !availableScreens.includes(currentValue) ? currentValue : ''}"
            onchange="${onChangeHandler}">
    `;
    return html;
}

// Config Renderers
function renderStartConfig(panel, node) {
    const availableScreens = getAvailableScreenIds();
    const screenCount = availableScreens.length;
    
    const configHTML = `
        <div class="form-group">
            <label class="form-label">Screen ID</label>
            <input type="text" class="form-input" id="start_screen_id" value="${node.config.screen_id || ''}" 
                placeholder="e.g., start">
            <small style="display: block; margin-top: 4px; font-size: 11px; color: #6b7280;">✓ Unique identifier for this start point</small>
        </div>
        <div class="form-group">
            <label class="form-label">Go To Screen <span style="color: #10b981; font-size: 11px;">(${screenCount} screens available)</span></label>
            <select class="form-select" id="start_goto_dropdown">
                <option value="">-- Select first screen --</option>
                ${availableScreens.map(screenId => 
                    `<option value="${screenId}" ${node.config.go_to_screen_id === screenId ? 'selected' : ''}>${screenId}</option>`
                ).join('')}
            </select>
            <input type="text" class="form-input" id="start_goto_input" style="margin-top: 8px;" placeholder="Or type custom screen ID..." 
                value="${node.config.go_to_screen_id && !availableScreens.includes(node.config.go_to_screen_id) ? node.config.go_to_screen_id : ''}">
            <small style="display: block; margin-top: 4px; font-size: 11px; color: #6b7280;">💡 Select from dropdown or type a new screen ID</small>
        </div>
    `;
    
    panel.innerHTML += configHTML;
    
    // Attach event listeners
    setTimeout(() => {
        const screenIdInput = document.getElementById('start_screen_id');
        const dropdownSelect = document.getElementById('start_goto_dropdown');
        const customInput = document.getElementById('start_goto_input');
        
        if (screenIdInput) {
            screenIdInput.addEventListener('change', function() {
                updateNodeConfig(node.id, 'screen_id', this.value);
            });
        }
        
        if (dropdownSelect) {
            dropdownSelect.addEventListener('change', function() {
                if (this.value) {
                    updateNodeConfig(node.id, 'go_to_screen_id', this.value);
                    if (customInput) customInput.value = '';
                }
            });
        }
        
        if (customInput) {
            customInput.addEventListener('change', function() {
                if (this.value) {
                    updateNodeConfig(node.id, 'go_to_screen_id', this.value);
                    if (dropdownSelect) dropdownSelect.value = '';
                }
            });
        }
    }, 0);
}

function renderMessageConfig(panel, node) {
    const configHTML = `
        <div class="form-group">
            <label class="form-label">Screen ID</label>
            <input type="text" class="form-input" id="msg_screen_id_${node.id}" value="${node.config.screen_id || ''}" 
                placeholder="e.g., welcome_screen">
            <small style="display: block; margin-top: 4px; font-size: 11px; color: #6b7280;">✓ Use lowercase with underscores</small>
        </div>
        <div class="form-group">
            <label class="form-label">Message Text</label>
            <textarea class="form-textarea" id="msg_text_${node.id}"
                placeholder="Enter the message to display to users...">${node.config.message_text || ''}</textarea>
            <small style="display: block; margin-top: 4px; font-size: 11px; color: #6b7280;">💡 Use {{variable_name}} for dynamic values</small>
        </div>
        <div class="form-group">
            <label class="form-label">Buttons</label>
            <div class="button-list" id="buttonList"></div>
            <button class="add-button-btn" id="add_btn_${node.id}">+ Add Button</button>
        </div>
    `;
    
    panel.innerHTML += configHTML;
    
    // Attach event listeners
    setTimeout(() => {
        const screenIdInput = document.getElementById(`msg_screen_id_${node.id}`);
        const msgTextArea = document.getElementById(`msg_text_${node.id}`);
        const addBtn = document.getElementById(`add_btn_${node.id}`);
        
        if (screenIdInput) {
            screenIdInput.addEventListener('change', function() {
                updateNodeConfig(node.id, 'screen_id', this.value);
            });
        }
        
        if (msgTextArea) {
            msgTextArea.addEventListener('change', function() {
                updateNodeConfig(node.id, 'message_text', this.value);
            });
        }
        
        if (addBtn) {
            addBtn.addEventListener('click', function() {
                addButton(node.id);
            });
        }
        
        renderButtonList(node);
    }, 0);
}

function renderButtonList(node) {
    const list = document.getElementById('buttonList');
    if (!list) return;
    
    const availableScreens = getAvailableScreenIds();
    const screenCount = availableScreens.length;
    
    list.innerHTML = '';
    (node.config.buttons || []).forEach((btn, idx) => {
        const div = document.createElement('div');
        div.className = 'button-list-item';
        div.innerHTML = `
            <button class="button-list-remove" id="remove_btn_${node.id}_${idx}">×</button>
            <div class="form-group" style="margin-bottom: 8px;">
                <input type="text" class="form-input" id="btn_label_${node.id}_${idx}" 
                    placeholder="Button label (e.g., Check Balance)" 
                    value="${btn.label || ''}">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 11px; color: #6b7280; margin-bottom: 4px; display: block;">
                    Target Screen <span style="color: #10b981;">(${screenCount} available)</span>
                </label>
                <select class="form-select" id="btn_dropdown_${node.id}_${idx}">
                    <option value="">-- Select screen --</option>
                    ${availableScreens.map(screenId => 
                        `<option value="${screenId}" ${btn.go_to_screen_id === screenId ? 'selected' : ''}>${screenId}</option>`
                    ).join('')}
                </select>
                <input type="text" class="form-input" id="btn_input_${node.id}_${idx}" 
                    style="margin-top: 6px;" placeholder="Or type custom screen ID..." 
                    value="${btn.go_to_screen_id && !availableScreens.includes(btn.go_to_screen_id) ? btn.go_to_screen_id : ''}">
            </div>
        `;
        list.appendChild(div);
        
        // Attach event listeners for this button
        setTimeout(() => {
            const removeBtn = document.getElementById(`remove_btn_${node.id}_${idx}`);
            const labelInput = document.getElementById(`btn_label_${node.id}_${idx}`);
            const dropdown = document.getElementById(`btn_dropdown_${node.id}_${idx}`);
            const customInput = document.getElementById(`btn_input_${node.id}_${idx}`);
            
            if (removeBtn) {
                removeBtn.addEventListener('click', () => removeButton(node.id, idx));
            }
            
            if (labelInput) {
                labelInput.addEventListener('change', function() {
                    updateButton(node.id, idx, 'label', this.value);
                });
            }
            
            if (dropdown) {
                dropdown.addEventListener('change', function() {
                    if (this.value) {
                        updateButton(node.id, idx, 'go_to_screen_id', this.value);
                        if (customInput) customInput.value = '';
                    }
                });
            }
            
            if (customInput) {
                customInput.addEventListener('change', function() {
                    if (this.value) {
                        updateButton(node.id, idx, 'go_to_screen_id', this.value);
                        if (dropdown) dropdown.value = '';
                    }
                });
            }
        }, 0);
    });
}

function renderAPIConfig(panel, node) {
    const api = node.config.api_call || {};
    const availableScreens = getAvailableScreenIds();
    
    panel.innerHTML += `
        <div class="form-group">
            <label class="form-label">Screen ID</label>
            <input type="text" class="form-input" value="${node.config.screen_id}" 
                onchange="updateNodeConfig('${node.id}', 'screen_id', this.value)"
                placeholder="e.g., api_get_accounts">
        </div>
        <div class="form-group">
            <label class="form-label">API URL</label>
            <input type="text" class="form-input" value="${api.url || ''}" 
                onchange="updateAPIConfig('${node.id}', 'url', this.value)"
                placeholder="https://api.citi.com/v1/...">
            <small style="display: block; margin-top: 4px; font-size: 11px; color: #6b7280;">Check the APIs tab for available endpoints</small>
        </div>
        <div class="form-group">
            <label class="form-label">Method</label>
            <select class="form-select" onchange="updateAPIConfig('${node.id}', 'method', this.value)">
                <option value="GET" ${api.method === 'GET' ? 'selected' : ''}>GET</option>
                <option value="POST" ${api.method === 'POST' ? 'selected' : ''}>POST</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Save Response To Variable</label>
            <input type="text" class="form-input" value="${api.save_response_to_variable || ''}" 
                onchange="updateAPIConfig('${node.id}', 'save_response_to_variable', this.value)"
                placeholder="e.g., account_data">
            <small style="display: block; margin-top: 4px; font-size: 11px; color: #6b7280;">Access later using {{variable_name.field}}</small>
        </div>
        <div class="form-group">
            <label class="form-label">On Success Go To</label>
            <select class="form-select" onchange="updateAPIConfig('${node.id}', 'on_success_go_to_screen_id', this.value)">
                <option value="">-- Select screen --</option>
                ${availableScreens.map(screenId => 
                    `<option value="${screenId}" ${api.on_success_go_to_screen_id === screenId ? 'selected' : ''}>${screenId}</option>`
                ).join('')}
            </select>
            <input type="text" class="form-input" style="margin-top: 6px;" placeholder="Or type screen ID..." 
                value="${api.on_success_go_to_screen_id && !availableScreens.includes(api.on_success_go_to_screen_id) ? api.on_success_go_to_screen_id : ''}"
                onchange="updateAPIConfig('${node.id}', 'on_success_go_to_screen_id', this.value)">
        </div>
        <div class="form-group">
            <label class="form-label">On Error Go To</label>
            <select class="form-select" onchange="updateAPIConfig('${node.id}', 'on_error_go_to_screen_id', this.value)">
                <option value="">-- Select screen --</option>
                ${availableScreens.map(screenId => 
                    `<option value="${screenId}" ${api.on_error_go_to_screen_id === screenId ? 'selected' : ''}>${screenId}</option>`
                ).join('')}
            </select>
            <input type="text" class="form-input" style="margin-top: 6px;" placeholder="Or type screen ID..." 
                value="${api.on_error_go_to_screen_id && !availableScreens.includes(api.on_error_go_to_screen_id) ? api.on_error_go_to_screen_id : ''}"
                onchange="updateAPIConfig('${node.id}', 'on_error_go_to_screen_id', this.value)">
        </div>
    `;
}

function renderConditionalConfig(panel, node) {
    const cond = node.config.condition || {};
    const availableScreens = getAvailableScreenIds();
    
    panel.innerHTML += `
        <div class="form-group">
            <label class="form-label">Screen ID</label>
            <input type="text" class="form-input" value="${node.config.screen_id}" 
                onchange="updateNodeConfig('${node.id}', 'screen_id', this.value)"
                placeholder="e.g., condition_check">
        </div>
        <div class="form-group">
            <label class="form-label">Variable</label>
            <input type="text" class="form-input" value="${cond.variable || ''}" 
                onchange="updateConditionConfig('${node.id}', 'variable', this.value)"
                placeholder="e.g., user_balance">
            <small style="display: block; margin-top: 4px; font-size: 11px; color: #6b7280;">Variable to check (from API responses)</small>
        </div>
        <div class="form-group">
            <label class="form-label">Operator</label>
            <select class="form-select" onchange="updateConditionConfig('${node.id}', 'operator', this.value)">
                <option value="equals" ${cond.operator === 'equals' ? 'selected' : ''}>Equals</option>
                <option value="exists" ${cond.operator === 'exists' ? 'selected' : ''}>Exists</option>
                <option value="greater_than" ${cond.operator === 'greater_than' ? 'selected' : ''}>Greater Than</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Value</label>
            <input type="text" class="form-input" value="${cond.value || ''}" 
                onchange="updateConditionConfig('${node.id}', 'value', this.value)"
                placeholder="Value to compare">
        </div>
        <div class="form-group">
            <label class="form-label">On True Go To</label>
            <select class="form-select" onchange="updateNodeConfig('${node.id}', 'go_to_screen_id', this.value)">
                <option value="">-- Select screen --</option>
                ${availableScreens.map(screenId => 
                    `<option value="${screenId}" ${node.config.go_to_screen_id === screenId ? 'selected' : ''}>${screenId}</option>`
                ).join('')}
            </select>
            <input type="text" class="form-input" style="margin-top: 6px;" placeholder="Or type screen ID..." 
                value="${node.config.go_to_screen_id && !availableScreens.includes(node.config.go_to_screen_id) ? node.config.go_to_screen_id : ''}"
                onchange="updateNodeConfig('${node.id}', 'go_to_screen_id', this.value)">
        </div>
        <div class="form-group">
            <label class="form-label">On False Go To</label>
            <select class="form-select" onchange="updateNodeConfig('${node.id}', 'on_false_go_to_screen_id', this.value)">
                <option value="">-- Select screen --</option>
                ${availableScreens.map(screenId => 
                    `<option value="${screenId}" ${node.config.on_false_go_to_screen_id === screenId ? 'selected' : ''}>${screenId}</option>`
                ).join('')}
            </select>
            <input type="text" class="form-input" style="margin-top: 6px;" placeholder="Or type screen ID..." 
                value="${node.config.on_false_go_to_screen_id && !availableScreens.includes(node.config.on_false_go_to_screen_id) ? node.config.on_false_go_to_screen_id : ''}"
                onchange="updateNodeConfig('${node.id}', 'on_false_go_to_screen_id', this.value)">
        </div>
    `;
}

function renderEndConfig(panel, node) {
    panel.innerHTML += `
        <div class="form-group">
            <label class="form-label">Screen ID</label>
            <input type="text" class="form-input" value="${node.config.screen_id}" 
                onchange="updateNodeConfig('${node.id}', 'screen_id', this.value)"
                placeholder="e.g., end_screen">
        </div>
        <div class="form-group">
            <label class="form-label">Final Message</label>
            <textarea class="form-textarea" 
                onchange="updateNodeConfig('${node.id}', 'message_text', this.value)"
                placeholder="Thank you for using our service!">${node.config.message_text}</textarea>
            <small style="display: block; margin-top: 4px; font-size: 11px; color: #6b7280;">Last message shown before conversation ends</small>
        </div>
    `;
}

// Update Configs
function updateNodeConfig(nodeId, key, value) {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
        node.config[key] = value;
        renderCanvas();
    }
}

function updateAPIConfig(nodeId, key, value) {
    const node = nodes.find(n => n.id === nodeId);
    if (node && node.config.api_call) {
        node.config.api_call[key] = value;
        renderCanvas();
    }
}

function updateConditionConfig(nodeId, key, value) {
    const node = nodes.find(n => n.id === nodeId);
    if (node && node.config.condition) {
        node.config.condition[key] = value;
        renderCanvas();
    }
}

function addButton(nodeId) {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
        if (!node.config.buttons) node.config.buttons = [];
        node.config.buttons.push({ label: 'New Button', go_to_screen_id: '' });
        renderConfigPanel();
        renderCanvas();
    }
}

function removeButton(nodeId, index) {
    const node = nodes.find(n => n.id === nodeId);
    if (node && node.config.buttons) {
        node.config.buttons.splice(index, 1);
        renderConfigPanel();
        renderCanvas();
    }
}

function updateButton(nodeId, index, key, value) {
    const node = nodes.find(n => n.id === nodeId);
    if (node && node.config.buttons && node.config.buttons[index]) {
        node.config.buttons[index][key] = value;
        renderCanvas();
    }
}

// Generate CitiFlow JSON
function generateCitiFlowJSON() {
    const startNode = nodes.find(n => n.type === 'START');
    const screens = {};

    nodes.forEach(node => {
        if (node.config.screen_id) {
            screens[node.config.screen_id] = { ...node.config };
        }
    });

    return {
        start_screen_id: startNode?.config.go_to_screen_id || '',
        screens: screens
    };
}

// Draw Connections between nodes
function drawConnections() {
    const svg = document.getElementById('connectionSvg');
    if (!svg) {
        console.warn('⚠️ Connection SVG not found');
        return;
    }

    // Clear existing connections (except defs)
    const defs = svg.querySelector('defs');
    svg.innerHTML = '';
    if (defs) {
        svg.appendChild(defs);
    }

    // Collect all connections
    const connections = [];
    console.log('🔗 Drawing connections for', nodes.length, 'nodes');

    nodes.forEach(sourceNode => {
        const fromId = sourceNode.config.screen_id || sourceNode.id;
        
        if (sourceNode.type === 'START' && sourceNode.config.go_to_screen_id) {
            connections.push({
                from: fromId,
                to: sourceNode.config.go_to_screen_id,
                type: 'default',
                label: 'Start'
            });
        }

        if (sourceNode.type === 'MESSAGE' && sourceNode.config.go_to_screen_id) {
            connections.push({
                from: fromId,
                to: sourceNode.config.go_to_screen_id,
                type: 'default',
                label: ''
            });
        }

        if (sourceNode.type === 'MENU' && sourceNode.config.buttons) {
            sourceNode.config.buttons.forEach((button, index) => {
                if (button.go_to_screen_id) {
                    connections.push({
                        from: fromId,
                        to: button.go_to_screen_id,
                        type: 'button',
                        label: button.label || `Button ${index + 1}`
                    });
                }
            });
        }

        if (sourceNode.type === 'API') {
            // Support both naming conventions: on_success_go_to and on_success
            const successTarget = sourceNode.config.on_success_go_to || sourceNode.config.on_success;
            const errorTarget = sourceNode.config.on_error_go_to || sourceNode.config.on_error;
            
            if (successTarget) {
                connections.push({
                    from: fromId,
                    to: successTarget,
                    type: 'success',
                    label: 'Success'
                });
            }
            if (errorTarget) {
                connections.push({
                    from: fromId,
                    to: errorTarget,
                    type: 'error',
                    label: 'Error'
                });
            }
        }

        if (sourceNode.type === 'CONDITIONAL' && sourceNode.config.conditions) {
            sourceNode.config.conditions.forEach((condition, index) => {
                if (condition.go_to_screen_id) {
                    connections.push({
                        from: fromId,
                        to: condition.go_to_screen_id,
                        type: 'button',
                        label: condition.condition || `Condition ${index + 1}`
                    });
                }
            });
        }
    });

    // Add manual connections
    manualConnections.forEach(conn => {
        connections.push({
            from: conn.from,
            to: conn.to,
            type: conn.type || 'manual',
            label: conn.label || ''
        });
    });

    // Draw each connection
    console.log('📊 Found', connections.length, 'connections to draw (including', manualConnections.length, 'manual)');
    connections.forEach(conn => {
        // Find nodes by ID first, then by screen_id
        const fromNode = nodes.find(n => n.id === conn.from || n.config.screen_id === conn.from);
        const toNode = nodes.find(n => n.id === conn.to || n.config.screen_id === conn.to);
        
        if (fromNode && toNode) {
            console.log('  ✓ Drawing:', conn.from, '→', conn.to, `(${conn.type})`);
            drawConnection(svg, fromNode, toNode, conn.type, conn.label);
        } else {
            console.warn('  ✗ Missing node for connection:', conn.from, '→', conn.to);
            if (!fromNode) console.warn('    Missing FROM node:', conn.from);
            if (!toNode) console.warn('    Missing TO node:', conn.to);
        }
    });
    console.log('✅ Connections drawn');
}

// Draw a single connection
function drawConnection(svg, fromNode, toNode, type, label) {
    const from = getNodeCenter(fromNode);
    const to = getNodeCenter(toNode);

    // Create bezier curve path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const pathData = createBezierPath(from.x, from.y, to.x, to.y);
    
    path.setAttribute('d', pathData);
    path.setAttribute('class', `connection-line ${type}`);
    
    // Set marker (arrow) based on type
    const markerMap = {
        'success': 'arrowSuccess',
        'error': 'arrowError',
        'default': 'arrowDefault',
        'button': 'arrowButton',
        'manual': 'arrowManual'
    };
    path.setAttribute('marker-end', `url(#${markerMap[type] || 'arrowDefault'})`);
    
    // Add click handler
    path.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('🖱️ Connection clicked:', fromNode.id, '→', toNode.id);
        showConnectionEditor(fromNode, toNode, type, label);
    });
    
    svg.appendChild(path);

    // Add label if provided
    if (label && label.length > 0) {
        const midPoint = getBezierMidpoint(from.x, from.y, to.x, to.y);
        addConnectionLabel(svg, midPoint.x, midPoint.y, label);
    }
}

// Get center coordinates of a node
function getNodeCenter(node) {
    return {
        x: node.x + 120, // Half of node width (240px / 2)
        y: node.y + 40   // Half of node height (80px / 2)
    };
}

// Create bezier curve path
function createBezierPath(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    
    // Control points for smooth curve
    const controlPoint1X = x1 + dx * 0.5;
    const controlPoint1Y = y1;
    const controlPoint2X = x2 - dx * 0.5;
    const controlPoint2Y = y2;

    return `M ${x1} ${y1} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${x2} ${y2}`;
}

// Get midpoint of bezier curve for label placement
function getBezierMidpoint(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    
    // Approximate midpoint of bezier curve (t = 0.5)
    const cp1x = x1 + dx * 0.5;
    const cp1y = y1;
    const cp2x = x2 - dx * 0.5;
    const cp2y = y2;
    
    // Bezier formula at t = 0.5
    const t = 0.5;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const t2 = t * t;
    
    return {
        x: mt * mt2 * x1 + 3 * mt2 * t * cp1x + 3 * mt * t2 * cp2x + t * t2 * x2,
        y: mt * mt2 * y1 + 3 * mt2 * t * cp1y + 3 * mt * t2 * cp2y + t * t2 * y2
    };
}

// Add label to connection
function addConnectionLabel(svg, x, y, text) {
    // Truncate long labels
    const displayText = text.length > 20 ? text.substring(0, 18) + '...' : text;
    const padding = 6;
    const textWidth = displayText.length * 6.5; // Approximate width
    
    // Background rectangle
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x - textWidth / 2 - padding);
    rect.setAttribute('y', y - 10);
    rect.setAttribute('width', textWidth + padding * 2);
    rect.setAttribute('height', 20);
    rect.setAttribute('class', 'connection-label-bg');
    svg.appendChild(rect);
    
    // Text label
    const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textEl.setAttribute('x', x);
    textEl.setAttribute('y', y + 4);
    textEl.setAttribute('class', 'connection-label');
    textEl.textContent = displayText;
    svg.appendChild(textEl);
}

// Connection Editor Functions
let currentConnection = null;

function showConnectionEditor(fromNode, toNode, type, label) {
    currentConnection = { fromNode, toNode, type, label };
    
    const typeLabels = {
        'success': 'Success Path',
        'error': 'Error Path',
        'button': 'Button Action',
        'default': 'Default Flow',
        'manual': 'Manual Connection'
    };
    
    const connectionInfo = document.getElementById('connectionInfo');
    connectionInfo.innerHTML = `
        <div class="connection-info-row">
            <div class="connection-info-label">From:</div>
            <div class="connection-info-value">${fromNode.config.screen_id || fromNode.id}</div>
        </div>
        <div class="connection-info-row">
            <div class="connection-info-label">To:</div>
            <div class="connection-info-value">${toNode.config.screen_id || toNode.id}</div>
        </div>
        <div class="connection-info-row">
            <div class="connection-info-label">Type:</div>
            <span class="connection-type-badge ${type}">${typeLabels[type] || type}</span>
        </div>
        ${label ? `
        <div class="connection-info-row">
            <div class="connection-info-label">Label:</div>
            <div class="connection-info-value">${label}</div>
        </div>
        ` : ''}
    `;
    
    // Show editor
    document.getElementById('connectionEditor').classList.add('active');
    document.getElementById('connectionEditorOverlay').classList.add('active');
    
    // Attach event handlers
    document.getElementById('btnEditConnection').onclick = () => {
        closeConnectionEditor();
        selectNode(fromNode.id);
    };
    
    document.getElementById('btnDeleteConnection').onclick = () => {
        deleteConnection(fromNode, toNode, type, label);
    };
}

function closeConnectionEditor() {
    document.getElementById('connectionEditor').classList.remove('active');
    document.getElementById('connectionEditorOverlay').classList.remove('active');
    currentConnection = null;
}

function deleteConnection(fromNode, toNode, type, label) {
    console.log('🗑️ Deleting connection:', fromNode.id, '→', toNode.id);
    
    // Check if it's a manual connection
    if (type === 'manual') {
        const index = manualConnections.findIndex(conn => 
            conn.from === fromNode.id && conn.to === toNode.id
        );
        if (index !== -1) {
            manualConnections.splice(index, 1);
            console.log('✅ Manual connection deleted');
        }
    } else {
        // Find and remove the connection based on type
        if (fromNode.type === 'START') {
            fromNode.config.go_to_screen_id = '';
        } else if (fromNode.type === 'MESSAGE') {
            fromNode.config.go_to_screen_id = '';
        } else if (fromNode.type === 'MENU' && fromNode.config.buttons) {
            // Find and remove button connection
            const button = fromNode.config.buttons.find(b => 
                b.go_to_screen_id === (toNode.config.screen_id || toNode.id) && 
                b.label === label
            );
            if (button) {
                button.go_to_screen_id = '';
            }
        } else if (fromNode.type === 'API') {
            if (type === 'success') {
                fromNode.config.on_success_go_to = '';
            } else if (type === 'error') {
                fromNode.config.on_error_go_to = '';
            }
        } else if (fromNode.type === 'CONDITIONAL' && fromNode.config.conditions) {
            // Find and remove condition connection
            const condition = fromNode.config.conditions.find(c => 
                c.go_to_screen_id === (toNode.config.screen_id || toNode.id)
            );
            if (condition) {
                condition.go_to_screen_id = '';
            }
        }
    }
    
    // Close editor and re-render
    closeConnectionEditor();
    renderCanvas();
    showToast('✅ Connection deleted successfully!');
}

// Update JSON View
function updateJSONView() {
    console.log('📝 Updating JSON view...');
    const json = generateCitiFlowJSON();
    console.log('📄 Generated JSON:', json);
    const textarea = document.getElementById('jsonTextArea');
    if (textarea) {
        const jsonString = JSON.stringify(json, null, 2);
        textarea.value = jsonString;
        console.log('✅ JSON view updated, length:', jsonString.length);
    } else {
        console.error('❌ jsonTextArea element not found!');
    }
}

// Switch Tabs
function switchTab(tab, event) {
    console.log('🔄 Switching to tab:', tab);
    
    // Remove active class from all tabs
    const allTabs = document.querySelectorAll('.tab');
    allTabs.forEach(t => t.classList.remove('active'));

    // Add active class to clicked tab
    let activeTab = null;
    if (event && event.target) {
        // Try to find the tab element (might be a child element)
        activeTab = event.target.closest('.tab') || event.target;
        if (activeTab && activeTab.classList.contains('tab')) {
            activeTab.classList.add('active');
        }
    }
    
    // Fallback: find tab by text content if not found via event
    if (!activeTab || !activeTab.classList.contains('tab')) {
        allTabs.forEach(t => {
            const tabText = t.textContent.trim();
            if ((tab === 'builder' && tabText === 'Flow Builder') || 
                (tab === 'json' && tabText === 'JSON Configuration')) {
                t.classList.add('active');
            }
        });
    }

    const builderView = document.getElementById('builderView');
    const jsonView = document.getElementById('jsonView');

    if (tab === 'builder') {
        if (builderView) builderView.style.display = 'flex';
        if (jsonView) {
            jsonView.style.display = 'none';
            jsonView.classList.remove('active');
        }
        updateBuildAssistVisibility('builder');
        console.log('✅ Switched to Flow Builder');
    } else if (tab === 'json') {
        if (builderView) builderView.style.display = 'none';
        if (jsonView) {
            jsonView.style.display = 'block';
            jsonView.classList.add('active');
            updateJSONView();
        }
        updateBuildAssistVisibility('json');
        console.log('✅ Switched to JSON Configuration');
    }
}

// Attach switchTab to window for global access
window.switchTab = switchTab;

// Template Management
let templateCatalog = null;

async function loadTemplateCatalog() {
    if (templateCatalog) return templateCatalog;
    
    try {
        const response = await fetch('templates/catalog.json');
        if (!response.ok) {
            throw new Error('Failed to load template catalog');
        }
        templateCatalog = await response.json();
        return templateCatalog;
    } catch (error) {
        console.error('Error loading template catalog:', error);
        return null;
    }
}

async function openTemplateModal() {
    const modal = document.getElementById('templateModal');
    if (!modal) return;
    
    const catalog = await loadTemplateCatalog();
    if (catalog) {
        renderTemplateCatalog(catalog);
    }
    
    modal.classList.add('active');
}

function renderTemplateCatalog(catalog) {
    const modalContent = document.querySelector('#templateModal .modal-content');
    if (!modalContent) return;
    
    // Keep the header, replace the rest
    const header = modalContent.querySelector('.modal-header');
    modalContent.innerHTML = '';
    if (header) {
        modalContent.appendChild(header);
    }
    
    // Add category filter tabs
    const filterContainer = document.createElement('div');
    filterContainer.className = 'template-filters';
    filterContainer.innerHTML = `
        <button class="filter-btn active" data-category="all">All Templates (${catalog.total_templates})</button>
    `;
    
    Object.values(catalog.categories).forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.category = category.id;
        btn.textContent = `${category.icon} ${category.name} (${category.templates.length})`;
        filterContainer.appendChild(btn);
    });
    
    modalContent.appendChild(filterContainer);
    
    // Add template container
    const templateContainer = document.createElement('div');
    templateContainer.className = 'template-container';
    templateContainer.id = 'templateContainer';
    modalContent.appendChild(templateContainer);
    
    // Render all templates initially
    renderTemplatesByCategory(catalog, 'all');
    
    // Add filter button listeners
    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderTemplatesByCategory(catalog, this.dataset.category);
        });
    });
}

function renderTemplatesByCategory(catalog, categoryId) {
    const container = document.getElementById('templateContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    const categoriesToShow = categoryId === 'all' 
        ? Object.values(catalog.categories)
        : [catalog.categories[categoryId]];
    
    categoriesToShow.forEach(category => {
        const categorySection = document.createElement('div');
        categorySection.className = 'template-category-section';
        
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'template-category-header';
        categoryHeader.innerHTML = `
            <h3>${category.icon} ${category.name}</h3>
            <p>${category.description}</p>
        `;
        categorySection.appendChild(categoryHeader);
        
        const templateGrid = document.createElement('div');
        templateGrid.className = 'template-grid';
        
        category.templates.forEach(template => {
            const templateCard = document.createElement('div');
            templateCard.className = 'template-card';
            templateCard.dataset.complexity = template.complexity;
            
            const complexityColor = {
                'low': '#10b981',
                'medium': '#f59e0b',
                'high': '#ef4444'
            };
            
            templateCard.innerHTML = `
                <div class="template-card-header">
                    <div class="template-icon">${template.icon}</div>
                    <div class="template-complexity" style="background: ${complexityColor[template.complexity]}">
                        ${template.complexity}
                    </div>
                </div>
                <div class="template-card-title">${template.name}</div>
                <div class="template-card-desc">${template.description}</div>
                <div class="template-card-meta">
                    <span>📊 ${template.estimated_screens} screens</span>
                    <span>⏱️ ${template.estimated_time}</span>
                </div>
                <div class="template-card-features">
                    ${template.features.slice(0, 3).map(f => `<span class="feature-tag">${f}</span>`).join('')}
                </div>
            `;
            
            templateCard.addEventListener('click', () => {
                loadTemplate(template.file);
            });
            
            templateGrid.appendChild(templateCard);
        });
        
        categorySection.appendChild(templateGrid);
        container.appendChild(categorySection);
    });
}

async function loadTemplate(fileName) {
    if (!fileName || typeof fileName !== 'string') {
        console.error('Invalid template file name provided:', fileName);
        showToast('❌ Invalid template selected.');
        closeModal();
        return;
    }

    try {
        const response = await fetch(`templates/${fileName}`);
        if (!response.ok) {
            throw new Error(`Failed to load template: ${response.statusText} (URL: ${response.url})`);
        }
        const templateJson = await response.json();
        
        loadFlowFromJSON(templateJson);
        
        showToast(`✅ Template "${fileName.replace('.json', '')}" loaded successfully!`);
    } catch (error) {
        console.error('Error loading template:', error);
        showToast(`❌ Error loading template: ${error.message}`);
    } finally {
        closeModal();
    }
}

function closeModal() {
    document.getElementById('templateModal').classList.remove('active');
}

function loadCheckBalanceTemplate() {
    // Load the complete Check Balance flow
    const template = {
        "start_screen_id": "welcome_screen",
        "screens": {
            "welcome_screen": {
                "screen_id": "welcome_screen",
                "type": "MESSAGE_SCREEN",
                "message_text": "Welcome to Citi. How can I help you today?",
                "buttons": [
                    { "label": "Check Balance", "go_to_screen_id": "api_get_accounts" },
                    { "label": "Find ATM", "go_to_screen_id": "end_find_atm" }
                ]
            },
            "api_get_accounts": {
                "screen_id": "api_get_accounts",
                "type": "API_SCREEN",
                "api_call": {
                    "url": "https://api.citi.com/v1/user/accounts",
                    "method": "GET",
                    "save_response_to_variable": "account_list_data",
                    "on_success_go_to_screen_id": "screen_select_account",
                    "on_error_go_to_screen_id": "screen_api_error"
                }
            },
            "screen_select_account": {
                "screen_id": "screen_select_account",
                "type": "MESSAGE_SCREEN",
                "message_text": "Please select an account.",
                "dynamic_buttons": {
                    "source_variable": "account_list_data.accounts",
                    "label_template": "{{item.name}} - x{{item.last_four}}",
                    "set_variable_on_click": {
                        "selected_balance": "{{item.balance}}",
                        "selected_name": "{{item.name}}",
                        "selected_last_four": "{{item.last_four}}"
                    },
                    "go_to_screen_id": "screen_show_balance"
                },
                "buttons": [
                    { "label": "Main Menu", "go_to_screen_id": "welcome_screen" }
                ]
            },
            "screen_show_balance": {
                "screen_id": "screen_show_balance",
                "type": "MESSAGE_SCREEN",
                "message_text": "The balance for your {{selected_name}} - x{{selected_last_four}} account is ${{selected_balance}}.",
                "buttons": [
                    { "label": "Check Another Account", "go_to_screen_id": "screen_select_account" },
                    { "label": "Main Menu", "go_to_screen_id": "welcome_screen" }
                ]
            },
            "screen_api_error": {
                "screen_id": "screen_api_error",
                "type": "MESSAGE_SCREEN",
                "message_text": "I'm sorry, I was unable to retrieve your account information at this time. Please try again later.",
                "buttons": [
                    { "label": "Main Menu", "go_to_screen_id": "welcome_screen" }
                ]
            },
            "end_find_atm": {
                "screen_id": "end_find_atm",
                "type": "END_SCREEN",
                "message_text": "This feature is coming soon. Redirecting to the main menu."
            }
        }
    };

    loadFlowFromJSON(template);
    closeModal();
    showToast('✅ Check Balance flow loaded successfully!');
}

function loadBillPaymentTemplate() {
    const template = {
        "start_screen_id": "welcome_screen",
        "screens": {
            "welcome_screen": {
                "screen_id": "welcome_screen",
                "type": "MESSAGE_SCREEN",
                "message_text": "Welcome to Citi Banking! How can I help you today?",
                "buttons": [
                    { "label": "💳 Pay Bills", "go_to_screen_id": "api_get_payees" },
                    { "label": "💰 Check Balance", "go_to_screen_id": "end_other_service" },
                    { "label": "🏧 Find ATM", "go_to_screen_id": "end_other_service" }
                ]
            },
            "api_get_payees": {
                "screen_id": "api_get_payees",
                "type": "API_SCREEN",
                "api_call": {
                    "url": "https://api.citi.com/v1/bills/payees",
                    "method": "GET",
                    "save_response_to_variable": "payee_list_data",
                    "on_success_go_to_screen_id": "select_payee_screen",
                    "on_error_go_to_screen_id": "api_error_screen"
                }
            },
            "select_payee_screen": {
                "screen_id": "select_payee_screen",
                "type": "MESSAGE_SCREEN",
                "message_text": "Which bill would you like to pay?",
                "dynamic_buttons": {
                    "source_variable": "payee_list_data.payees",
                    "label_template": "{{item.name}} - {{item.nickname}}",
                    "set_variable_on_click": {
                        "selected_payee_name": "{{item.name}}",
                        "selected_payee_id": "{{item.payee_id}}",
                        "selected_payee_account": "{{item.account_number}}"
                    },
                    "go_to_screen_id": "api_get_accounts"
                },
                "buttons": [
                    { "label": "⬅️ Back to Main Menu", "go_to_screen_id": "welcome_screen" }
                ]
            },
            "api_get_accounts": {
                "screen_id": "api_get_accounts",
                "type": "API_SCREEN",
                "api_call": {
                    "url": "https://api.citi.com/v1/user/accounts",
                    "method": "GET",
                    "save_response_to_variable": "account_list_data",
                    "on_success_go_to_screen_id": "select_account_screen",
                    "on_error_go_to_screen_id": "api_error_screen"
                }
            },
            "select_account_screen": {
                "screen_id": "select_account_screen",
                "type": "MESSAGE_SCREEN",
                "message_text": "Select the account to pay from:",
                "dynamic_buttons": {
                    "source_variable": "account_list_data.accounts",
                    "label_template": "{{item.name}} - x{{item.last_four}} (${{item.balance}})",
                    "set_variable_on_click": {
                        "selected_account_name": "{{item.name}}",
                        "selected_account_last_four": "{{item.last_four}}",
                        "selected_account_balance": "{{item.balance}}"
                    },
                    "go_to_screen_id": "enter_amount_screen"
                },
                "buttons": [
                    { "label": "⬅️ Back to Payees", "go_to_screen_id": "select_payee_screen" }
                ]
            },
            "enter_amount_screen": {
                "screen_id": "enter_amount_screen",
                "type": "MESSAGE_SCREEN",
                "message_text": "You're paying {{selected_payee_name}}.\n\nHow much would you like to pay?\n\nAccount: {{selected_account_name}} - x{{selected_account_last_four}}\nAvailable: ${{selected_account_balance}}",
                "buttons": [
                    { "label": "$50", "go_to_screen_id": "confirm_payment_screen_50" },
                    { "label": "$100", "go_to_screen_id": "confirm_payment_screen_100" },
                    { "label": "$200", "go_to_screen_id": "confirm_payment_screen_200" },
                    { "label": "⬅️ Back", "go_to_screen_id": "select_account_screen" }
                ]
            },
            "confirm_payment_screen_50": {
                "screen_id": "confirm_payment_screen_50",
                "type": "MESSAGE_SCREEN",
                "message_text": "Please confirm your payment:\n\n💳 To: {{selected_payee_name}}\n💰 Amount: $50.00\n🏦 From: {{selected_account_name}} - x{{selected_account_last_four}}\n\nDo you want to proceed?",
                "buttons": [
                    { "label": "✅ Yes, Pay $50", "go_to_screen_id": "api_pay_bill_50" },
                    { "label": "❌ Cancel", "go_to_screen_id": "welcome_screen" }
                ]
            },
            "confirm_payment_screen_100": {
                "screen_id": "confirm_payment_screen_100",
                "type": "MESSAGE_SCREEN",
                "message_text": "Please confirm your payment:\n\n💳 To: {{selected_payee_name}}\n💰 Amount: $100.00\n🏦 From: {{selected_account_name}} - x{{selected_account_last_four}}\n\nDo you want to proceed?",
                "buttons": [
                    { "label": "✅ Yes, Pay $100", "go_to_screen_id": "api_pay_bill_100" },
                    { "label": "❌ Cancel", "go_to_screen_id": "welcome_screen" }
                ]
            },
            "confirm_payment_screen_200": {
                "screen_id": "confirm_payment_screen_200",
                "type": "MESSAGE_SCREEN",
                "message_text": "Please confirm your payment:\n\n💳 To: {{selected_payee_name}}\n💰 Amount: $200.00\n🏦 From: {{selected_account_name}} - x{{selected_account_last_four}}\n\nDo you want to proceed?",
                "buttons": [
                    { "label": "✅ Yes, Pay $200", "go_to_screen_id": "api_pay_bill_200" },
                    { "label": "❌ Cancel", "go_to_screen_id": "welcome_screen" }
                ]
            },
            "api_pay_bill_50": {
                "screen_id": "api_pay_bill_50",
                "type": "API_SCREEN",
                "api_call": {
                    "url": "https://api.citi.com/v1/bills/pay",
                    "method": "POST",
                    "save_response_to_variable": "payment_response",
                    "on_success_go_to_screen_id": "payment_success_screen",
                    "on_error_go_to_screen_id": "api_error_screen"
                }
            },
            "api_pay_bill_100": {
                "screen_id": "api_pay_bill_100",
                "type": "API_SCREEN",
                "api_call": {
                    "url": "https://api.citi.com/v1/bills/pay",
                    "method": "POST",
                    "save_response_to_variable": "payment_response",
                    "on_success_go_to_screen_id": "payment_success_screen",
                    "on_error_go_to_screen_id": "api_error_screen"
                }
            },
            "api_pay_bill_200": {
                "screen_id": "api_pay_bill_200",
                "type": "API_SCREEN",
                "api_call": {
                    "url": "https://api.citi.com/v1/bills/pay",
                    "method": "POST",
                    "save_response_to_variable": "payment_response",
                    "on_success_go_to_screen_id": "payment_success_screen",
                    "on_error_go_to_screen_id": "api_error_screen"
                }
            },
            "payment_success_screen": {
                "screen_id": "payment_success_screen",
                "type": "MESSAGE_SCREEN",
                "message_text": "✅ Payment Successful!\n\nConfirmation Number: {{payment_response.confirmation_number}}\n\nYour payment to {{selected_payee_name}} has been processed successfully.\n\nWhat would you like to do next?",
                "buttons": [
                    { "label": "💳 Pay Another Bill", "go_to_screen_id": "api_get_payees" },
                    { "label": "🏠 Main Menu", "go_to_screen_id": "welcome_screen" },
                    { "label": "✅ Done", "go_to_screen_id": "end_screen" }
                ]
            },
            "api_error_screen": {
                "screen_id": "api_error_screen",
                "type": "MESSAGE_SCREEN",
                "message_text": "⚠️ We're sorry, we're experiencing technical difficulties. Please try again later or contact customer service.",
                "buttons": [
                    { "label": "🔄 Try Again", "go_to_screen_id": "welcome_screen" },
                    { "label": "❌ Exit", "go_to_screen_id": "end_screen" }
                ]
            },
            "end_other_service": {
                "screen_id": "end_other_service",
                "type": "END_SCREEN",
                "message_text": "This feature is coming soon. Thank you for using Citi Banking!"
            },
            "end_screen": {
                "screen_id": "end_screen",
                "type": "END_SCREEN",
                "message_text": "Thank you for using Citi Banking! Have a great day! 😊"
            }
        }
    };

    loadFlowFromJSON(template);
    closeModal();
    showToast('✅ Bill Payment flow loaded successfully!');
}

function loadCreditCardPaymentTemplate() {
    const template = {
        "start_screen_id": "welcome_screen",
        "screens": {
            "welcome_screen": {
                "screen_id": "welcome_screen",
                "type": "MESSAGE_SCREEN",
                "message_text": "Welcome to Citi Credit Cards! How can I help you today?",
                "buttons": [
                    { "label": "💳 Make a Payment", "go_to_screen_id": "api_get_credit_cards" },
                    { "label": "📊 Check Balance", "go_to_screen_id": "end_other_service" },
                    { "label": "📜 View Statement", "go_to_screen_id": "end_other_service" }
                ]
            },
            "api_get_credit_cards": {
                "screen_id": "api_get_credit_cards",
                "type": "API_SCREEN",
                "api_call": {
                    "url": "https://api.citi.com/v1/creditcards/list",
                    "method": "GET",
                    "save_response_to_variable": "credit_card_list",
                    "on_success_go_to_screen_id": "select_card_screen",
                    "on_error_go_to_screen_id": "api_error_screen"
                }
            },
            "select_card_screen": {
                "screen_id": "select_card_screen",
                "type": "MESSAGE_SCREEN",
                "message_text": "Which credit card would you like to make a payment for?",
                "dynamic_buttons": {
                    "source_variable": "credit_card_list.cards",
                    "label_template": "{{item.card_name}} x{{item.last_four}} - Balance: ${{item.current_balance}}",
                    "set_variable_on_click": {
                        "selected_card_name": "{{item.card_name}}",
                        "selected_card_id": "{{item.card_id}}",
                        "selected_card_last_four": "{{item.last_four}}",
                        "selected_card_balance": "{{item.current_balance}}",
                        "selected_card_min_payment": "{{item.minimum_payment}}",
                        "selected_card_due_date": "{{item.due_date}}"
                    },
                    "go_to_screen_id": "api_get_bank_accounts"
                },
                "buttons": [
                    { "label": "⬅️ Back to Main Menu", "go_to_screen_id": "welcome_screen" }
                ]
            },
            "api_get_bank_accounts": {
                "screen_id": "api_get_bank_accounts",
                "type": "API_SCREEN",
                "api_call": {
                    "url": "https://api.citi.com/v1/accounts/checking",
                    "method": "GET",
                    "save_response_to_variable": "bank_accounts",
                    "on_success_go_to_screen_id": "select_payment_source",
                    "on_error_go_to_screen_id": "api_error_screen"
                }
            },
            "select_payment_source": {
                "screen_id": "select_payment_source",
                "type": "MESSAGE_SCREEN",
                "message_text": "Select account to pay from:\n\n💳 Credit Card: {{selected_card_name}} x{{selected_card_last_four}}\n💰 Current Balance: ${{selected_card_balance}}\n📅 Due Date: {{selected_card_due_date}}",
                "dynamic_buttons": {
                    "source_variable": "bank_accounts.accounts",
                    "label_template": "{{item.account_type}} x{{item.last_four}} - ${{item.available_balance}}",
                    "set_variable_on_click": {
                        "payment_account_type": "{{item.account_type}}",
                        "payment_account_last_four": "{{item.last_four}}",
                        "payment_account_balance": "{{item.available_balance}}"
                    },
                    "go_to_screen_id": "choose_payment_amount"
                },
                "buttons": [
                    { "label": "⬅️ Back to Cards", "go_to_screen_id": "select_card_screen" }
                ]
            },
            "choose_payment_amount": {
                "screen_id": "choose_payment_amount",
                "type": "MESSAGE_SCREEN",
                "message_text": "How much would you like to pay?\n\n💳 Card: {{selected_card_name}} x{{selected_card_last_four}}\n💵 Balance: ${{selected_card_balance}}\n📌 Minimum Payment: ${{selected_card_min_payment}}\n📅 Due: {{selected_card_due_date}}\n\n🏦 From: {{payment_account_type}} x{{payment_account_last_four}}",
                "buttons": [
                    { "label": "💵 Minimum Payment (${{selected_card_min_payment}})", "go_to_screen_id": "confirm_min_payment" },
                    { "label": "💰 Full Balance (${{selected_card_balance}})", "go_to_screen_id": "confirm_full_payment" },
                    { "label": "✏️ Custom Amount ($500)", "go_to_screen_id": "confirm_custom_payment" },
                    { "label": "⬅️ Back", "go_to_screen_id": "select_payment_source" }
                ]
            },
            "confirm_min_payment": {
                "screen_id": "confirm_min_payment",
                "type": "MESSAGE_SCREEN",
                "message_text": "Please confirm your payment:\n\n💳 Credit Card: {{selected_card_name}} x{{selected_card_last_four}}\n💰 Payment Amount: ${{selected_card_min_payment}}\n🏦 From: {{payment_account_type}} x{{payment_account_last_four}}\n📅 Due Date: {{selected_card_due_date}}\n\nThis will pay the minimum amount due. Proceed?",
                "buttons": [
                    { "label": "✅ Yes, Pay Minimum", "go_to_screen_id": "api_process_payment_min" },
                    { "label": "❌ Cancel", "go_to_screen_id": "welcome_screen" }
                ]
            },
            "confirm_full_payment": {
                "screen_id": "confirm_full_payment",
                "type": "MESSAGE_SCREEN",
                "message_text": "Please confirm your payment:\n\n💳 Credit Card: {{selected_card_name}} x{{selected_card_last_four}}\n💰 Payment Amount: ${{selected_card_balance}} (FULL BALANCE)\n🏦 From: {{payment_account_type}} x{{payment_account_last_four}}\n\nThis will pay your full balance. Proceed?",
                "buttons": [
                    { "label": "✅ Yes, Pay Full Balance", "go_to_screen_id": "api_process_payment_full" },
                    { "label": "❌ Cancel", "go_to_screen_id": "welcome_screen" }
                ]
            },
            "confirm_custom_payment": {
                "screen_id": "confirm_custom_payment",
                "type": "MESSAGE_SCREEN",
                "message_text": "Please confirm your payment:\n\n💳 Credit Card: {{selected_card_name}} x{{selected_card_last_four}}\n💰 Payment Amount: $500.00\n🏦 From: {{payment_account_type}} x{{payment_account_last_four}}\n\nProceed with this payment?",
                "buttons": [
                    { "label": "✅ Yes, Pay $500", "go_to_screen_id": "api_process_payment_custom" },
                    { "label": "❌ Cancel", "go_to_screen_id": "welcome_screen" }
                ]
            },
            "api_process_payment_min": {
                "screen_id": "api_process_payment_min",
                "type": "API_SCREEN",
                "api_call": {
                    "url": "https://api.citi.com/v1/creditcards/payment",
                    "method": "POST",
                    "save_response_to_variable": "payment_result",
                    "on_success_go_to_screen_id": "payment_success",
                    "on_error_go_to_screen_id": "api_error_screen"
                }
            },
            "api_process_payment_full": {
                "screen_id": "api_process_payment_full",
                "type": "API_SCREEN",
                "api_call": {
                    "url": "https://api.citi.com/v1/creditcards/payment",
                    "method": "POST",
                    "save_response_to_variable": "payment_result",
                    "on_success_go_to_screen_id": "payment_success",
                    "on_error_go_to_screen_id": "api_error_screen"
                }
            },
            "api_process_payment_custom": {
                "screen_id": "api_process_payment_custom",
                "type": "API_SCREEN",
                "api_call": {
                    "url": "https://api.citi.com/v1/creditcards/payment",
                    "method": "POST",
                    "save_response_to_variable": "payment_result",
                    "on_success_go_to_screen_id": "payment_success",
                    "on_error_go_to_screen_id": "api_error_screen"
                }
            },
            "payment_success": {
                "screen_id": "payment_success",
                "type": "MESSAGE_SCREEN",
                "message_text": "✅ Payment Successful!\n\n🎉 Confirmation: {{payment_result.confirmation_number}}\n\n💳 Card: {{selected_card_name}} x{{selected_card_last_four}}\n✅ Your payment has been processed!\n📅 Posting Date: {{payment_result.posting_date}}\n\nWhat would you like to do next?",
                "buttons": [
                    { "label": "💳 Pay Another Card", "go_to_screen_id": "api_get_credit_cards" },
                    { "label": "🏠 Main Menu", "go_to_screen_id": "welcome_screen" },
                    { "label": "✅ Done", "go_to_screen_id": "end_screen" }
                ]
            },
            "api_error_screen": {
                "screen_id": "api_error_screen",
                "type": "MESSAGE_SCREEN",
                "message_text": "⚠️ We're experiencing technical difficulties. Please try again later or contact customer service at 1-800-CITI-CARD.",
                "buttons": [
                    { "label": "🔄 Try Again", "go_to_screen_id": "welcome_screen" },
                    { "label": "❌ Exit", "go_to_screen_id": "end_screen" }
                ]
            },
            "end_other_service": {
                "screen_id": "end_other_service",
                "type": "END_SCREEN",
                "message_text": "This feature is coming soon. Thank you for using Citi Credit Cards!"
            },
            "end_screen": {
                "screen_id": "end_screen",
                "type": "END_SCREEN",
                "message_text": "Thank you for using Citi Credit Cards! Have a great day! 😊"
            }
        }
    };

    loadFlowFromJSON(template);
    closeModal();
    showToast('✅ Credit Card Payment flow loaded successfully!');
}

function loadWelcomeTemplate() {
    const template = {
        "start_screen_id": "welcome",
        "screens": {
            "welcome": {
                "screen_id": "welcome",
                "type": "MESSAGE_SCREEN",
                "message_text": "Hello! Welcome to our service.",
                "buttons": [
                    { "label": "Get Started", "go_to_screen_id": "menu" }
                ]
            },
            "menu": {
                "screen_id": "menu",
                "type": "MESSAGE_SCREEN",
                "message_text": "What would you like to do?",
                "buttons": [
                    { "label": "Option 1", "go_to_screen_id": "end" },
                    { "label": "Option 2", "go_to_screen_id": "end" }
                ]
            },
            "end": {
                "screen_id": "end",
                "type": "END_SCREEN",
                "message_text": "Thank you for using our service!"
            }
        }
    };

    loadFlowFromJSON(template);
    closeModal();
    showToast('✅ Welcome flow loaded successfully!');
}

function loadFlowFromJSON(flowConfig) {
    nodes = [];
    nodeIdCounter = 1;
    selectedNode = null;

    // Create nodes from screens
    let yPos = 100;
    let xPos = 100;
    
    // Add start node
    nodes.push({
        id: `node_${nodeIdCounter++}`,
        type: 'START',
        x: xPos,
        y: yPos,
        config: {
            screen_id: 'start',
            type: 'START',
            go_to_screen_id: flowConfig.start_screen_id
        }
    });

    xPos += 350;

    // Add screen nodes
    Object.values(flowConfig.screens).forEach((screen, idx) => {
        if (idx > 0 && idx % 3 === 0) {
            yPos += 200;
            xPos = 100;
        }

        let nodeType = 'MESSAGE';
        // Detect node type from screen properties
        if (screen.type === 'API_SCREEN' || screen.type === 'API_CALL' || screen.api_call) {
            nodeType = 'API';
        } else if (screen.type === 'END_SCREEN' || screen.go_to_screen_id === null || screen.screen_id === 'end_flow') {
            nodeType = 'END';
        } else if (screen.type === 'CONDITIONAL_SCREEN' || screen.type === 'CONDITIONAL' || screen.condition) {
            nodeType = 'CONDITIONAL';
        } else if (screen.type === 'MENU' || (screen.buttons && screen.buttons.length > 0)) {
            nodeType = 'MENU';
        }

        nodes.push({
            id: `node_${nodeIdCounter++}`,
            type: nodeType,
            x: xPos,
            y: yPos,
            config: screen
        });

        xPos += 350;
    });

    renderCanvas();
    
    // Start the chat with this flow
    chatState.flowConfig = flowConfig;
    resetChat();
}

// Export/Deploy
function exportJSON() {
    const json = generateCitiFlowJSON();
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'citiflow-config.json';
    a.click();
    showToast('✅ JSON configuration exported successfully!');
}

// Add drag and drop event listeners to the JSON textarea
function setupJSONDropHandlers() {
    const textarea = document.getElementById('jsonTextArea');
    if (textarea) {
        textarea.addEventListener('dragover', function(event) {
            event.preventDefault();
            textarea.classList.add('drag-over');
        });
        
        textarea.addEventListener('dragleave', function(event) {
            event.preventDefault();
            textarea.classList.remove('drag-over');
        });
        
        textarea.addEventListener('drop', function(event) {
            event.preventDefault();
            textarea.classList.remove('drag-over');
            handleJSONDrop(event);
        });
    }
}

function deployFlow() {
    console.log('🚀 Deploying flow...');
    
    // Generate JSON from current flow
    const json = generateCitiFlowJSON();
    
    // Validate flow has screens
    if (!json.screens || Object.keys(json.screens).length === 0) {
        showToast('⚠️ Please add some nodes to your flow first!');
        return;
    }
    
    if (!json.start_screen_id) {
        showToast('⚠️ Please set a start screen in your START node!');
        return;
    }
    
    // Store the flow configuration
    chatState.flowConfig = json;
    
    // Hide assist button in preview mode
    updateBuildAssistVisibility('preview');
    
    // Reset and start the chat
    resetChat();
    
    showToast('🚀 Flow deployed to Live Preview!');
    
    // Scroll preview into view if needed
    const preview = document.querySelector('.preview-panel');
    if (preview) {
        preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function showToast(message) {
    const toast = document.getElementById('successToast');
    toast.textContent = message;
    toast.classList.add('active');
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// ========== CHAT RENDERER ==========

function resetChat() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.innerHTML = ''; // Clear all messages
    chatState.currentScreenId = null;
    chatState.variables = {};
    
    // If we have a flow config, start the flow, otherwise show instructions
    if (chatState.flowConfig && chatState.flowConfig.start_screen_id) {
        // Hide instructions and start the flow
        const instructions = document.getElementById('previewInstructions');
        if (instructions) {
            instructions.style.display = 'none';
        }
        
        // Start the flow
        setTimeout(() => {
            startFlow();
        }, 100);
    } else {
        // Re-add the initial instructions
        messagesContainer.innerHTML = `
            <div class="preview-instructions" id="previewInstructions">
                <div class="preview-instructions-icon">🚀</div>
                <h3>Ready to Test Your Flow!</h3>
                <p>Click the <strong>"🚀 Deploy Flow"</strong> button above to start testing your chatbot in this preview area.</p>
            </div>
        `;
        updateBuildAssistVisibility('builder'); // Show assist button after reset
        showToast('🔄 Conversation Reset');
    }
}

// Start the flow
function startFlow() {
    if (chatState.flowConfig && chatState.flowConfig.start_screen_id) {
        chatState.currentScreenId = chatState.flowConfig.start_screen_id;
        renderScreen(chatState.currentScreenId);
    } else {
        addBotMessage("Please load or deploy a flow to start testing.");
    }
}

function renderScreen(screenId) {
    const screen = chatState.flowConfig.screens[screenId];
    if (!screen) {
        addBotMessage("Error: Screen not found - " + screenId);
        return;
    }

    // Handle different screen types - support both old and new naming conventions
    if (screen.type === 'API_SCREEN' || screen.type === 'API_CALL' || screen.api_call) {
        handleAPIScreen(screen);
    } else if (screen.type === 'CONDITIONAL_SCREEN' || screen.type === 'CONDITIONAL' || screen.condition) {
        handleConditionalScreen(screen);
    } else if (screen.type === 'END_SCREEN' || screen.go_to_screen_id === null) {
        handleEndScreen(screen);
    } else {
        handleMessageScreen(screen);
    }
}

function handleMessageScreen(screen) {
    // Process message text with variable substitution
    const message = substituteVariables(screen.message_text);
    
    // Show bot message
    addBotMessage(message);

    // Render buttons
    const buttons = [];

    // Static buttons
    if (screen.buttons && screen.buttons.length > 0) {
        buttons.push(...screen.buttons);
    }

    // Dynamic buttons
    if (screen.dynamic_buttons) {
        const dynamicButtons = generateDynamicButtons(screen.dynamic_buttons);
        buttons.push(...dynamicButtons);
    }

    // Calculate delay for quick replies based on message length
    const words = message.split(' ');
    const messageDelay = Math.min(800, words.length * 30); // Typing indicator delay
    const revealDelay = message.includes('**') || message.includes('\n') ? 
                        (message.split('\n').length * 150) : // Progressive reveal delay
                        (words.length * 50); // Word-by-word delay
    const totalDelay = messageDelay + revealDelay + 300; // Add buffer
    
    // Show quick replies after message animation completes
    if (buttons.length > 0) {
        setTimeout(() => {
            addQuickReplies(buttons, screen.dynamic_buttons);
        }, totalDelay);
    }
}

async function handleAPIScreen(screen) {
    const apiCall = screen.api_call;
    
    // Show loading
    showLoading();

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    hideLoading();

    // Check for mock response in API call or use mockAPIResponses
    let mockResponse = null;
    
    if (apiCall.mock_response) {
        // Direct mock response in the template
        mockResponse = apiCall.mock_response;
    } else if (apiCall.mock_file) {
        // Mock file reference - try to load it dynamically
        mockResponse = await loadMockFile(apiCall.mock_file);
        if (!mockResponse) {
            // Fallback to mockAPIResponses
            mockResponse = mockAPIResponses[apiCall.url];
        }
    } else {
        // Fallback to mockAPIResponses
        mockResponse = mockAPIResponses[apiCall.url];
    }
    
    if (mockResponse) {
        // Save response to variable (support both naming conventions)
        const saveToVar = apiCall.save_response_to || apiCall.save_response_to_variable;
        if (saveToVar) {
            chatState.variables[saveToVar] = mockResponse;
        }
        
        // Go to success screen (support both naming conventions)
        const successScreen = screen.on_success || apiCall.on_success_go_to_screen_id;
        if (successScreen) {
            chatState.currentScreenId = successScreen;
            renderScreen(successScreen);
        }
    } else {
        // Go to error screen (support both naming conventions)
        const errorScreen = screen.on_error || apiCall.on_error_go_to_screen_id;
        if (errorScreen) {
            chatState.currentScreenId = errorScreen;
            renderScreen(errorScreen);
        }
    }
}

function handleConditionalScreen(screen) {
    const condition = screen.condition;
    const variable = chatState.variables[condition.variable];
    let result = false;

    switch (condition.operator) {
        case 'equals':
            result = variable == condition.value;
            break;
        case 'exists':
            result = variable !== undefined && variable !== null;
            break;
        case 'greater_than':
            result = parseFloat(variable) > parseFloat(condition.value);
            break;
    }

    const nextScreenId = result ? screen.go_to_screen_id : screen.on_false_go_to_screen_id;
    if (nextScreenId) {
        chatState.currentScreenId = nextScreenId;
        renderScreen(nextScreenId);
    }
}

function handleEndScreen(screen) {
    if (screen.message_text) {
        const message = substituteVariables(screen.message_text);
        addBotMessage(message);
    }
    
    // Check if we're in a unified bot (has main_menu)
    const isUnifiedBot = chatState.flowConfig.screens['main_menu'] !== undefined;
    
    if (isUnifiedBot) {
        // Show smart quick replies for next actions
        showSmartQuickReplies(screen.screen_id);
    } else {
        // Single template mode - show restart option
        addBotMessage("Is there anything else I can help you with?");
        const resetButton = [{ 
            label: "Start Over", 
            go_to_screen_id: chatState.flowConfig.start_screen_id 
        }];
        addQuickReplies(resetButton);
    }
}

// Generate smart quick replies after task completion
function showSmartQuickReplies(currentScreenId) {
    const buttons = [];
    
    // Get the current template ID (prefix before first underscore)
    let currentTemplate = null;
    if (currentScreenId && currentScreenId.includes('_')) {
        const parts = currentScreenId.split('_');
        if (parts.length > 1) {
            currentTemplate = parts[0];
        }
    }
    
    // Determine which category we're in
    let currentCategory = null;
    if (currentTemplate) {
        currentCategory = getTemplateCategory(currentTemplate + '.json');
    }
    
    // Add "What else can I help with?" message
    addBotMessage("What else can I help you with?");
    
    // If we know the category, show other services in that category first
    if (currentCategory && chatState.flowConfig.screens[`${currentCategory}_menu`]) {
        // Get services from the same category (excluding current one)
        const categoryMenu = chatState.flowConfig.screens[`${currentCategory}_menu`];
        if (categoryMenu && categoryMenu.buttons) {
            categoryMenu.buttons.forEach(btn => {
                // Skip the service we just used and "Back to Main Menu"
                const isCurrentService = currentTemplate && btn.go_to_screen_id && 
                                       btn.go_to_screen_id.startsWith(currentTemplate + '_');
                const isBackButton = btn.label.includes('Main Menu') || btn.label.includes('Back');
                
                if (!isCurrentService && !isBackButton && buttons.length < 3) {
                    buttons.push({
                        label: btn.label,
                        go_to_screen_id: btn.go_to_screen_id
                    });
                }
            });
        }
    }
    
    // Add "Explore Other Services" option if we have main menu
    if (chatState.flowConfig.screens['main_menu']) {
        buttons.push({
            label: "Explore Other Services",
            go_to_screen_id: "main_menu"
        });
    }
    
    // Add "Done" option
    buttons.push({
        label: "Done",
        go_to_screen_id: null // This will end the conversation
    });
    
    // Show the quick replies
    if (buttons.length > 0) {
        addQuickReplies(buttons);
    }
}

function substituteVariables(text) {
    if (!text) return '';
    
    return text.replace(/\{\{([^}]+)\}\}/g, (match, varPath) => {
        const value = getNestedValue(chatState.variables, varPath.trim());
        return value !== undefined ? value : match;
    });
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((current, prop) => {
        return current ? current[prop] : undefined;
    }, obj);
}

function generateDynamicButtons(dynamicConfig) {
    const sourceData = getNestedValue(chatState.variables, dynamicConfig.source_variable);
    if (!Array.isArray(sourceData)) return [];

    return sourceData.map(item => {
        // Support both {{item.property}} and {{property}} formats
        let label = dynamicConfig.label_template;
        
        // Replace {{item.property}} format
        label = label.replace(/\{\{item\.([^}]+)\}\}/g, (match, prop) => {
            return item[prop] || match;
        });
        
        // Replace {{property}} format (without item prefix)
        label = label.replace(/\{\{([^}]+)\}\}/g, (match, prop) => {
            return item[prop] || match;
        });

        return {
            label: label,
            go_to_screen_id: dynamicConfig.go_to_screen_id,
            dynamicData: item,
            setVariables: dynamicConfig.set_variable_on_click,
            setVariable: dynamicConfig.set_variable
        };
    });
}

function addBotMessage(text, useTypewriter = true) {
    const messagesContainer = document.getElementById('chatMessages');
    
    // Show typing indicator first
    showTypingIndicator();
    
    // Calculate typing delay based on message length
    const words = text.split(' ');
    const typingDelay = useTypewriter ? Math.min(800, words.length * 30) : 0;
    
    setTimeout(() => {
        hideTypingIndicator();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message message-bot';
        const timestamp = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="message-bubble">
                    <div class="typing-text"></div>
                    <span class="message-time">${timestamp}</span>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Apply typewriter effect if enabled
        if (useTypewriter) {
            const textContainer = messageDiv.querySelector('.typing-text');
            typewriterEffect(textContainer, formatBotMessage(text));
        } else {
            const textContainer = messageDiv.querySelector('.typing-text');
            textContainer.innerHTML = formatBotMessage(text);
        }
    }, typingDelay);
}

// Format bot messages for better readability
function formatBotMessage(text) {
    // Enhanced formatting for financial data and structured content
    let formatted = text;
    
    // Format bold sections (markdown-style **text**)
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Format newlines
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Detect and format financial data patterns
    // e.g., "Current Balance: $1,234.56"
    formatted = formatted.replace(/(\*\*[^:]+:\*\*\s*\$[\d,]+\.?\d*)/g, '<div class="financial-item">$1</div>');
    
    return formatted;
}

// Typewriter effect - word by word with HTML support
function typewriterEffect(container, text) {
    // Parse HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    
    // Check if content has complex formatting
    const hasFormatting = text.includes('<strong>') || text.includes('<br>');
    
    if (hasFormatting) {
        // For formatted content, use progressive reveal
        container.innerHTML = '';
        progressiveReveal(container, text);
    } else {
        // Simple word-by-word effect for plain text
        const words = text.split(' ');
        container.innerHTML = '';
        
        words.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'typing-word';
            wordSpan.textContent = word + (index < words.length - 1 ? ' ' : '');
            wordSpan.style.animationDelay = `${index * 0.05}s`;
            container.appendChild(wordSpan);
        });
    }
    
    // Scroll to bottom as text appears
    const messagesContainer = document.getElementById('chatMessages');
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
}

// Progressive reveal for formatted HTML content
function progressiveReveal(container, htmlText) {
    // Split by line breaks to reveal section by section
    const sections = htmlText.split('<br>');
    let currentIndex = 0;
    
    function revealNextSection() {
        if (currentIndex < sections.length) {
            const section = sections[currentIndex];
            if (section.trim()) {
                const sectionDiv = document.createElement('div');
                sectionDiv.innerHTML = section;
                sectionDiv.style.opacity = '0';
                sectionDiv.style.animation = 'fadeIn 0.3s ease-in forwards';
                container.appendChild(sectionDiv);
                
                // Add line break except for last section
                if (currentIndex < sections.length - 1) {
                    container.appendChild(document.createElement('br'));
                }
            }
            
            currentIndex++;
            
            // Scroll to bottom
            const messagesContainer = document.getElementById('chatMessages');
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Continue revealing
            if (currentIndex < sections.length) {
                setTimeout(revealNextSection, 150); // Delay between sections
            }
        }
    }
    
    revealNextSection();
}

// Show typing indicator
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    
    // Remove existing typing indicator if present
    const existing = document.getElementById('typingIndicator');
    if (existing) existing.remove();
    
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

function addUserMessage(text) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message message-user';
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-bubble">
                ${text}
                <span class="message-time" style="color: rgba(255,255,255,0.8);">${timestamp}</span>
            </div>
        </div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addQuickReplies(buttons) {
    const messagesContainer = document.getElementById('chatMessages');
    const lastMessage = messagesContainer.lastElementChild;
    
    // This function now appends replies in a new message container below the last message.
    // Ensure we don't add multiple reply containers.
    const existingReplies = document.getElementById('currentQuickReplies');
    if (existingReplies) {
        existingReplies.parentElement.remove();
    }

    const repliesContainerWrapper = document.createElement('div');
    repliesContainerWrapper.id = 'currentQuickReplies';

    const repliesDiv = document.createElement('div');
    repliesDiv.className = 'quick-replies';
    
    repliesContainerWrapper.appendChild(repliesDiv);

    const renderButtons = (showAll = false) => {
        repliesDiv.innerHTML = '';
        const visibleButtons = showAll ? buttons : buttons.slice(0, 4);

        visibleButtons.forEach(btn => {
            const button = document.createElement('button');
            button.className = 'quick-reply';
            button.textContent = btn.label;
            button.onclick = () => handleQuickReply(btn);
            repliesDiv.appendChild(button);
        });

        if (!showAll && buttons.length > 4) {
            const seeMoreBtn = document.createElement('button');
            seeMoreBtn.className = 'quick-reply see-more';
            seeMoreBtn.textContent = 'See more';
            seeMoreBtn.onclick = () => renderButtons(true);
            repliesDiv.appendChild(seeMoreBtn);
        }
    };

    renderButtons(false); // Initial render

    if (lastMessage && lastMessage.classList.contains('message-bot')) {
         const contentDiv = lastMessage.querySelector('.message-content');
         if(contentDiv) {
            contentDiv.appendChild(repliesContainerWrapper);
         }
    } else {
        // If the last message isn't a bot message, create a new container for replies.
        const newRepliesMessage = document.createElement('div');
        newRepliesMessage.className = 'message';
        newRepliesMessage.appendChild(repliesContainerWrapper);
        messagesContainer.appendChild(newRepliesMessage);
    }
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function handleQuickReply(button) {
    // Remove quick replies
    const repliesDiv = document.getElementById('currentQuickReplies');
    if (repliesDiv) {
        repliesDiv.remove();
    }

    // Show user's choice
    addUserMessage(button.label);

    // Handle static variable setting (set_variable + set_value)
    if (button.set_variable && button.set_value) {
        chatState.variables[button.set_variable] = button.set_value;
    }

    // Handle dynamic button data - support both formats
    if (button.dynamicData) {
        // If setVariables is specified, use it to map data to variables
        if (button.setVariables) {
            Object.keys(button.setVariables).forEach(varName => {
                const template = button.setVariables[varName];
                let value = template;
                
                // Replace {{item.property}} format
                value = value.replace(/\{\{item\.([^}]+)\}\}/g, (match, prop) => {
                    return button.dynamicData[prop] || match;
                });
                
                // Replace {{property}} format
                value = value.replace(/\{\{([^}]+)\}\}/g, (match, prop) => {
                    return button.dynamicData[prop] || match;
                });
                
                chatState.variables[varName] = value;
            });
        }
        
        // New template format: set_variable directly specifies the variable name
        // Store the entire item under the specified variable name
        if (button.setVariable) {
            chatState.variables[button.setVariable] = button.dynamicData;
        }
    }

    // Navigate to next screen
    if (button.go_to_screen_id) {
        chatState.currentScreenId = button.go_to_screen_id;
        setTimeout(() => {
            renderScreen(button.go_to_screen_id);
        }, 500);
    } else if (button.go_to_screen_id === null) {
        // User clicked "Done" - end conversation gracefully
        setTimeout(() => {
            addBotMessage("Thank you for using Citi Banking! Have a great day!");
        }, 500);
    }
}

function showLoading() {
    const messagesContainer = document.getElementById('chatMessages');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message message-bot';
    loadingDiv.id = 'loadingMessage';
    loadingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="chat-loading active">
                <div class="typing-indicator">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            </div>
        </div>
    `;
    messagesContainer.appendChild(loadingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideLoading() {
    const loading = document.getElementById('loadingMessage');
    if (loading) {
        loading.remove();
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);

// Build Assist Panel
function toggleBuildAssistPanel() {
    const panel = document.getElementById('buildAssistPanel');
    if (panel) {
        panel.classList.toggle('visible');
    }
}

function sendAssistMessage() {
    const input = document.getElementById('assistInput');
    const messagesContainer = document.getElementById('assistMessages');
    const query = input.value.trim();

    if (query === '' || !messagesContainer) return;

    // Display user message
    const userMessage = document.createElement('div');
    userMessage.className = 'assist-message user';
    userMessage.textContent = query;
    messagesContainer.appendChild(userMessage);

    // Get and display bot response
    const botResponse = getAssistResponse(query);
    const botMessage = document.createElement('div');
    botMessage.className = 'assist-message bot';
    botMessage.innerHTML = botResponse; // Use innerHTML to render formatted lists
    messagesContainer.appendChild(botMessage);

    // Scroll to bottom and clear input
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    input.value = '';
    input.focus();
}

// Simulated Gemini flash model for Build Assist
function getAssistResponse(query) {
    const q = query.toLowerCase();

    if (q.includes('card replacement') || q.includes('replace') && q.includes('card')) {
        return `
            <p>Great! Here is a step-by-step guide to build a <strong>Card Replacement Flow</strong>:</p>
            <ol style="padding-left: 20px; margin-top: 10px;">
                <li>Drag a <strong>Start</strong> node to the canvas.</li>
                <li>Add an <strong>API Call</strong> node to get the user's credit cards. Use the <code>Get User Credit Cards</code> API from the library.</li>
                <li>Add a <strong>Menu</strong> node to display the cards as buttons for the user to select.</li>
                <li>Add another <strong>Menu</strong> to ask for the replacement reason (e.g., Lost, Stolen, Damaged).</li>
                <li>Add a <strong>Menu</strong> to confirm the delivery address.</li>
                <li>Use a <strong>Message</strong> node to show a final summary before confirming.</li>
                <li>Add an <strong>API Call</strong> node to process the replacement. Use the <code>Replace Credit Card</code> API.</li>
                <li>Finish with <strong>Message</strong> and <strong>End</strong> nodes for success and error scenarios.</li>
            </ol>
            <p>Remember to connect the success and error paths for each API call!</p>
        `;
    }

    if (q.includes('node') || q.includes('component')) {
        return `
            <p>The Flow Builder has several key components:</p>
            <ul style="padding-left: 20px; margin-top: 10px;">
                <li><strong>Start:</strong> The entry point of your flow.</li>
                <li><strong>Message:</strong> Displays text to the user.</li>
                <li><strong>Menu:</strong> Shows text and interactive buttons.</li>
                <li><strong>API Call:</strong> Fetches or sends data to external systems.</li>
                <li><strong>Condition:</strong> Creates branches in your logic.</li>
                <li><strong>End:</strong> Terminates the conversation.</li>
            </ul>
        `;
    }

    return "I can currently provide detailed guidance for the Card Replacement flow. Try asking 'How do I build a card replacement flow?'";
}

// Controls the visibility of the Build Assist button based on the current UI view
function updateBuildAssistVisibility(mode) {
    const buildAssistBtn = document.getElementById('buildAssistBtn');
    if (buildAssistBtn) {
        if (mode === 'builder') {
            buildAssistBtn.style.display = 'block';
        } else {
            buildAssistBtn.style.display = 'none';
        }
    }
}

// ================================================================================
// MASTER TEMPLATE BUILDER - Unified Bot Generation
// ================================================================================

// Master Template Builder State
let masterTemplateState = {
    selectedCategories: [],
    selectedTemplates: [],
    botConfig: {
        name: 'Citi Banking Assistant',
        welcomeMessage: 'Welcome to Citi Banking Assistant! How can I help you today?',
        menuStyle: 'category',
        includeSupport: true
    },
    currentStep: 1,
    templateCache: {}
};

// Open Master Template Builder Modal
function openMasterTemplateModal() {
    document.getElementById('masterTemplateModal').classList.add('active');
    resetMasterTemplateBuilder();
}

// Close Master Template Builder Modal
function closeMasterTemplateModal() {
    document.getElementById('masterTemplateModal').classList.remove('active');
}

// Reset Master Template Builder to initial state
function resetMasterTemplateBuilder() {
    masterTemplateState.currentStep = 1;
    masterTemplateState.selectedCategories = [];
    masterTemplateState.selectedTemplates = [];
    masterTemplateState.botConfig = {
        name: 'Citi Banking Assistant',
        welcomeMessage: 'Welcome to Citi Banking Assistant! How can I help you today?',
        menuStyle: 'category',
        includeSupport: true
    };
    
    // Reset UI - Step indicators
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active', 'completed');
    });
    document.querySelector('.step[data-step="1"]').classList.add('active');
    
    // Reset UI - Step content
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById('step1').classList.add('active');
    
    // Reset checkboxes
    document.querySelectorAll('.category-checkbox').forEach(cb => cb.checked = false);
    document.querySelectorAll('.category-card').forEach(card => card.classList.remove('selected'));
    
    // Update button visibility
    updateNavigationButtons();
}

// Navigation between steps
function nextStep() {
    if (masterTemplateState.currentStep < 4) {
        if (validateCurrentStep()) {
            // Mark current step as completed
            document.querySelector(`.step[data-step="${masterTemplateState.currentStep}"]`).classList.add('completed');
            
            masterTemplateState.currentStep++;
            updateStepDisplay();
            
            // Load content for new step
            if (masterTemplateState.currentStep === 2) {
                loadTemplateSelection();
            } else if (masterTemplateState.currentStep === 4) {
                loadGenerationSummary();
            }
            
            updateNavigationButtons();
        }
    }
}

function previousStep() {
    if (masterTemplateState.currentStep > 1) {
        masterTemplateState.currentStep--;
        updateStepDisplay();
        updateNavigationButtons();
    }
}

// Update which step is displayed
function updateStepDisplay() {
    // Update step indicators
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector(`.step[data-step="${masterTemplateState.currentStep}"]`).classList.add('active');
    
    // Update step content
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`step${masterTemplateState.currentStep}`).classList.add('active');
}

// Update navigation button states
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevStepBtn');
    const nextBtn = document.getElementById('nextStepBtn');
    
    // Disable previous on first step
    prevBtn.disabled = masterTemplateState.currentStep === 1;
    prevBtn.style.opacity = masterTemplateState.currentStep === 1 ? '0.5' : '1';
    
    // Hide next button on last step
    if (masterTemplateState.currentStep === 4) {
        nextBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'block';
    }
}

// Validate current step before proceeding
function validateCurrentStep() {
    switch (masterTemplateState.currentStep) {
        case 1:
            // Validate category selection
            const selectedCategories = document.querySelectorAll('.category-checkbox:checked');
            if (selectedCategories.length === 0) {
                showToast('❌ Please select at least one category');
                return false;
            }
            masterTemplateState.selectedCategories = Array.from(selectedCategories).map(cb => cb.value);
            return true;
            
        case 2:
            // Validate template selection
            const selectedTemplates = document.querySelectorAll('.template-checkbox:checked');
            if (selectedTemplates.length === 0) {
                showToast('❌ Please select at least one template');
                return false;
            }
            masterTemplateState.selectedTemplates = Array.from(selectedTemplates).map(cb => cb.value);
            return true;
            
        case 3:
            // Validate configuration
            const botName = document.getElementById('botName').value.trim();
            const welcomeMessage = document.getElementById('welcomeMessage').value.trim();
            
            if (!botName || !welcomeMessage) {
                showToast('❌ Please fill in all configuration fields');
                return false;
            }
            
            masterTemplateState.botConfig = {
                name: botName,
                welcomeMessage: welcomeMessage,
                menuStyle: document.getElementById('menuStyle').value,
                includeSupport: document.getElementById('includeSupport').checked
            };
            return true;
            
        default:
            return true;
    }
}

// Load template selection based on selected categories
async function loadTemplateSelection() {
    const container = document.getElementById('templateSelectionContainer');
    container.innerHTML = '<div style="text-align:center;padding:20px;">Loading templates...</div>';
    
    try {
        const catalog = await loadTemplateCatalog();
        container.innerHTML = '';
        
        masterTemplateState.selectedCategories.forEach(categoryId => {
            const category = Object.values(catalog.categories).find(cat => cat.id === categoryId);
            if (category) {
                const categorySection = document.createElement('div');
                categorySection.className = 'template-category-section';
                categorySection.innerHTML = `
                    <h4>${category.icon} ${category.name}</h4>
                    <div class="template-selection-grid" id="templates-${categoryId}">
                    </div>
                `;
                
                const templateGrid = categorySection.querySelector('.template-selection-grid');
                
                category.templates.forEach(template => {
                    const templateCard = document.createElement('div');
                    templateCard.className = 'template-selection-card';
                    templateCard.innerHTML = `
                        <div class="template-selection-header">
                            <input type="checkbox" class="template-checkbox" value="${template.file}" id="template-${template.id}">
                            <label for="template-${template.id}">
                                <strong>${template.icon} ${template.name}</strong>
                            </label>
                        </div>
                        <p>${template.description}</p>
                        <div class="template-meta">
                            <span>📊 ${template.estimated_screens} screens</span>
                            <span>⏱️ ${template.estimated_time}</span>
                        </div>
                    `;
                    
                    // Add click handler for card selection
                    templateCard.addEventListener('click', (e) => {
                        if (e.target.type !== 'checkbox') {
                            const checkbox = templateCard.querySelector('.template-checkbox');
                            checkbox.checked = !checkbox.checked;
                            templateCard.classList.toggle('selected', checkbox.checked);
                        }
                    });
                    
                    // Add checkbox change handler
                    const checkbox = templateCard.querySelector('.template-checkbox');
                    checkbox.addEventListener('change', () => {
                        templateCard.classList.toggle('selected', checkbox.checked);
                    });
                    
                    templateGrid.appendChild(templateCard);
                });
                
                container.appendChild(categorySection);
            }
        });
        
    } catch (error) {
        console.error('Error loading template selection:', error);
        container.innerHTML = '<div style="text-align:center;color:red;padding:20px;">Error loading templates</div>';
        showToast('❌ Error loading templates');
    }
}

// Load generation summary
function loadGenerationSummary() {
    const summaryContainer = document.getElementById('generationSummary');
    
    const selectedTemplateCount = masterTemplateState.selectedTemplates.length;
    const estimatedScreens = selectedTemplateCount * 8; // Rough estimate
    
    summaryContainer.innerHTML = `
        <h4>🎯 Generation Summary</h4>
        <div class="summary-grid">
            <div class="summary-item">
                <strong>Bot Name</strong>
                <div>${masterTemplateState.botConfig.name}</div>
            </div>
            <div class="summary-item">
                <strong>Categories</strong>
                <div>${masterTemplateState.selectedCategories.length}</div>
            </div>
            <div class="summary-item">
                <strong>Templates</strong>
                <div>${selectedTemplateCount}</div>
            </div>
            <div class="summary-item">
                <strong>Est. Screens</strong>
                <div>~${estimatedScreens}+</div>
            </div>
            <div class="summary-item">
                <strong>Menu Style</strong>
                <div>${masterTemplateState.botConfig.menuStyle === 'category' ? 'By Category' : 'Flat List'}</div>
            </div>
        </div>
        
        <div class="selected-templates">
            <h5>Selected Templates:</h5>
            <ul>
                ${masterTemplateState.selectedTemplates.map(template => 
                    `<li>${template.replace('.json', '').replace(/_/g, ' ')}</li>`
                ).join('')}
            </ul>
        </div>
    `;
}

// Generate unified bot - Main function
async function generateUnifiedBot() {
    try {
        showToast('🔄 Generating unified bot...');
        
        // Load all selected templates
        const templateData = await loadSelectedTemplates();
        
        // Generate master template
        const masterTemplate = await createMasterTemplate(templateData);
        
        // Load the generated template into the flow builder
        loadFlowFromJSON(masterTemplate);
        
        // Close modal and show success
        closeMasterTemplateModal();
        showToast('✅ Unified banking bot generated successfully!');
        
    } catch (error) {
        console.error('Error generating unified bot:', error);
        showToast('❌ Error generating bot: ' + error.message);
    }
}

// Load all selected template files
async function loadSelectedTemplates() {
    const templateData = {};
    
    for (const templateFile of masterTemplateState.selectedTemplates) {
        try {
            // Check cache first
            if (masterTemplateState.templateCache[templateFile]) {
                templateData[templateFile] = masterTemplateState.templateCache[templateFile];
                continue;
            }
            
            const response = await fetch(`templates/${templateFile}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${templateFile}`);
            }
            const data = await response.json();
            
            // Cache the template
            masterTemplateState.templateCache[templateFile] = data;
            templateData[templateFile] = data;
        } catch (error) {
            console.error(`Error loading template ${templateFile}:`, error);
            throw error;
        }
    }
    
    return templateData;
}

// Create master template by merging all selected templates
async function createMasterTemplate(templateData) {
    const masterTemplate = {
        start_screen_id: "main_menu",
        screens: {}
    };
    
    // Create main menu
    masterTemplate.screens.main_menu = createMainMenuScreen();
    
    // Create category menus if using category style
    if (masterTemplateState.botConfig.menuStyle === 'category') {
        const categoryMenus = createCategoryMenus();
        Object.assign(masterTemplate.screens, categoryMenus);
    }
    
    // Merge all selected templates
    for (const [templateFile, template] of Object.entries(templateData)) {
        const templateId = templateFile.replace('.json', '');
        mergeTemplateIntoMaster(masterTemplate, template, templateId);
    }
    
    return masterTemplate;
}

// Create main menu screen
function createMainMenuScreen() {
    const buttons = [];
    
    if (masterTemplateState.botConfig.menuStyle === 'category') {
        // Category-based menu
        if (masterTemplateState.selectedCategories.includes('credit_cards')) {
            buttons.push({ 
                "label": "Credit Card Services", 
                "go_to_screen_id": "credit_cards_menu" 
            });
        }
        
        if (masterTemplateState.selectedCategories.includes('retail_banking')) {
            buttons.push({ 
                "label": "Banking Services", 
                "go_to_screen_id": "retail_banking_menu" 
            });
        }
        
        if (masterTemplateState.selectedCategories.includes('getting_started')) {
            buttons.push({ 
                "label": "Quick Services", 
                "go_to_screen_id": "getting_started_menu" 
            });
        }
    } else {
        // Flat list - add direct links to services
        const catalog = templateCatalog;
        masterTemplateState.selectedTemplates.forEach(templateFile => {
            const templateId = templateFile.replace('.json', '');
            const templateName = getTemplateFriendlyName(templateFile);
            const startScreen = getTemplateStartScreen(templateFile);
            
            buttons.push({
                "label": templateName,
                "go_to_screen_id": `${templateId}_${startScreen}`
            });
        });
    }
    
    if (masterTemplateState.botConfig.includeSupport) {
        buttons.push({ 
            "label": "Contact Support", 
            "go_to_screen_id": "support_screen" 
        });
    }
    
    return {
        "screen_id": "main_menu",
        "type": "MENU",
        "message_text": masterTemplateState.botConfig.welcomeMessage,
        "buttons": buttons
    };
}

// Create category-specific menu screens
function createCategoryMenus() {
    const menus = {};
    
    if (masterTemplateState.selectedCategories.includes('credit_cards')) {
        menus.credit_cards_menu = {
            "screen_id": "credit_cards_menu",
            "type": "MENU",
            "message_text": "Credit Card Services - What would you like to do?",
            "buttons": [
                ...getCategoryTemplateButtons('credit_cards'),
                { "label": "Back to Main Menu", "go_to_screen_id": "main_menu" }
            ]
        };
    }
    
    if (masterTemplateState.selectedCategories.includes('retail_banking')) {
        menus.retail_banking_menu = {
            "screen_id": "retail_banking_menu",
            "type": "MENU",
            "message_text": "Banking Services - What would you like to do?",
            "buttons": [
                ...getCategoryTemplateButtons('retail_banking'),
                { "label": "Back to Main Menu", "go_to_screen_id": "main_menu" }
            ]
        };
    }
    
    if (masterTemplateState.selectedCategories.includes('getting_started')) {
        menus.getting_started_menu = {
            "screen_id": "getting_started_menu",
            "type": "MENU",
            "message_text": "Quick Services - What would you like to do?",
            "buttons": [
                ...getCategoryTemplateButtons('getting_started'),
                { "label": "Back to Main Menu", "go_to_screen_id": "main_menu" }
            ]
        };
    }
    
    // Add support screen if enabled
    if (masterTemplateState.botConfig.includeSupport) {
        menus.support_screen = {
            "screen_id": "support_screen",
            "type": "MESSAGE",
            "message_text": "For support, please call 1-800-CITI-HELP (1-800-248-4435) or visit your nearest branch.\n\nOur customer service is available 24/7.",
            "buttons": [
                { "label": "Back to Main Menu", "go_to_screen_id": "main_menu" }
            ]
        };
    }
    
    return menus;
}

// Get buttons for a specific category
function getCategoryTemplateButtons(categoryId) {
    const buttons = [];
    
    masterTemplateState.selectedTemplates.forEach(templateFile => {
        const templateId = templateFile.replace('.json', '');
        const templateCategory = getTemplateCategory(templateFile);
        
        if (templateCategory === categoryId) {
            const templateName = getTemplateFriendlyName(templateFile);
            const startScreen = getTemplateStartScreen(templateFile);
            
            buttons.push({
                "label": templateName,
                "go_to_screen_id": `${templateId}_${startScreen}`
            });
        }
    });
    
    return buttons;
}

// Get friendly name for template
function getTemplateFriendlyName(templateFile) {
    const nameMap = {
        'card_replacement.json': 'Replace Card',
        'check_card_balance.json': 'Check Card Balance',
        'recent_transactions.json': 'Recent Transactions',
        'view_card_statements.json': 'View Statements',
        'dispute_transaction.json': 'Dispute Transaction',
        'rewards_redemption.json': 'Redeem Rewards',
        'autopay_setup.json': 'Set Up AutoPay',
        'credit_limit_increase.json': 'Increase Credit Limit',
        'balance_transfer.json': 'Balance Transfer',
        'card_activation.json': 'Activate Card',
        'fund_transfer.json': 'Transfer Funds',
        'bill_payment.json': 'Pay Bills',
        'check_deposit.json': 'Mobile Check Deposit',
        'wire_transfer.json': 'Wire Transfer',
        'loan_application.json': 'Apply for Loan',
        'stop_payment.json': 'Stop Payment',
        'beneficiary_management.json': 'Manage Beneficiaries',
        'statement_download.json': 'View Statements',
        'account_opening.json': 'Open Account',
        'welcome_flow.json': 'Getting Started',
        'check_balance.json': 'Check Balance',
        'credit_card_payment.json': 'Pay Credit Card'
    };
    
    return nameMap[templateFile] || templateFile.replace('.json', '').replace(/_/g, ' ');
}

// Determine which category a template belongs to
function getTemplateCategory(templateFile) {
    const creditCardTemplates = [
        'card_replacement.json', 'check_card_balance.json', 'recent_transactions.json', 
        'view_card_statements.json', 'dispute_transaction.json', 'rewards_redemption.json',
        'autopay_setup.json', 'credit_limit_increase.json', 'balance_transfer.json',
        'card_activation.json', 'credit_card_payment.json'
    ];
    
    const bankingTemplates = [
        'fund_transfer.json', 'bill_payment.json', 'check_deposit.json', 'wire_transfer.json',
        'loan_application.json', 'stop_payment.json', 'beneficiary_management.json',
        'statement_download.json', 'account_opening.json'
    ];
    
    const basicTemplates = ['welcome_flow.json', 'check_balance.json'];
    
    if (creditCardTemplates.includes(templateFile)) return 'credit_cards';
    if (bankingTemplates.includes(templateFile)) return 'retail_banking';
    if (basicTemplates.includes(templateFile)) return 'getting_started';
    
    return 'getting_started'; // default
}

// Get the starting screen ID for a template
function getTemplateStartScreen(templateFile) {
    const startScreenMap = {
        'card_replacement.json': 'select_card',
        'check_card_balance.json': 'get_cards',
        'recent_transactions.json': 'get_cards',
        'view_card_statements.json': 'get_cards',
        'dispute_transaction.json': 'get_cards',
        'rewards_redemption.json': 'get_rewards',
        'autopay_setup.json': 'get_cards',
        'credit_limit_increase.json': 'get_cards',
        'balance_transfer.json': 'get_cards',
        'card_activation.json': 'enter_card_number',
        'fund_transfer.json': 'select_transfer_type',
        'bill_payment.json': 'welcome_screen',
        'check_deposit.json': 'get_accounts',
        'wire_transfer.json': 'select_wire_type',
        'loan_application.json': 'select_loan_amount',
        'stop_payment.json': 'get_accounts',
        'beneficiary_management.json': 'beneficiary_menu',
        'statement_download.json': 'select_statement_type',
        'account_opening.json': 'select_account_type',
        'welcome_flow.json': 'welcome_screen',
        'check_balance.json': 'api_get_accounts',
        'credit_card_payment.json': 'get_cards'
    };
    
    return startScreenMap[templateFile] || 'start';
}

// Merge a template into the master template with ID prefixing
function mergeTemplateIntoMaster(masterTemplate, template, templateId) {
    Object.keys(template.screens).forEach(screenId => {
        const newScreenId = `${templateId}_${screenId}`;
        const screen = JSON.parse(JSON.stringify(template.screens[screenId])); // Deep copy
        
        // Update screen_id
        screen.screen_id = newScreenId;
        
        // Update go_to_screen_id
        if (screen.go_to_screen_id && screen.go_to_screen_id !== null && template.screens[screen.go_to_screen_id]) {
            screen.go_to_screen_id = `${templateId}_${screen.go_to_screen_id}`;
        }
        
        // Update dynamic_buttons references
        if (screen.dynamic_buttons) {
            if (screen.dynamic_buttons.go_to_screen_id && 
                screen.dynamic_buttons.go_to_screen_id !== null && 
                template.screens[screen.dynamic_buttons.go_to_screen_id]) {
                screen.dynamic_buttons.go_to_screen_id = `${templateId}_${screen.dynamic_buttons.go_to_screen_id}`;
            }
        }
        
        // Update button references
        if (screen.buttons) {
            screen.buttons = screen.buttons.map(button => {
                const newButton = { ...button };
                if (newButton.go_to_screen_id && 
                    newButton.go_to_screen_id !== null && 
                    template.screens[newButton.go_to_screen_id]) {
                    newButton.go_to_screen_id = `${templateId}_${newButton.go_to_screen_id}`;
                }
                return newButton;
            });
            
            // Add return navigation to end/success screens (but not end_flow screens)
            // end_flow screens are handled dynamically by showSmartQuickReplies
            if (isEndOrSuccessScreen(screen, screenId) && screenId !== 'end_flow') {
                // Only add if not already present
                const hasReturn = screen.buttons.some(btn => 
                    btn.go_to_screen_id === 'main_menu' || btn.label.includes('Main Menu')
                );
                
                if (!hasReturn) {
                    const categoryMenu = getCategoryMenuForTemplate(templateId);
                    if (categoryMenu && masterTemplateState.botConfig.menuStyle === 'category') {
                        screen.buttons.push({
                            "label": "Back to Services",
                            "go_to_screen_id": categoryMenu
                        });
                    }
                    screen.buttons.push({
                        "label": "Main Menu",
                        "go_to_screen_id": "main_menu"
                    });
                }
            }
        }
        
        // Update API call references
        if (screen.api_call) {
            if (screen.on_success && template.screens[screen.on_success]) {
                screen.on_success = `${templateId}_${screen.on_success}`;
            }
            if (screen.on_error && template.screens[screen.on_error]) {
                screen.on_error = `${templateId}_${screen.on_error}`;
            }
        }
        
        // Update conditional screen references
        if (screen.condition) {
            if (screen.go_to_screen_id && template.screens[screen.go_to_screen_id]) {
                screen.go_to_screen_id = `${templateId}_${screen.go_to_screen_id}`;
            }
            if (screen.on_false_go_to_screen_id && template.screens[screen.on_false_go_to_screen_id]) {
                screen.on_false_go_to_screen_id = `${templateId}_${screen.on_false_go_to_screen_id}`;
            }
        }
        
        masterTemplate.screens[newScreenId] = screen;
    });
}

// Check if screen is an end or success screen
function isEndOrSuccessScreen(screen, screenId) {
    return screen.type === 'END_SCREEN' || 
           screen.type === 'MESSAGE' &&
           (screenId.includes('success') || 
            screenId.includes('complete') ||
            screenId.includes('confirmation') ||
            screenId.includes('end') ||
            (screen.message_text && (
                screen.message_text.toLowerCase().includes('success') ||
                screen.message_text.toLowerCase().includes('complete') ||
                screen.message_text.toLowerCase().includes('confirmed')
            )));
}

// Get the category menu ID for a template
function getCategoryMenuForTemplate(templateId) {
    const category = getTemplateCategory(templateId + '.json');
    return category ? `${category}_menu` : null;
}

// Event handlers for category card selection
document.addEventListener('DOMContentLoaded', function() {
    // Category card click handlers
    document.addEventListener('click', function(e) {
        const categoryCard = e.target.closest('.category-card');
        if (categoryCard) {
            const checkbox = categoryCard.querySelector('.category-checkbox');
            if (checkbox && e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
                categoryCard.classList.toggle('selected', checkbox.checked);
            }
        }
    });
    
    // Category checkbox change handlers
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('category-checkbox')) {
            const card = e.target.closest('.category-card');
            if (card) {
                card.classList.toggle('selected', e.target.checked);
            }
        }
    });
});
