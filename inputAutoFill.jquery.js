/*!
 * Input Auto Fill
 *
 * @author		Alexander Baldwin <https://github.com/mynameiszanders>
 * @copyright	2011, Alexander Baldwin
 * @requires	jQuery;
 * @link		https://github.com/mynameiszanders/inputAutoFill
 */
(function(undefined) {
	var $ = this.jQuery;
	if(typeof $ !== "function") {
		return false;
	}
	$.fn.autoFill = function(preClass) {
		preClass = typeof preClass == "string" ? preClass : false;
		var inputs = $(this).filter("input[type='text'],input[type='password'],textarea");
		if(inputs.length == 0) {
			return false;
		}
		$.each(inputs, function(index, element) {
			var input = $(element),
				defaultVal = element.defaultValue;
			input.addClass(preClass).data("focused", false);
			// Add the autocomplete="off" attribute to prevent browsers from
			// trying to autofill the input. Autocomplete causes problems when
			// auto-filling an username field tries to update the password field
			// (which does not have focus).
			input.attr("autocomplete", "off");
			input.bind("focus", function(event) {
				if(!input.data("focused")) {
					input.val("");
					input.data("focused", true);
					input.removeClass(preClass);
				}
			});
			input.bind("blur", function(event) {
				if(input.val() == "") {
					input.val(defaultVal);
					input.data("focused", false);
					input.addClass(preClass);
				}
			});
			var form = input.parents("form");
			if(form.length != 0) {
				form = $(form.get(0));
				form.bind("reset", function(event) {
					// Use a timeout because anything here is overwritten by the
					// browsers own reset functionality. Make sure this function
					// gets executed afterwards.
					setTimeout(function() {
						input.val("").trigger("blur");
					}, 1);
				});
			}
		});
	};
}).call(this);
