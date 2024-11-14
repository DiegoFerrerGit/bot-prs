export const CHANNELS_ALLOWED = {
    USER_APPLICATION_BACKEND_PRS: 'C080L9DQL11'
}

export const DELETE_EMOJI = 'x';

export const ENDPOINTS = {
    SLACK_URL_GET_ALL_MESSAGE : 'https://slack.com/api/conversations.replies',
    SLACK_URL_DELETE : 'https://slack.com/api/chat.delete',
    SLACK_URL_GET_TOKEN : 'https://slack.com/api/oauth.v2.access',
    FUNCTION_URL : 'https://TUNGOURL.ngrok.io/TU_PROYECTO/us-central1/slackOAuthCallback'
}




// Construye la URL de autorización de Slack
// const CLIENT_ID = '274725393283.8020420743506'; // Tu Client ID de Slack
// const CLIENT_SECRET = 'c99bc911fa08d0ade86546c7d054ee48'; // Tu Client Secret de Slack
//const REDIRECT_URI = 'https://5066-179-37-145-41.ngrok-free.app/prueba-2089f/us-central1/handleReactionAdded';
//const SCOPES = 'chat:write,reactions:read,channels:history';
// const AUTH_URL = `https://slack.com/oauth/v2/authorize?client_id=${CLIENT_ID}&user_scope=${SCOPES}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
