import * as StringUtil from "./stringUtil";
import { COPYFILE_FICLONE_FORCE } from "constants";

export function updateFeed(feed){    
    if(feed.ui_tag && feed.ui_tag.includes("not_free")){
        feed.extensions.free = false;
    }
    if(feed.entry){
        feed.entry = feed.entry.map(entry => updateFeed(entry));
    }
   
    return feed;

}



