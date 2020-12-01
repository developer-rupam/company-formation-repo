const DEVELOPMENTOBJ = {url : 'http://localhost:3000',api : 'https://smart-doc.co.uk:7000/v1',baseurl : '/',filePath : '/'};
const PRODUCTIONOBJ = {url : 'https://hostingfordevelopment.000webhostapp.com/1st-choice-formation/dev ',api : 'https://smart-doc.co.uk:7000/v1',baseurl : 'https://1st-choice-formation.smart-doc.co.uk/',filePath : 'https://smart-doc.co.uk/1st-choice-backend/'};

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


export const SITENAME = '1st Choice Formation';
export const SITENAMEALIAS = '1st_choice_formation';