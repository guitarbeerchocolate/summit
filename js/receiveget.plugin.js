(function($)
{
    $.fn.extend(
    {
        receiveget:function(getvar)
        {
            var sPageURL = window.location.search.substring(1);
            var sURLVariables = sPageURL.split('&');
            var returnValue = null;
            for (var i = 0; i < sURLVariables.length; i++)
            {
                var sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] == getvar)
                {
                    returnValue = decodeURIComponent(sParameterName[1].replace('+', ' '));
                    /* $(this).text(returnValue); */
                }
            }
            return returnValue;
        }
    });
})(jQuery);