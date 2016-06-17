var OrderForm = function () {

    return {
        
        //Order Form
        initOrderForm: function () {
	        // Datepickers
	        $('#start').datepicker({
	            dateFormat: 'dd.mm.yy',
	            prevText: '<i class="icon-chevron-left"></i>',
	            nextText: '<i class="icon-chevron-right"></i>',
	            onSelect: function( selectedDate )
	            {
	                $('#finish').datepicker('option', 'minDate', selectedDate);
	            }
	        });
	        $('#finish').datepicker({
	            dateFormat: 'dd.mm.yy',
	            prevText: '<i class="icon-chevron-left"></i>',
	            nextText: '<i class="icon-chevron-right"></i>',
	            onSelect: function( selectedDate )
	            {
	                $('#start').datepicker('option', 'maxDate', selectedDate);
	            }
	        });
			$('#start1').datepicker({
	            dateFormat: 'dd.mm.yy',
	            prevText: '<i class="icon-chevron-left"></i>',
	            nextText: '<i class="icon-chevron-right"></i>',
	            onSelect: function( selectedDate )
	            {
	                $('#finish').datepicker('option', 'minDate', selectedDate);
	            }
	        });
	        $('#finish1').datepicker({
	            dateFormat: 'dd.mm.yy',
	            prevText: '<i class="icon-chevron-left"></i>',
	            nextText: '<i class="icon-chevron-right"></i>',
	            onSelect: function( selectedDate )
	            {
	                $('#start').datepicker('option', 'maxDate', selectedDate);
	            }
	        });
	        
	        });
        }

    };

}();