const DEVELOPMENTOBJ = {url : 'http://localhost:3001',api : 'http://127.0.0.1:6000/v1'};
const PRODUCTIONOBJ = {url : '',api : ''};

export const mode = "dev" //dev : development; prod : production

if(mode == 'dev'){
    var url = DEVELOPMENTOBJ.url;
    var api = DEVELOPMENTOBJ.api;
}else{
    var url = PRODUCTIONOBJ.url;
    var api = PRODUCTIONOBJ.api;
}

export const ADDR = url;
export const WEBSERVICE = api;

export const SITENAME = 'Smart Formation';
export const SITENAMEALIAS = 'smart_formation';