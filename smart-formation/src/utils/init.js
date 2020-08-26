const DEVELOPMENTOBJ = {url : 'http://localhost:3001',api : 'http://127.0.0.1:6000/v1',baseurl : '/'};
const PRODUCTIONOBJ = {url : 'https://hostingfordevelopment.000webhostapp.com/smart-formation/dev ',api : 'http://127.0.0.1:6000/v1',baseurl : 'https://hostingfordevelopment.000webhostapp.com/smart-formation/dev/'};

export const mode = "prod" //dev : development; prod : production

if(mode == 'dev'){
    var url = DEVELOPMENTOBJ.url;
    var api = DEVELOPMENTOBJ.api;
    var baseurl = DEVELOPMENTOBJ.baseurl
}else{
    var url = PRODUCTIONOBJ.url;
    var api = PRODUCTIONOBJ.api;
    var baseurl = DEVELOPMENTOBJ.baseurl
}

export const ADDR = url;
export const WEBSERVICE = api;
export const BASEURL = baseurl;

export const SITENAME = 'Smart Formation';
export const SITENAMEALIAS = 'smart_formation';