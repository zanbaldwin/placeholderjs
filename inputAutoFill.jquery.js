/*!
 * jQuery Placeholder.js
 *
 * @author		Alexander Baldwin <https://github.com/mynameiszanders>
 * @copyright	2011, Alexander Baldwin
 * @requires	jQuery;
 * @license		MIT/X11 <http://j.mp/mit-license>
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
	$.fn.placeholder = function() {
		var preClass = "placeholder",
			inputs = $(this).filter(validElements);
		if(inputs.length == 0) {
			return false;
		}
		$.each(inputs, function(index, element) {
			var input = $(element),
				defaultVal = typeof input.attr("placeholder") === "string"
						   ? input.attr("placeholder")
						   : "";
			// If the browser supports HTML5 input placeholders, and the current input has one set, do not bother
			// applying this plugin, just skip directly to the next iteration.
			if(placeholder_support && defaultVal.length > 0) {
				return true;
			}

			input.val().length !== 0
				// If the input already have a non-empty string value set, either by direct HTML or by browser
				// manipulation (e.g. form auto-fill feature), declare the input as already focused.
				? input.data("focused", true)
				// Input is not focused already and add placeholder class to the element.
				: input.addClass(preClass).data("focused", false);

			input.bind("focus", function(event) {
				if(!input.data("focused")) {
					// Only set the input value to nothing if the current value is the default value. This prevents
					// removing what the browser may have changed the value to (e.g. autocomplete).
					defaultVal === input.val() && input.val("");
					input.data("focused", true).removeClass(preClass);
				}
			});
			input.bind("blur", function(event) {
				if(input.val() === "") {
					// If the user leaves the input without leaving an input, whack in the placeholder text, add the
					//placeholder class and declare it as unfocused.
					input.val(defaultVal).addClass(preClass).data("focused", false);
				}
				// This is the make sure the browser has not changed the value of the input without triggering an event
				// (e.g. saved-passwords autocomplete).
				else if(input.val() !== defaultVal) {
					input.data("focused", true);
				}
			});

			var form = input.parents("form");
			if(form.length !== 0) {
				// Grab the first form in the parent stack. This is the one the browser uses to identify the input with.
				form = $(form.get(0));
				form.bind("reset", function(event) {
					// Use a timeout because anything here is overwritten by the browsers own reset functionality. Make
					// sure this function gets executed afterwards.
					setTimeout(function() {
						input.val("").trigger("blur");
					}, 1);
				});
				form.bind("submit", function(event) {
					// Make sure a blur event is triggered to calculate correct values and states. If an input is in an
					// unfocused state, make sure that the placeholder text does not get sent in the form data.
					input.trigger("blur");
					if(!input.data("focused")) {
						input.val("");
					}
				});
			}
		});
		// Once all the functionality has been applied, trigger a blur event on all inputs to make sure the correct
		// values and classes are shown on initialisation.
		inputs.trigger("blur");
	};
}).call(this);