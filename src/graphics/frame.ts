import type { PlaybackReplicant, DiscordChatReplicant, DiscordVoiceReplicant, InfoReplicant } from '../types/schemas';
import anime from "animejs/lib/anime.es"
import { isInfo, isPlayback } from './typeGuard';
import { clock } from './common';


// You can access the NodeCG api anytime from the `window.nodecg` object
// Or just `nodecg` for short. Like this!:

//value
// milisecond
const duration = 1000;
const timeToLive = 20000;
// numbers of items
const deadline = 5;

//traslateY
const textHeight = 20;


//func


//elm
const clockElm = document.getElementById("clock");

//Replicant
const playbackRep = nodecg.Replicant<PlaybackReplicant>("playback","nodecg-playback");
const vcRep = nodecg.Replicant<DiscordVoiceReplicant[]>("vc");
const chatRep = nodecg.Replicant<DiscordChatReplicant>("chat");
const infoRep = nodecg.Replicant<InfoReplicant>("info");

//clock
if(clockElm != null){
	setInterval(()=>{
		clock(clockElm);
	}, 1000 )
}

//info
NodeCG.waitForReplicants(infoRep).then(()=>{
	const seasonElm = document.getElementById("season");
	const epElm = document.getElementById("episode");
	const personalityElm = document.getElementById("personality");
	const guestElm = document.getElementById("guest");

	infoRep.on("change", newValue => {
		if (!isInfo(newValue)){
			return;
		}
		if (seasonElm != null){
			seasonElm.innerText="S" + newValue.season.toString();
		}
		if(epElm != null){
			epElm.innerText= "Ep" + newValue.ep.toString();
		}
		if(personalityElm != null){
			personalityElm.innerText= newValue.personality;
		}
		if(guestElm != null){
			guestElm.innerText= newValue.guest;
		}
	});
})


//playback callback
NodeCG.waitForReplicants(playbackRep).then(()=>{
	setTimeout(()=>{
		//elm
		const playbackElm = document.getElementById("playback");
		const textElm = document.getElementById("playback-text");
		playbackRep.on("change", (newValue, oldValue) => {
			let tl = anime.timeline({});
			if(!isPlayback(newValue)){
				return;
			}
			if(playbackElm == null || textElm == null){
				return;
			}
			if(isPlayback(oldValue)){
				if(oldValue.state === 1){
					tl.add({
						targets: playbackElm,
						duration: duration/2,
						easing: "easeInBack",
						translateY: 100,
						complete: ()=>{
							playbackElm.classList.add("hidden");
						}
					});//tl.add(1)
				}
			}
			if(newValue.state !== 1){
				return;
			}
			tl.add({
				targets: textElm,
				translateY: textHeight,
				duration: 1,
				complete: ()=>{
					const trackElm = document.getElementById("track");
					const artistElm = document.getElementById("artist");
					if( trackElm instanceof HTMLElement
						&& artistElm instanceof HTMLElement )
					{
						trackElm.innerText = newValue.title;
						if(typeof newValue.artist === "string" && newValue.artist !== ""){
							if(typeof newValue.album === "string" && newValue.album !== ""){
								artistElm.innerText = `${newValue.artist} - ${newValue.album}`
							}
							else{
								artistElm.innerText=newValue.artist;
							}
						}else{
							artistElm.innerText="Unknown"
						}
						playbackElm.classList.remove("hidden");
					}	
				}
			});//tl.add(2)
			tl.add({
				targets: playbackElm,
				duration: duration /2,
				easing: "easeOutBack",
				translateY: [100,0],
			});//tl.add(3)
			tl.add({
				targets: textElm,
				easing: "easeOutExpo",
				translateY: -textHeight,
				duration: duration,
				delay: 4*duration,
				complete: ()=>{
				}
			})//tl.add(4)
		})
	}, duration * 2)
	
	
})

//chat callback
NodeCG.waitForReplicants(chatRep).then(()=>{
	const chatElm = document.getElementById("chat");
	const templateElm =document.getElementById("chat-template");
	if(chatElm == null || templateElm == null ){
		return;
	}
	
	chatRep.on("change", (newVal) => {
		if(newVal == null){
			return
		}
		if(!(templateElm.firstElementChild instanceof HTMLImageElement) || templateElm.lastElementChild == null || templateElm.childElementCount !== 2){
			return;
		}
		if( templateElm.lastElementChild.childElementCount !== 2 || !(templateElm.lastElementChild.firstElementChild instanceof HTMLElement) || !(templateElm.lastElementChild.lastElementChild instanceof HTMLElement)){
			return;
		}

		templateElm.lastElementChild.firstElementChild.innerText = newVal.name;
		templateElm.lastElementChild.lastElementChild.innerText = newVal.content;
		if( newVal.avatar != null || newVal.avatar !== ""){
            templateElm.firstElementChild.src = newVal.avatar;
        }

		let newElm = <HTMLElement>templateElm.cloneNode(true);
		newElm.id = "";
		let tl = anime.timeline({
            easing: 'easeOutExpo',
            duration,
        });
        tl.add({
            targets: newElm,
            opacity: [{ value: 0, duration: 0 }, { value: 1 }],
            translateX: [{ value: 300, duration: 0 }, { value: 0 }],
            duration,
        });
        tl.add({
            targets: newElm,
            opacity: 0,
            delay: timeToLive,
            duration,
        })
		chatElm.appendChild(newElm);
		if (chatElm.childNodes.length > deadline && chatElm.firstElementChild instanceof HTMLElement) {
            chatElm.removeChild(chatElm.firstElementChild)
        }
    });
})

//VC callback
NodeCG.waitForReplicants(vcRep).then(()=>{
	const vcElm = document.getElementById("vc");
	const templateElm = document.getElementById("vc-template");
	if(vcElm == null || templateElm == null ){
		return;
	}
	vcRep.on("change" , (newVal) =>{
		let child = vcElm.lastElementChild;
        while (child instanceof HTMLElement) {
            vcElm.removeChild(child);
            child = vcElm.lastElementChild;
        }
		if(newVal == null || newVal.length === 0){
			return;
		}
		newVal.forEach((member) =>{
			let newElm = <HTMLElement>templateElm.cloneNode(true)
			if(!(newElm.firstElementChild instanceof HTMLImageElement && newElm.lastElementChild instanceof HTMLElement && newElm.childElementCount === 2) ){
				return;
			}
			newElm.id = "";
			if(member.avatar != null && member.avatar !== ""){
				newElm.firstElementChild.src = member.avatar;
			}
			newElm.lastElementChild.innerText = member.name;
			if(member.speaking){
				newElm.firstElementChild.classList.add("outline","outline-emerald-500", "outline-4");
			}
			vcElm.appendChild(newElm);

		})
	})

})
