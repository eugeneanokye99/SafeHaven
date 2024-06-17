// insertNodes.js

const mongoose = require('mongoose');
const Node = require('./models/Node'); // Adjust the path if needed

const nodes = [
  {
    id: 'root',
    question: 'What do you need help with?',
    options: [
      {
        id: 'call_filtering',
        text: 'Call Filtering',
        next_node: 'call_filtering_node'
      },
      {
        id: 'fall_detection',
        text: 'Fall Detection',
        next_node: 'fall_detection_node'
      }
    ]
  },
  {
    id: 'call_filtering_node',
    question: 'What specifically do you need help with in call filtering?',
    options: [
      {
        id: 'blocking_calls',
        text: 'Blocking calls',
        next_node: 'blocking_calls_node'
      },
      {
        id: 'identifying_scam_calls',
        text: 'Identifying scam calls',
        response: 'To identify scam calls, look for these signs: ... (additional guidance).'
      }
    ]
  },
  {
    id: 'blocking_calls_node',
    question: 'Do you want to know how to block calls or how to unblock calls?',
    options: [
      {
        id: 'how_to_block_calls',
        text: 'How to block calls',
        response: 'To block unwanted calls, go to Settings > Call Filtering and add the numbers you want to block.'
      },
      {
        id: 'how_to_unblock_calls',
        text: 'How to unblock calls',
        response: 'To unblock calls, go to Settings > Call Filtering and remove the numbers from your blocked list.'
      }
    ]
  },
  {
    id: 'fall_detection_node',
    question: 'What specifically do you need help with in fall detection?',
    options: [
      {
        id: 'fall_detection_setup',
        text: 'Setting up fall detection',
        response: 'To set up fall detection, go to Settings > Fall Detection and follow the instructions.'
      },
      {
        id: 'fall_detection_sensitivity',
        text: 'Adjusting fall detection sensitivity',
        response: 'To adjust the sensitivity of fall detection, go to Settings > Fall Detection > Sensitivity.'
      }
    ]
  },
  // Add more nodes as needed
];

const additionalNodes = [
  {
    id: 'location_tracking_node',
    question: 'What specifically do you need help with in location tracking?',
    options: [
      {
        id: 'setup_location_tracking',
        text: 'Setting up location tracking',
        response: 'To set up location tracking, go to Settings > Location Tracking and enable the feature.'
      },
      {
        id: 'accuracy_location_tracking',
        text: 'Improving location tracking accuracy',
        response: 'To improve location tracking accuracy, ensure that your GPS is enabled and you have a clear view of the sky.'
      }
    ]
  },
  {
    id: 'login_help_node',
    question: 'What specifically do you need help with in logging in?',
    options: [
      {
        id: 'forgot_password',
        text: 'Forgot Password',
        response: 'To reset your password, click on "Forgot Password" on the login screen and follow the instructions.'
      },
      {
        id: 'account_locked',
        text: 'Account Locked',
        response: 'If your account is locked, contact support to unlock your account.'
      }
    ]
  },
  {
    id: 'linking_with_someone_node',
    question: 'What specifically do you need help with in linking with someone?',
    options: [
      {
        id: 'send_link_request',
        text: 'Sending a link request',
        response: 'To send a link request, go to the Contacts section, find the person you want to link with, and click "Send Link Request".'
      },
      {
        id: 'accept_link_request',
        text: 'Accepting a link request',
        response: 'To accept a link request, go to the Requests section and click "Accept" next to the request you want to accept.'
      }
    ]
  }
];

// Merge additional nodes with existing nodes
const allNodes = nodes.concat(additionalNodes);

mongoose.connect('mongodb+srv://yawanokye99:ssJSg8TIQwHg0mhn@cluster0.nivths8.mongodb.net/SafeHaven', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await Node.deleteMany(); // Clear existing nodes
    await Node.insertMany(allNodes);
    console.log('Nodes inserted successfully');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error inserting nodes:', err);
  });
