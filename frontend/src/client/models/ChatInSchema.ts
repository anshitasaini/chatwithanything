/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ChatMessageSchema } from './ChatMessageSchema';
import type { ChatSessionSchema } from './ChatSessionSchema';

export type ChatInSchema = {
    query: string;
    chat_session: ChatSessionSchema;
    history: Array<ChatMessageSchema>;
};

