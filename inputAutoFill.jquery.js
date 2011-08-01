/*!
 * Input Auto Fill
 *
 * @author		Alexander Baldwin <https://github.com/mynameiszanders>
 * @copyright	2011, Alexander Baldwin
 * @requires	jQuery;
 * @license	MIT/X11 <http://j.mp/mit-license>
 * @link		https://github.com/mynameiszanders/inputAutoFill
 */
(function(undefined) {
	var $ = this.jQuery,
		validInputs = [
			"text",		"search",	"password",		"tel",		"url",
			"email",	"date",		"month",		"datetime",	"week",
			"time",		"number",	"color",		"datetime-local"
		],
		validElements = "input[type='"
					  + validInputs.join("'],input[type='")
					  + "'],textarea";
	if(typeof $ !== "function") {
		return false;
	}
	var placeholder_support = (function() {
		var i = document.createElement("input");
		return "placeholder" in i;
	})();
	$.fn.autoFill = function(preClass) {
		preClass = typeof preClass == "string" ? preClass : false;
		var inputs = $(this).filter(validElements);
		if(inputs.length == 0) {
			return false;
		}
		$.each(inputs, function(index, element) {
			var input = $(element),
				defaultVal = typeof input.data("placeholder") === "string"
						   ? input.data("placeholder")
						   : element.defaultValue;
			// If the browser supports HTML5 input placeholders, and the current
			// input has one set, do not bother applying this plugin, just skip
			// directly to the next iteration.
			if(placeholder_support && typeof input.attr("placeholder") === "string" && input.attr("placeholder") !== "") {
				return true;
			}
			input.val() !== defaultVal ? input.data("focused", true)
									   : input.addClass(preClass).data("focused", false);
			input.bind("focus", function(event) {
				if(!input.data("focused")) {
					// Only set the input value to nothing if the value if the
					// default value. This prevent removing what the browser may
					// have changed the value to (eg, autocomplete).
					defaultVal === input.val() && input.val("");
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
				// This is to make sure the browser has not changed the value of
				// the input without triggering an event (eg. saved passwords
				// autocomplete).
				else if(input.val() != defaultVal) {
					input.data("focused", true);
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
				form.bind("submit", function(event) {
					input.trigger("blur");
					if(!input.data("focused")) {
						input.val("");
					}
				});
			}
		});
		// Once all the functionality has been applied, trigger a blur event on all
		// inputs to make sure the correct values and classes are shown on initialisation.
		inputs.trigger("blur");
	};
}).call(this);
