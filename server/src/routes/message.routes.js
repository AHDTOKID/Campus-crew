import { Router } from 'express';
import * as c from '../controllers/message.controller.js';

const r = Router();
r.get('/', c.listConversations);
r.post('/', c.startConversation);
r.get('/:id', c.getMessages);
r.post('/:id', c.sendMessage);
export default r;