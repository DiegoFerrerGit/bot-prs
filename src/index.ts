
import * as functions from 'firebase-functions';
import * as dotenv from 'dotenv';
import { DELETE_EMOJI } from './constants/main.constants';
import * as admin from 'firebase-admin';
import * as firebaseRepository from './repository'

dotenv.config();

admin.initializeApp({
    credential: admin.credential.cert('./serviceAccountKey.json'),
});

const isLocal = process.env.FIREBASE_EMULATOR === 'true';

if (isLocal) {
    admin.initializeApp({
        credential: admin.credential.cert('./serviceAccountKey.json'),
    });
} else {
    admin.initializeApp();
}
    

export const handleReactionSlackChannel = functions.https.onRequest(async (req, res) => {

    const SLACK_USER_TOKEN = process.env.SLACK_USER_TOKEN || functions.config().slack.user_token;

    console.log("SLACK_USER_TOKEN",SLACK_USER_TOKEN)

    if(!SLACK_USER_TOKEN){
        firebaseRepository.getTokenInfo(req)
        return
    } 

    if (req.body.challenge) {
        res.status(200).send({ challenge: req.body.challenge });
        return
    }
    
    // This its only for local environement
    if (req.body.challenge) {
        res.status(200).send({ challenge: req.body.challenge });
        return
    }

    const { event } = req.body;
    const { channel, ts} = event.item

    const CHANNELS_ALLOWED = await firebaseRepository.getChannelByRemoteConfig()

    if (event.type === 'reaction_added' && 
        event.item.type === 'message'   && 
        CHANNELS_ALLOWED.includes(event.item.channel) && 
        event.reaction === DELETE_EMOJI
    ){
        // Get all the messages of thread
        try {
            const TsMessages = await firebaseRepository.getThreadMessages(channel,ts,SLACK_USER_TOKEN)
            await firebaseRepository.deleteAllMessage(channel,TsMessages,SLACK_USER_TOKEN)
        } catch (error) {
            console.log("error",error)
        }
        return
    }
});




