import { type } from "os"
import { source, types_points } from "./dtos"

export const KamrmaValueGeneration = (_type: any, _source: any) => {

    switch(_source) {


        case `${source.POST}`:
        case `${source.POLL}`: {

            if(types_points.CREATE == _type) {
                return 2
            }
            else if(types_points.UPVOTE == _type) {
                return 1
            }
            else if(types_points.DOWNVOTE == _type) {
                return -1
            }
            else if(types_points.VOTE == _type) {
                return 1
            }
            else 
            return 0
            
        }

        case `${source.INITIATIVE}` : {

            if(types_points.CREATE == _type) {
                return 10
            }
            else if(types_points.UPVOTE == _type) {
                return 1
            }
            else if(types_points.DOWNVOTE == _type) {
                return -1
            }
            else if(types_points.FOR == _type) {
                return 2
            }
            else if(types_points.AGAINST == _type) {
                return 2
            }
            else 
            return 0
            
        }   
        case `${source.MODERATOR}` : {
            
            if(types_points.JOIN == _type) {
                return 100
            }
            else if(types_points.MODERATE_POST == _type) {
                return 2
            }
            else 
            return 0
        }
          
    }
}