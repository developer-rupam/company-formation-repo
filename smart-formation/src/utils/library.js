import { SITENAMEALIAS } from './init'
import Swal from 'sweetalert2'
import {addUserFavouriteDirectory,removeUserFavouriteDirectory} from './service'


/*** function defination for storing current route ***/
export const storeCurrentRoute = (route) =>{
    localStorage.setItem(SITENAMEALIAS + '_current_page',route);
}

/*** function defination for confirm message  ***/
export const showConfirm = (title,text,type,callback) => {
    Swal.fire({
        title: title,
        text: text,
        icon: type,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.value) {
            callback();
        }
      })
}

/*** function defination for showing toast ***/
export const showToast = (type,message) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false,
    onOpen: (toast) => {
      //toast.addEventListener('mouseenter', Swal.stopTimer)
      //toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  
  Toast.fire({
    icon: type,
    title: message
  })
}

/***  funtion defination for showing http error ***/
export const showHttpError = (error) => {
  if(error.response != undefined){
    var code = error.response.code;
    if(code == '401'){
      showToast('error','Authentication Failed')
    }else if(code == '404' || code == '403' || code == '400'){
      showToast('error','Failed to connect with the server');
    }else if(code == '500'){
      showToast('error','Internal Server Error');
    }else{
      showToast('error','Technical Error');
    }
  }else{
    showToast('error',error)
  }
}

/*** FUNCTION DEFINATION FOR ADDING & REMOVE FAVORITE ENTITY ***/
export const manipulateFavoriteEntity = (param,array,callback) => {
  console.log(param)
  console.log(array)
  let payload = {
    user_id : param,
    entity_ids : array,
  }

  addUserFavouriteDirectory(payload).then(function(res){
    var response = res.data;
    //this.setState({showLoader : false})
    if(response.errorResponse.errorStatusCode != 1000){
        showToast('error',response.errorResponse.errorStatusType);
    }else{
      callback();
      
    }
}.bind(this)).catch(function(err){
   // this.setState({showLoader : false})
    showHttpError(err)
}.bind(this))
}

/*** FUNCTION DEFINATION FOR ADDING & REMOVE FAVORITE ENTITY ***/
export const manipulateRemoveFavoriteEntity = (param,entity,callback) => {
  console.log(param)
  console.log(entity)
  let payload = {
    user_id : param,
    entity_id : entity,
  }

  removeUserFavouriteDirectory(payload).then(function(res){
    var response = res.data;
    //this.setState({showLoader : false})
    if(response.errorResponse.errorStatusCode != 1000){
        showToast('error',response.errorResponse.errorStatusType);
    }else{
      callback();
      
    }
}.bind(this)).catch(function(err){
   // this.setState({showLoader : false})
    showHttpError(err)
}.bind(this))
}


