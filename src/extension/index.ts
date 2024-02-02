import type NodeCG from '@nodecg/types';
import type { DiscordChatReplicant,DiscordVoiceReplicant } from '../types/schemas';
import { Router } from 'express';

module.exports = function (nodecg: NodeCG.ServerAPI) {
	//rep
	const vcRep = nodecg.Replicant<DiscordVoiceReplicant[]>("vc");
	const chatRep = nodecg.Replicant<DiscordChatReplicant>("chat");
	const router: Router = nodecg.Router();
	router.post("/chat", (req, res) => {
        const { name } = req.body;
        const { avatar } = req.body;
        const { content } = req.body;
        if (typeof name === "string" && typeof avatar === "string" && typeof content === "string") {
            res.send('{result: "ok", error: null}');
            chatRep.value = { name, avatar, content };
        } else {
            res.send('{result: "ng", "error": "Invaild type"}');
        }
    });
    router.post("/vc", (req, res) => {
		const { members } = req.body;
        if (typeof members === "object") {
            res.send('{result: "ok", error: null}');
            vcRep.value = members;
        } else {
            res.send('{result: "ng", "error": "Invaild type"}');
        }
    });
	nodecg.mount("/ddcc", router);

};
