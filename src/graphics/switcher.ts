import { SwitchReplicant } from "../types/schemas";
import anime from 'animejs/lib/anime.es.js';
//value
// milisecond
const opTime = 13 * 1000;
const duration = 1000

//var
let isAnim:boolean = false;

//Replicants
const switchRep = nodecg.Replicant<SwitchReplicant>("switch");

NodeCG.waitForReplicants(switchRep).then(()=>{
    const frameElm = document.getElementById("frame");
    const waitingElm = document.getElementById("waiting");
    const bgElm = document.getElementById("bg");
    const logoElm = document.getElementById("logo");

    switchRep.on("change",(newValue, oldValue)=>{
        if(waitingElm instanceof HTMLIFrameElement 
            && frameElm instanceof HTMLIFrameElement 
            && bgElm instanceof HTMLElement
            && logoElm instanceof HTMLIFrameElement
            && isAnim === false
        )
        if(newValue === "prepare" || newValue === "standby"){
            waitingElm.classList.remove("hidden");
            frameElm.classList.add("hidden");
            bgElm.classList.add("hidden");
        }
        else if(newValue === "onair" && oldValue !== "standby"){
            frameElm.classList.remove("hidden");
            waitingElm.classList.add("hidden");
            bgElm.classList.add("hidden");
            
        }
        else if(newValue === "onair" && oldValue === "standby"){
            let tl = anime.timeline({});
            tl.add({
                targets: bgElm,
                duration: duration,
                easing: "linear",
                opacity: [{ value: 0, duration: 0 }, { value: 1 }],
                begin: () => {
                    isAnim = true;
                    bgElm.classList.remove("hidden");
                },
                complete: () => {
                    logoElm.src = logoElm.src; //reload
                    logoElm.classList.remove("hidden");
                    waitingElm.classList.add("hidden");
                },
            });
            tl.add({
                duration: opTime - duration,
                complete: () => {
                    frameElm.classList.remove("hidden");
                    frameElm.src = frameElm.src;
                }
            });
            tl.add({
                duration: duration,
            });
            tl.add({
                targets: bgElm,
                delay: duration,
                easing: "linear",
                opacity: [{ value: 1, duration: 0 }, { value: 0 }],
                complete: () => {
                    logoElm.classList.add("hidden");
                    bgElm.classList.add("hidden");
                    isAnim = false;
                }
            })

        }
            
    })
})
