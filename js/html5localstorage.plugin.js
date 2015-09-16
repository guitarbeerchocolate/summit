(function($)
{
    var thisForm, ts, sa, action, formType, fieldString, uploadHasHappened, onlineFormHasBeenSubmitted, offlineFormHasBeenSubmitted;
    $.fn.extend(
    {
        html5localstorage:function()
        {
            thisForm = $(this);
            ts = thisForm.serialize();
            sa = thisForm.serializeArray();
            action = thisForm.attr('action'); 
            formType = thisForm.attr('method');           
            fieldString = '';
            uploadHasHappened = false;
            onlineFormHasBeenSubmitted = false;
            offlineFormHasBeenSubmitted = false;
            for (var fsi = 0; fsi < sa.length; fsi++)
            {
                fieldString += sa[fsi].name;
            }; 
        }
    });

    /* Handle submissions and post to external PHP files for processing */
    $.fn.online = function(resultSelector)
    {
        $(this).checkForUploads();
        if(uploadHasHappened == false)
        {
            uploadHasHappened = $(this).handleUploadClick(resultSelector);    
        }
        if(onlineFormHasBeenSubmitted == false)
        {
            onlineFormHasBeenSubmitted = $(this).handleOnlineFormSubmit(resultSelector);
        }
        $('h1').text('My website Online');
    };

    /* Handle submissions and post to localstorage */
    $.fn.offline = function(resultSelector)
    {
       if(offlineFormHasBeenSubmitted == false)
        {
            offlineFormHasBeenSubmitted = $(this).handleOfflineFormSubmit(resultSelector);
        }
        $('h1').text('My website Offline'); 
    };

    /* Add items to localStorage */
    $.fn.addItems = function()
    {
        var nextKey = parseInt($(this).getKey())+1;
        localStorage.setItem(nextKey,JSON.stringify(sa));
    };

    /* Get the last key added for this form */
    $.fn.getKey = function()
    {
        var highestKey = 0;
        for(var i=0; i < localStorage.length; i++)
        {
            if((localStorage.key(i) != 'showIcon') && (localStorage.key(i) != 'urlBlackList') && (localStorage.key(i) != 'favorite_tables'))
            {
                if(localStorage.key(i) > highestKey)
                {
                    highestKey = localStorage.key(i);
                }
            }                
        }
        return highestKey;
    }

    /* Check for values in sa */
    $.fn.checkForValues = function()
    {
        var valuesFound = false;
        for(var i=0; i < sa.length; i++)
        {
            if(sa[i].value != '')
            {
                valuesFound = true;
            }
        }
        return valuesFound;
    }

    /* Check to see if there are any uploads for this form */
    $.fn.checkForUploads = function()
    {
        var matchFound = false;
        for(var i=0; i < localStorage.length; i++)
        {
            var key = localStorage.key(i).toLowerCase();
            if((localStorage.key(i) != 'showIcon') && (localStorage.key(i) != 'urlBlackList') && (localStorage.key(i) != 'favorite_tables'))
            {
                var retrievedObject = JSON.parse(localStorage.getItem(key));
                if(retrievedObject != null)
                {
                    if($(this).localStorageFieldString(retrievedObject) == fieldString)
                    {
                        matchFound = true;
                    }             
                }
            }
        }
        if(matchFound == true)
        {
            $('#refreshForLocalStorage').show();   
        }
        else
        {
            $('#refreshForLocalStorage').hide();
        }        
    }

    /* Return localStorage item fieldString */
    $.fn.localStorageFieldString = function(lsi)
    {
        var fieldsFromLSitem = '';
        for(var j=0; j < lsi.length; j++)
        {
            fieldsFromLSitem += lsi[j].name;
        }
        return fieldsFromLSitem;
    }

    /* Return localStorage item content as a string */
    $.fn.getItem = function(name)
    {
        try
        {
            return localStorage[name];
        }
        catch(e)
        {
            return e;
        }        
    };

    /* Handle when someone clicks the button to upload items from localStorage to online storage */
    $.fn.handleUploadClick = function(resultSelector)
    {
        $('#refreshForLocalStorage').click(function(ev)
        {
            var deleteKeysArr = [];
            for(var i=0; i < localStorage.length; i++)
            {
                var key = localStorage.key(i).toLowerCase();
                if((localStorage.key(i) != 'showIcon') && (localStorage.key(i) != 'urlBlackList') && (localStorage.key(i) != 'favorite_tables'))
                {
                    var retrievedObject = JSON.parse(localStorage.getItem(key));
                    if(retrievedObject != null)
                    {
                        if($(this).localStorageFieldString(retrievedObject) == fieldString)
                        {
                            $(this).uploadItem(retrievedObject, resultSelector);                            
                            deleteKeysArr.push(parseInt(key));
                        }             
                    }
                }
            }
            $(this).deleteSelectedItems(deleteKeysArr);
            ev.preventDefault();
        });
        return true;
    }

    /* Handle online form submission */
    $.fn.handleOnlineFormSubmit = function(resultSelector)
    {
        thisForm.submit(function(ev)
        {
            $.ajax(
            {
                type:formType,
                url:action,
                data:thisForm.serialize(),           
                success: function(result)
                {
                    $(resultSelector).text(result);
                    $(resultSelector).show().delay(2000).fadeOut();
                    thisForm.trigger('reset');
                    $(':input:enabled:visible:first').focus();
                }
            });
            ev.preventDefault();
        });
        return true;
    }

    /* Handle offline form submission */
    $.fn.handleOfflineFormSubmit = function(resultSelector)
    {
        thisForm.submit(function(ev)
        {
            sa = thisForm.serializeArray();
            if($(this).checkForValues() == true)
            {
                $(this).addItems();
                $(resultSelector).text('Data stored locally');
                $(resultSelector).show().delay(2000).fadeOut();
                thisForm.trigger('reset');
                $(':input:enabled:visible:first').focus();
            }
            ev.preventDefault();                
        });
        return true;
    }

    /* Upload item to online storage */
    $.fn.uploadItem = function(retrievedObject, resultSelector)
    {
        var lsItems = '';
        for(var j=0; j < retrievedObject.length; j++)
        {
            lsItems += retrievedObject[j].name+'='+retrievedObject[j].value+'&';            
        }
        lsItems = lsItems.substring(0, lsItems.length - 1);
        $.ajax(
        {
            type:formType,
            url:action,
            data:lsItems,           
            success: function(result)
            {
                $(resultSelector).text(result);
                $(resultSelector).show().delay(2000).fadeOut();                               
            }
        });
    }

    /* Remove uploaded items from localStorage */
    $.fn.deleteSelectedItems = function(keyArr)
    {
        for(var i = 0; i < keyArr.length; i++)
        {
            localStorage.removeItem(keyArr[i]);
        }        
    }; 

})(jQuery);