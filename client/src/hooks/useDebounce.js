export const useDebounce = (callback, wait) => {
    let timer = null;

    return (...args)=>{
        if(timer) clearTimeout(timer);
        
        timer = setTimeout(()=>{
            callback(...args);
        }, wait)
    }
}


