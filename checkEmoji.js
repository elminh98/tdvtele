
// This script checks who has reached a certain emoji on a Telegram channel

// Get the channel ID
let channelID = "SuonBiChaTrading";

// Get the emoji to check
let emojiToCheck = "💩";

// Fetch the messages in the channel
fetch(`https://api.telegram.org/bot5987728677:AAEcufHcQbzirBJW5aWHGN6zUZK4Wz4GQKA/getUpdates?chat_id=SuonBiChaTrading`)
  .then(response => response.json())
  .then(data => {
    // Get the messages
    let messages = data.result;

    // Create an array of usernames
    let usernames = [];

    // Iterate through each message
    messages.forEach(message => {
      // Get the text of each message
      let messageText = message.message.text;

      // Check if the emoji is in the message
      if (messageText.includes(emojiToCheck)) {
        // Push the username of the user who sent the message
        usernames.push(message.message.from.username);
      }
    });
});

    // Log the usernames