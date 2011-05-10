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
		var inputs = $(this),
			rel = "focused";
		if(inputs.length == 0) {
			return false;
		}
		$.each(inputs, function(index, element) {
			var input = $(element),
				defaultVal = element.defaultValue;
			input.addClass(preClass);
			input.bind("focus", function(event) {
				if(input.attr("rel") != rel) {
					input.attr({
						"value": "",
						"rel": rel
					}).removeClass(preClass);
				}
			});
			input.bind("blur", function(event) {
				if(input.attr("value") == "") {
					input.attr("rel", "");
					input.attr("value", defaultVal);
					input.addClass(preClass);
				}
			});
			var form = input.parents("form");
			if(form.length != 0) {
				form = $(form.get(0));
				form.bind("reset", function(event) {
					setTimeout(function() {
						input.attr("value", "").trigger("blur");
					}, 1);
				});
			}
		});
	};
}).call(this);
