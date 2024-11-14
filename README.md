# Guide and usefull things

## Install required
* npm i 
* npm i ngrok (for local environment)

# Local environment
* firebase emulators:start **This if for emulate firebase functions**  
* ngrok http 5001
* Put in event subscription in slack the url by grok to receive the event reaction
* - for instance https://68d5-179-37-145-41.ngrok-free.app/prueba-2089f/us-central1/handleReactionAdded

# TOKEN SYSTEM
### This bot works with SLACK USER TOKEN, if we dont have the token o is expired we need to get new one
* the logs give us a url to obtain a "code" in order to obtain later the user token
* when we did login with the previus URL, the log give us the user token
* we must set in firebase the environment variables or secrets. and if we want, in our local en .env file
* - **firebase functions:config:set slack.user_token="NEW USER TOKEN"**
* - We can see the all config in firebase with: **firebase functions:config:get**
* - We can delete a config in firebase with: **firebase functions:config:unset keyName**