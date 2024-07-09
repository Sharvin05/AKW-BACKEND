

export function sendResponse (res,response){
    const jsonValue = JSON.stringify(response)
    res.end(jsonValue)
}


