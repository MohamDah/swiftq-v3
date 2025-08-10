const admin = require('firebase-admin');

// Global flag to track initialization attempts
let initializationAttempted = false;
let initializationError = null;

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  // Only try to initialize once
  if (initializationAttempted) {
    if (initializationError) {
      console.error('Using previously failed initialization:', initializationError);
      throw initializationError;
    }
    return;
  }

  initializationAttempted = true;
  
  try {
    // Check if already initialized
    if (admin.apps.length > 0) {
      console.log('Firebase Admin SDK already initialized');
      return;
    }

    let serviceAccount;
    
    // Try to get service account from environment variables
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      console.log('Using service account from environment variable');
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      } catch (parseError) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT:', parseError);
        throw new Error('Invalid service account JSON in environment variable');
      }
      
      // Fix the private key format if needed
      if (serviceAccount.private_key && typeof serviceAccount.private_key === 'string') {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
    } else {
      // For local dev: use local file
      // console.log('Trying to load service account from local file');
      // try {
      //   serviceAccount = require('../../service-account.json');
      //   console.log('Successfully loaded service account from file');
      // } catch (fileError) {
      //   console.error('Failed to load service-account.json:', fileError);
      //   throw new Error('Could not load service account from file. Make sure service-account.json exists in the project root');
      // }
    }

    // Validate service account
    if (!serviceAccount || !serviceAccount.project_id || !serviceAccount.private_key) {
      const error = new Error('Invalid service account configuration');
      console.error(error, {
        hasServiceAccount: !!serviceAccount,
        hasProjectId: !!serviceAccount?.project_id,
        hasPrivateKey: !!serviceAccount?.private_key
      });
      throw error;
    }

    // Initialize the app
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    console.log('Firebase Admin SDK initialized successfully for project:', serviceAccount.project_id);
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    initializationError = error;
    throw error;
  }
}

exports.handler = async function(event, context) {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }
  
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }
  
  try {
    // Initialize Firebase Admin
    initializeFirebaseAdmin();
    
    // Parse the request body
    const data = JSON.parse(event.body);
    const { token, title, body, queueId, customerId, queueCode } = data;
    
    console.log('Processing notification request:', { title, queueId, customerId, queueCode });
    
    // Validate required fields
    if (!token) {
      return { 
        statusCode: 400, 
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'FCM token is required' }) 
      };
    }
    
    // Prepare the message
    const message = {
      notification: {
        title: title || 'SwiftQ Notification',
        body: body || "It's your turn!",
      },
      data: {
        queueId: queueId || '',
        queueCode: queueCode || '',
        customerId: customerId || '',
        timestamp: Date.now().toString(),
        click_action: `https://swiftq-v2.netlify.app/queue/${queueCode}/customer/${customerId}`
      },
      token: token
    };
    
    // Send the notification
    console.log('Sending FCM message with token:', token.substring(0, 10) + '...');
    const response = await admin.messaging().send(message);
    console.log('FCM message sent successfully:', response);
    
    // Return success response
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        success: true, 
        messageId: response 
      })
    };
  } catch (error) {
    console.error('Error in notification function:', error);
    
    // Return error response
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        success: false, 
        error: error.message,
        errorCode: error.code || 'unknown',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};