import * as admin from 'firebase-admin';
import { IChannelsRemoteConfig, ISlackMessage } from './constants/main.interfaces';
import axios from 'axios';
import { ENDPOINTS } from './constants/main.constants';
import * as functions from 'firebase-functions';
import * as dotenv from 'dotenv';

dotenv.config();

export const getTokenInfo= async (req:functions.https.Request) => {

    const SLACK_USER_TOKEN = process.env.SLACK_USER_TOKEN || functions.config().slack.user_token;

    if(SLACK_USER_TOKEN){
        return SLACK_USER_TOKEN
    }

    console.log("Must obtain the user token and set in the secrets/environments variable")
    const CLIENT_ID = process.env.CLIENT_ID || functions.config().slack.client_id;
    const CLIENT_SECRET = process.env.CLIENT_SECRET || functions.config().slack.client_secret;


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

export const getChannelByRemoteConfig = async (): Promise<string[]> => {
    try {
        const remoteConfig = await admin.remoteConfig().getTemplate();
        const slackChannelIdsConfig = remoteConfig.parameters["slackChannelIds"]?.defaultValue as any;
        const channels:IChannelsRemoteConfig[] = JSON.parse(slackChannelIdsConfig["value"])
        return channels.map(channel => channel.id)
  
    } catch (error) {
        return []
    }
}

export const getThreadMessages = async (channelId:string, threadTs:string,SLACK_USER_TOKEN:string): Promise<string[]> => {
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

export const deleteAllMessage= async (channelId:string, threadTs:string[],SLACK_USER_TOKEN:string):Promise<void> => {
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

