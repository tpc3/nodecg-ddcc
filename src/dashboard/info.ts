import { InfoReplicant } from '../types/schemas/';
import { isInfo } from '../graphics/typeGuard'

// You can access the NodeCG api anytime from the `window.nodecg` object
// Or just `nodecg` for short. Like this!:

const infoRep = nodecg.Replicant<InfoReplicant>("info");
const seasonElm = document.getElementById("season");
const epElm = document.getElementById("episode");
const personalityElm = document.getElementById("personality");
const guestElm = document.getElementById("guest");
const dateTimeElm = document.getElementById("startTime");
const applyBtn = document.getElementById("apply")

if( seasonElm instanceof HTMLInputElement 
    && epElm instanceof HTMLInputElement 
    && personalityElm instanceof HTMLInputElement 
    && guestElm instanceof HTMLInputElement 
    && dateTimeElm instanceof HTMLInputElement
    && applyBtn instanceof HTMLButtonElement)
{
    NodeCG.waitForReplicants(infoRep).then(()=>{
        infoRep.on("change", newValue => {
            if(isInfo(newValue)){
                seasonElm.valueAsNumber=newValue.season;
                epElm.valueAsNumber=newValue.ep;
                personalityElm.value=newValue.personality;
                guestElm.value=newValue.guest;
                dateTimeElm.value=newValue.start;

            }
            else{
                const tempInfo: InfoReplicant={
                    season: 1,
                    ep: 1,
                    personality: "",
                    guest: "",
                    start: new Date().toISOString().replace("Z",""),
                };
                infoRep.value = tempInfo;
            }
        });
        applyBtn.onclick = () => {
            const tempInfo: InfoReplicant={
                season: seasonElm.valueAsNumber,
                ep: epElm.valueAsNumber,
                personality: personalityElm.value,
                guest: guestElm.value,
                start: dateTimeElm.value,
            };
            infoRep.value = tempInfo;
        }

    })
}
