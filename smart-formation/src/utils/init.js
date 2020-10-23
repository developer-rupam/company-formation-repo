const DEVELOPMENTOBJ = {url : 'http://localhost:3001',api : 'http://smart-doc.co.uk:7001/v1',baseurl : '/',filePath : '/'};
const PRODUCTIONOBJ = {url : 'https://hostingfordevelopment.000webhostapp.com/smart-formation/dev ',api : 'http://smart-doc.co.uk:7001/v1',baseurl : 'http://smart-formation.smart-doc.co.uk/',filePath : 'http://smart-doc.co.uk/smart-choice-backend/'};

export const mode = "prod" //dev : development; prod : production

if(mode == 'dev'){
    var url = DEVELOPMENTOBJ.url;
    var api = DEVELOPMENTOBJ.api;
    var baseurl = DEVELOPMENTOBJ.baseurl;
    var filePath = DEVELOPMENTOBJ.filePath
}else{
    var url = PRODUCTIONOBJ.url;
    var api = PRODUCTIONOBJ.api;
    var baseurl = PRODUCTIONOBJ.baseurl;
    var filePath = PRODUCTIONOBJ.filePath
}

export const ADDR = url;
export const WEBSERVICE = api;
export const BASEURL = baseurl;
export const FILEPATH = filePath;

export const SITENAME = 'Smart Formation';
export const SITENAMEALIAS = 'smart_formation';