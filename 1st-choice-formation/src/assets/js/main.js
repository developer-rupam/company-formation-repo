 jQuery(document).ready(function () {
        jQuery('.table_all').DataTable();
      });

    jQuery(function () {
     jQuery("#datepicker, #clearance").datepicker();
    });

jQuery(document).ready( function () {
// add and remove .show_drop
$('body').on('click', '.addbutton_click', function () {
    var self = $(this);
		if (self.hasClass('cross')) {
			self.removeClass('cross');
			
		}	
		if (self.siblings( ".drop_menu" ).hasClass('view_drop')) {
			self.siblings( ".drop_menu" ).removeClass('view_drop');
			return false;
		}		
    $('.addbutton_click').removeClass('cross');
    $('.drop_menu').removeClass('view_drop');

    self.toggleClass('cross');
    self.siblings( ".drop_menu" ).toggleClass('view_drop');
    hide = false;
});
$(document).mouseup(function (e) { 
	var container = $(".addbutton_click"); 
	var container2 = $(".addbutton_click").siblings( ".drop_menu" ); 
	if(!container.is(e.target) && container.has(e.target).length === 0) {
		if(!container2.is(e.target) &&  container2.has(e.target).length === 0) { 
	   container2.removeClass('view_drop');
	   container.removeClass('cross');
	}
	}
		
}); 	
}); 

jQuery(document).ready(function(){
    jQuery('#check_all').on('click',function(){
        if(this.checked){
            jQuery('.checkbox').each(function(){
                this.checked = true;
            });
        }else{
             jQuery('.checkbox').each(function(){
                this.checked = false;
            });
        }
    });
    
    jQuery('.checkbox').on('click',function(){
        if(jQuery('.checkbox:checked').length == $('.checkbox').length){
            jQuery('#check_all').prop('checked',true);
        }else{
            jQuery('#check_all').prop('checked',false);
        }
    });
});
