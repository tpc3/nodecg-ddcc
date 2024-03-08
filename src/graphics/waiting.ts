import { clock } from "./common";
import { isInfo } from "./typeGuard";
import { InfoReplicant } from "../types/schemas"

//value
//millisecond
const timeOfUpdateState=30000
//func

//Elm
const clockElm = document.getElementById("clock")

//Replicant
const infoRep = nodecg.Replicant<InfoReplicant>("info");

//clock
if(clockElm != null){
	setInterval(()=>{
		clock(clockElm);
	}, 1000 );
}

NodeCG.waitForReplicants(infoRep).then(()=>{
    const stateElm=document.getElementById("state");
    const dateElm=document.getElementById("date");
    const timeElm=document.getElementById("time");
    if(stateElm != null){
        if(isInfo(infoRep.value)){
            const startTime = new Date(infoRep.value.start);
            const currentTime = new Date();
            if( currentTime > startTime){
                const delay = currentTime.getHours() * 60 + currentTime.getMinutes() - startTime.getHours() * 60 - startTime.getMinutes();
                if( delay >= 5){
                    stateElm.innerText=`ただいま、約${delay}分遅れとなっています。`;
                    stateElm.classList.add("text-red-800");
                }
            }
        }
        setInterval(()=>{
            if(isInfo(infoRep.value)){
                const startTime = new Date(infoRep.value.start);
                const currentTime = new Date();
                if( currentTime > startTime){
                    const delay = currentTime.getHours() * 60 + currentTime.getMinutes() - startTime.getHours() * 60 - startTime.getMinutes();
                    if( delay >= 5){
                        stateElm.innerText=`ただいま、約${delay}分遅れとなっています。`;
                        stateElm.classList.add("text-red-800");
                    }
                    else{
                        stateElm.innerText="開始までしばらくお待ちください";
                        stateElm.classList.remove("text-red-800");
                    }
                }
            }
        }, timeOfUpdateState)
    }

    infoRep.on("change",newValue=>{
        if(!isInfo(newValue)){
            return;
        }
        const startTime = new Date(newValue.start)
        if(dateElm != null){
            dateElm.innerText = startTime.toLocaleDateString("ja-JP", {
                weekday: "short",
                year: "numeric",
                month:"2-digit",
                day:"2-digit"
            })
        }
        if(timeElm != null){
            timeElm.innerText = startTime.toLocaleTimeString("ja-JP", {
                hour:"2-digit",
                minute:"2-digit"
            })
        }
    })
    
})