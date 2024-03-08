import type NodeCG from '@nodecg/types';
import { PlaybackReplicant, type DiscordChatReplicant,type DiscordVoiceReplicant, type SwitchReplicant } from '../types/schemas/index';
import { Router } from 'express';
import { isPlayback } from "./typeGuard"

module.exports = function (nodecg: NodeCG.ServerAPI) {
	//rep
	const vcRep = nodecg.Replicant<DiscordVoiceReplicant[]>("vc");
	const chatRep = nodecg.Replicant<DiscordChatReplicant>("chat");
    const switchRep = nodecg.Replicant<SwitchReplicant>("switch");
    const playbackRep = nodecg.Replicant<PlaybackReplicant>("playback", "nodecg-playback");
	const router: Router = nodecg.Router();
    //initialize
    vcRep.value = [];
    switchRep.value = "prepare"
	router.post("/chat", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        const { name } = req.body;
        const { avatar } = req.body;
        const { content } = req.body;
        if (typeof name === "string" && typeof avatar === "string" && typeof content === "string") {
            res.send('{result: "ok", error: null}');
            chatRep.value = { name, avatar, content };
        } else {
            res.status(400).send('{result: "ng", "error": "Invaild type"}');
        }
    });
    router.post("/vc", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
		const { members } = req.body;
        if (typeof members !== "object") {
            res.status(400).send('{result: "ng", "error": "Invaild type"}');
            return;
        }
        if(members.length === 0){
            res.send('{result: "ok", error: null}');
            return;
        }
        for(let i=0; i< members.length; i++){
            if (typeof members[i].name !== "string" || typeof members[i].speaking !== "boolean") {
                res.status(400).send('{result: "ng", "error": "Invaild type"}');
                return;
            }
        }
        res.send('{result: "ok", error: null}');
        vcRep.value = members;
    });
	nodecg.mount("/ddcc", router);

    //Standby→OnAir
    playbackRep.on("change",(newValue) => {
        if (!isPlayback(newValue)){
            return;
        }
        if (newValue.state !== 1){
            return;
        }
        if (switchRep.value === "standby"){
            switchRep.value = "onair"
        }
    })

};
