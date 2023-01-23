
import {Space} from './Model' 

export class MissingFieldError extends Error {}

export function validateAsSpaceEntry(arg: any){
    if(!(arg as Space).name){
        throw new MissingFieldError('Value for name required!')
    }
    if(!(arg as Space).location){
        throw new MissingFieldError('Value for location required!')
    }
    if(!(arg as Space).SpaceId){
        throw new MissingFieldError('Value for SpaceId required!')
    }
}