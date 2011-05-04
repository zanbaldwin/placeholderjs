(function($) {
	$.fn.autoFill = function(preClass) {
		preClass = typeof preClass == "string" ? preClass : false;
		input = $(this);
		if(input.length == 0) {
			return false;
		}
		var rel = "focused";
		$.each(input, function(index, element) {
			var input = $(element);
			var defaultval = element.defaultValue;
			input.addClass(preClass);
			input.bind("focus", function(event) {
				if(input.attr("rel") != rel) {
					defaultval = input.attr("value");
					input.attr("value", "");
					input.attr("rel", rel);
					input.removeClass(preClass);
				}
			});
			input.bind("blur", function(event) {
				if(input.attr("value") == "") {
					input.attr("value", defaultval);
					input.attr("rel", "");
					input.addClass(preClass);
				}
			});
			var form = input.parents("form");
			if(form.length != 0) {
				form = $(form.get(0));
				form.bind("reset", function(event) {
					setTimeout(function() {
						input.attr("value", "");
						input.trigger("blur");
					}, 1);
				});
				form.bind("submit", function(event) {
					if(input.data("required") == true && input.attr("rel") != rel) {
						event.preventDefault();
						input.trigger("inputRequired");
						return false;
					}
				});
			}
		});
	};
})(jQuery);
