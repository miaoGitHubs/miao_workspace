;$(function(){
    'use strict';
    var sidebar=$('#sidebar'), //select side bar
        overlap=$('.overlap'),  //select mask for whole page
        sidebar_trigger=$('#sidebar_trigger'), // select the sidebar trigger
        backButton=$('.backTotop');// select  back button

    //For sideBar
    function showSideBar(){ //display side bar
    	overlap.fadeIn();   //display mask
    	sidebar.css('right',0); //adjust css of side bar
    }

    function hideSideBar(){ //hide side bar
    	overlap.fadeOut(); //hide mask
    	sidebar.css('right',-sidebar.width());
    }

    sidebar_trigger.on('click', showSideBar) //listen the trigger of side bar event

    overlap.on('click', hideSideBar) //listen the mask event

    backButton.on('click', function(){   //listen the back button event
    	$('html, body').animate({scrollTop:0},800)
    })

    //For Top button
    $(window).on('scroll',function(){  //listen to scroll event
        // if the size of scroll is higher than windows` size,
    	if($(window).scrollTop() > $(window).height())
            //display back button
    		backButton.fadeIn();
    	else
            //otherwise hide back button
    		backButton.fadeOut();
    })

    $(window).trigger('scroll'); //trigger the scroll event
})


