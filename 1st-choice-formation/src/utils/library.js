import { SITENAMEALIAS } from './init'
import Swal from 'sweetalert2'


/*** function defination for storing current route ***/
export const storeCurrentRoute = (route) =>{
    localStorage.setItem(SITENAMEALIAS + '_current_page',route);
}

/*** function defination for confirm message  ***/
export const showConfirm = (callback) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
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

