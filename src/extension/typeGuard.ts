import type { InfoReplicant, PlaybackReplicant } from "../types/schemas"

export function isInfo(value: unknown): value is InfoReplicant{
    if(typeof value !== "object" || value == null ) {
        return false;
    }
    const { season, ep, personality, guest, start } = value as Record<keyof InfoReplicant, unknown>;
    if(typeof season !== "number" || season == null){
        return false;
    }
    if(typeof ep !== "number"|| ep == null){
        return false;
    }
    if(typeof personality !== "string" || personality == null){
        return false;
    }
    if(typeof guest !== "string" || guest == null){
        return false;
    }
    if(typeof start !== "string" || start == null){
        return false;
    }
    return true;
}

export function isPlayback(value: unknown): value is PlaybackReplicant{
    if(typeof value !== "object" || value == null ) {
        return false;
    }
    const { state, title } =  value as Record<keyof PlaybackReplicant, unknown>;
    if(typeof title !== "string" || title == null){
        return false;
    }
    if(typeof state !== "number"){
        return false;
    }
    if(state === 0 || 1 || 2){
        return true;
    }
    return false;
}