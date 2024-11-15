export interface ISlackMessage {
    user: string;
    type: string;
    ts: string;
    client_msg_id: string;
    text: string;
    team: string;
    thread_ts: string;
    reply_count?: number;
    reply_users_count?: number;
    latest_reply?: string;
    reply_users?: string[];
    is_locked?: boolean;
    subscribed?: boolean;
    last_read?: string;
    blocks: Array<object>;
    reactions?: Array<object>;
    parent_user_id?: string;
}

export interface IChannelsRemoteConfig{
    name:string,
    id:string
}
