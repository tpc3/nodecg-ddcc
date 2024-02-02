import type { PlaybackReplicant, DiscordChatReplicant, DiscordVoiceReplicant } from '../types/schemas';
import anime from "animejs/lib/anime.es"


// You can access the NodeCG api anytime from the `window.nodecg` object
// Or just `nodecg` for short. Like this!:

//value
// milisecond
const duration = 1000;
const showTime = 10000;
const timeToLive = 20000;
// numbers of items
const deadline = 5;


//func
const clock = (e: HTMLElement) => {
	const chk = (i: number) => {
		if (i < 10) {
			return '0' + i;
		}

		return String(i);
	};

	const time = new Date();
	e.innerText = chk(time.getHours()) + ':' + chk(time.getMinutes()) + ':' + chk(time.getSeconds());
};


//elm
const clockElm = document.getElementById("clock");

//Replicant
const playbackRep = nodecg.Replicant<PlaybackReplicant>("playback","nodecg-playback");
const vcRep = nodecg.Replicant<DiscordVoiceReplicant[]>("vc");
const chatRep = nodecg.Replicant<DiscordChatReplicant>("chat");

//clock
if(clockElm != null){
	setInterval(()=>{
		clock(clockElm);
	}, 1000 )
}

//playback callback
NodeCG.waitForReplicants(playbackRep).then(()=>{
	//elm
	const currentBGMElm = document.getElementById("current-temp");
    const frameElm = document.getElementById("current");
    const trackTitleElm = document.getElementById("track-title");
    const trackArtistElm = document.getElementById("track-artist");
    const trackAlbumElm = document.getElementById("track-album");
	if (currentBGMElm != null && frameElm != null && trackArtistElm != null && trackTitleElm != null && trackAlbumElm != null){
		trackTitleElm.id = "";
    	trackArtistElm.id = "";
    	trackAlbumElm.id = "";
		playbackRep.on("change",(newVal) =>{
			if (newVal != null){
				console.log("received");
				if(frameElm.lastElementChild)
					frameElm.lastElementChild.classList.add("hidden");
				if (newVal.state === 1){
					trackTitleElm.innerText = newVal.title;
					if (newVal.artist !== "")
						trackArtistElm.innerText = `by ${newVal.artist}`;
					else trackArtistElm.innerText = "";
					if (newVal.album !== "")
						trackAlbumElm.innerText = `from ${newVal.album}`;
					else trackAlbumElm.innerText = "";
					let tmpElm: HTMLElement = <HTMLElement>currentBGMElm.cloneNode(true);
					tmpElm.classList.remove("hidden");
					tmpElm.id = "current-anime"
					let tl = anime.timeline({
						easing: 'easeOutExpo',
						duration: 750,
					});
					tl.add({
						targets:tmpElm,
						translateX: [{ value: 400, duration: 0 }, { value: 0 }],
						duration,
					});
					tl.add({
						targets:tmpElm,
						translateX: 400,
						duration,
						delay: showTime,
						complete: () =>{
							if(frameElm.firstElementChild)
								frameElm.removeChild(frameElm.firstElementChild);
						}
					});
					frameElm.appendChild(tmpElm);
				}
			}
		});
	} 
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
		newElm.classList.remove("hidden");
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
			newElm.classList.remove("hidden");
			newElm.firstElementChild.src = member.avatar;
			newElm.lastElementChild.innerText = member.name;
			if(member.speaking){
				newElm.firstElementChild.classList.add("outline","outline-emerald-500", "outline-4");
			}
			vcElm.appendChild(newElm);

		})
	})

})
