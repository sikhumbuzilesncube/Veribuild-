// ========================================
// PAYNOW CONFIGURATION
// ========================================

const PAYNOW_CONFIG = {
    // ==== PRODUCTION CREDENTIALS ====
    // Replace these with your actual Paynow credentials
    integrationId: 'YOUR_INTEGRATION_ID_HERE',
    integrationKey: 'YOUR_INTEGRATION_KEY_HERE',
    
    // ==== URLs ====
    // Return URL - where users go after payment
    returnUrl: 'https://veribuild.vercel.app/payment-success.html',
    
    // Result URL - where Paynow sends confirmation (Edge Function)
    resultUrl: 'https://gfggbagrkdacuepqnkdg.supabase.co/functions/v1/paynow-webhook',
    
    // ==== PAYMENT ENDPOINTS ====
    // Paynow API endpoint
    apiUrl: 'https://www.paynow.co.zw/interface/initiatetransaction',
    
    // ==== CURRENCY ====
    // Default currency
    currency: 'USD',
    
    // Supported currencies
    supportedCurrencies: ['USD', 'ZWG']
};

// ========================================
// PAYNOW HELPER FUNCTIONS
// ========================================

/**
 * Generate a unique reference for each transaction
 */
function generateReference() {
    const prefix = 'VERI';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${timestamp}${random}`;
}

/**
 * Create a Paynow payment request
 */
async function createPaynowPayment(orderData) {
    const {
        amount,
        currency = 'USD',
        email = '',
        phone = '',
        description = 'VeriBuild Payment',
        reference = generateReference()
    } = orderData;

    // Build the payload
    const payload = new URLSearchParams();
    payload.append('id', PAYNOW_CONFIG.integrationId);
    payload.append('key', PAYNOW_CONFIG.integrationKey);
    payload.append('amount', amount);
    payload.append('currency', currency);
    payload.append('reference', reference);
    payload.append('email', email);
    payload.append('phone', phone);
    payload.append('description', description);
    payload.append('returnurl', PAYNOW_CONFIG.returnUrl);
    payload.append('resulturl', PAYNOW_CONFIG.resultUrl);

    try {
        const response = await fetch(PAYNOW_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: payload
        });

        const text = await response.text();
        
        // Parse Paynow response
        const params = new URLSearchParams(text);
        const status = params.get('status');
        const redirectUrl = params.get('redirecturl');
        const pollUrl = params.get('pollurl');
        
        if (status !== 'Ok') {
            const error = params.get('error') || 'Unknown error';
            throw new Error(`Paynow error: ${error}`);
        }

        return {
            success: true,
            redirectUrl: redirectUrl,
            pollUrl: pollUrl,
            reference: reference,
            status: status
        };
    } catch (error) {
        console.error('Paynow payment error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Verify payment status (polling)
 */
async function verifyPayment(pollUrl) {
    try {
        const response = await fetch(pollUrl);
        const text = await response.text();
        const params = new URLSearchParams(text);
        const status = params.get('status');
        const amount = params.get('amount');
        const reference = params.get('reference');
        const transactionId = params.get('paynowreference');
        
        return {
            status: status, // 'Paid', 'Pending', 'Cancelled'
            amount: amount,
            reference: reference,
            transactionId: transactionId,
            isPaid: status === 'Paid'
        };
    } catch (error) {
        console.error('Payment verification error:', error);
        return {
            status: 'Error',
            error: error.message,
            isPaid: false
        };
    }
}

// ========================================
// EXPORT
// ========================================
// For use in browser
window.PAYNOW_CONFIG = PAYNOW_CONFIG;
window.createPaynowPayment = createPaynowPayment;
window.verifyPayment = verifyPayment;
window.generateReference = generateReference;
