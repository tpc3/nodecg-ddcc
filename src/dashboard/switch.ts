import { SwitchReplicant } from '../types/schemas/';

const switchRep = nodecg.Replicant<SwitchReplicant>("switch");
const prepareBtn = document.getElementById("prepare");
const standByBtn = document.getElementById("standby");
const onAirBtn = document.getElementById("onair");

if( prepareBtn instanceof HTMLButtonElement
    && standByBtn instanceof HTMLButtonElement
    && onAirBtn instanceof HTMLButtonElement)
{
    NodeCG.waitForReplicants(switchRep).then(() =>{
        switchRep.on("change", newValue =>{
            if(typeof newValue === "string"){
                prepareBtn.disabled = false;
                standByBtn.disabled = false;
                onAirBtn.disabled = false;
                const disabledBtn = document.getElementById(newValue);
                if(disabledBtn instanceof HTMLButtonElement){
                    disabledBtn.disabled = true;
                }
            }
        });
    });
    standByBtn.onclick = () => {
        clickFunc(standByBtn);
    }
    prepareBtn.onclick = () => {
        clickFunc(prepareBtn);
    }
    onAirBtn.onclick = () => {
        clickFunc(onAirBtn);
    }
    
}

const clickFunc = (btn:HTMLButtonElement)=>{
    if(isSwitch(btn.id) && typeof switchRep.value !== "undefined"){
        switchRep.value = btn.id;
    }
}

function isSwitch(value: unknown): value is SwitchReplicant{
    if (typeof value !== "string"){
        return false;
    }
    if(value === "prepare" || "standby" || "onair"){
        return true
    }
    return false
}