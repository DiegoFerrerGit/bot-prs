
import * as functions from 'firebase-functions';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { ISlackMessage } from './constants/main.interfaces';
import { CHANNELS_ALLOWED, DELETE_EMOJI, ENDPOINTS } from './constants/main.constants';
dotenv.config();

const SLACK_USER_TOKEN = process.env.SLACK_USER_TOKEN || functions.config().slack.user_token;
const CLIENT_ID = process.env.CLIENT_ID || functions.config().slack.client_id;
const CLIENT_SECRET = process.env.CLIENT_SECRET || functions.config().slack.client_secret;


export const handleReactionAdded = functions.https.onRequest(async (req, res) => {

    if(!SLACK_USER_TOKEN){
        getTokenInfo(req)
        return
    } 

    // este es coment
    
    // This its only for local environement
    if (req.body.challenge) {
        res.status(200).send({ challenge: req.body.challenge });
        return
    }

    const { event } = req.body;
    const { channel, ts} = event.item

    if (event.type === 'reaction_added' && 
        event.item.type === 'message'   && 
        Object.values(CHANNELS_ALLOWED).includes(event.item.channel) && 
        event.reaction === DELETE_EMOJI
    ){
        // Get all the messages of thread
        try {
            const TsMessages = await getThreadMessages(channel,ts)
            await deleteAllMessage(channel,TsMessages)
        } catch (error) {
            console.log("error",error)
        }
        return
    }
});

const getThreadMessages = async (channelId:string, threadTs:string): Promise<string[]> => {
    try {
        const response = await axios.get(ENDPOINTS.SLACK_URL_GET_ALL_MESSAGE, {
            headers: {
                Authorization: `Bearer ${SLACK_USER_TOKEN}`
            },
            params: {
                channel: channelId,
                ts: threadTs
            }
        });
        const messagesSlack = response.data.messages as ISlackMessage[]
        return messagesSlack.map(message => message.ts)
    } catch (error) {
        return []
    }

}

const deleteAllMessage= async (channelId:string, threadTs:string[]):Promise<void> => {
    try {
        // Eliminar cada mensaje en el hilo
        for (const message of threadTs) {
            await axios.post(ENDPOINTS.SLACK_URL_DELETE, {
                channel: channelId,
                ts: message
            }, {
                headers: {
                    Authorization: `Bearer ${SLACK_USER_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });
        }
        console.log("All messages were deleted.");
    } catch (error) {
        console.error("Error deleting message:", error);
    }
}

const getTokenInfo= async (req:functions.https.Request) => {
    console.log("Must obtain the user token and set in the secrets/environments variable")

    if(!SLACK_USER_TOKEN && req.query.code){
        const code = req.query.code as string;
        try {
            const response = await axios.post(ENDPOINTS.SLACK_URL_GET_TOKEN, null, {
                params: {
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    code,
                    redirect_uri: ENDPOINTS.FUNCTION_URL
                }
            });

            const data = response.data;
            if (data.ok) {
                const userToken = data.access_token;
                console.log("USER TOKEN:", userToken);
            }

            return;
        } catch (error) {
            return;
        }
    }
    const SCOPES = 'chat:write,reactions:read,channels:history'; // Permisos necesarios para tu app
    const AUTH_URL = `https://slack.com/oauth/v2/authorize?client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${encodeURIComponent(ENDPOINTS.FUNCTION_URL)}`;
    console.log("Go to the next custom URL for obtain the code", AUTH_URL)
}



