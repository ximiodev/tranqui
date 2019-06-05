$(document).ready(function() {
	$("#formm").on('submit', function(e) {
		if(validateEmail($('#email').val())) {
			return true;
		} else {
			e.preventDefault();
			return false;
			alert("Debes ingresar tu email");
		}
	});
	$('.topics-list-item').hover(function(e) {
		$(this).find('.subtopics').removeClass('hidden');
	},function(e) {
		$(this).find('.subtopics').addClass('hidden');
	});
	$('.fakefnd').click(function(e) {
		$('.tray').removeClass('tray-open');
		$('.fakefnd').removeClass('open');
	});
	$('.btnSearch').click(function(e) {
		e.preventDefault();
		if($('.tray').hasClass('tray-open')) {
			$('.tray').removeClass('tray-open');
			$('.fakefnd').removeClass('open');
		} else {
			$('.tray').addClass('tray-open');
			$('.fakefnd').addClass('open');
			$('#criterio').focus();
		}
	});
	$('.btnMenu').click(function(e) {
		e.preventDefault();
		if($('.tray').hasClass('tray-open')) {
			$('.tray').removeClass('tray-open');
			$('.fakefnd').removeClass('open');
		} else {
			$('.tray').addClass('tray-open');
			$('.fakefnd').addClass('open');
		}
	});
	//0
	owl = $('.owl-carousel0');
	owl.owlCarousel({
		loop:true,
		margin:10,
		autoplay:true,
		autoplayTimeout:8000,
		autoplayHoverPause:true,
		pagination: false,
		responsiveClass:true,dots: false,
		responsive:{
			0:{
				items:1,
				nav:false,
				false:false
			},
			600:{
				items:3,
				nav:false,
				false:false
			}
		}
	});
	
	$('.owlprev0').click(function(e) {
		e.preventDefault();
		owl.trigger('prev.owl.carousel');
	});
	
	$('.owlnext0').click(function(e) {
		e.preventDefault();
		owl.trigger('next.owl.carousel');
	});
	//1
	owl1 = $('.owl-carousel1');
	owl1.owlCarousel({
		loop:true,
		margin:10,
		autoplay:true,
		autoplayTimeout:8000,
		autoplayHoverPause:true,
		responsiveClass:true,
		pagination: false,dots: false,
		responsive:{
			0:{
				items:1,
				nav:false,
				false:false
			},
			600:{
				items:3,
				nav:false,
				false:false
			}
		}
	});
	
	
	$('.multimediaImgLi').click(function(e) {
		e.preventDefault();
		var epi = $(this).data('epi');
		var img = $(this).data('img');
		$('.bigImageGal').css({'background-image':'url(/'+img+')'});
		$('.multimediaBaj').html(epi);
		
	});
	
	$('.owlprev1').click(function(e) {
		e.preventDefault();
		owl1.trigger('prev.owl.carousel');
	});
	
	$('.owlnext1').click(function(e) {
		e.preventDefault();
		owl1.trigger('next.owl.carousel');
	});
	
	//2
	owl2 = $('.owl-carousel2');
	owl2.owlCarousel({
		loop:true,
		margin:10,
		autoplay:true,
		autoplayTimeout:8000,
		autoplayHoverPause:true,
		responsiveClass:true,
		pagination: false,dots: false,
		responsive:{
			0:{
				items:1,
				nav:false,
				false:false
			},
			600:{
				items:3,
				nav:false,
				false:false
			}
		}
	});
	
	$('.owlprev2').click(function(e) {
		e.preventDefault();
		owl2.trigger('prev.owl.carousel');
	});
	
	$('.owlnext2').click(function(e) {
		e.preventDefault();
		owl2.trigger('next.owl.carousel');
	});
	
	
	//3
	owl3 = $('.owl-carousel3');
	owl3.owlCarousel({
		loop:true,
		margin:10,
		autoplay:true,
		autoplayTimeout:8000,
		autoplayHoverPause:true,
		responsiveClass:true,
		pagination: false,
		dots: false, 
		responsive:{
			0:{
				items:1,
				nav:false,
				false:false
			},
			600:{
				items:1,
				nav:false,
				false:false
			}
		}
	});
	
	$('.owlprev3').click(function(e) {
		e.preventDefault();
		owl3.trigger('prev.owl.carousel');
	});
	
	$('.owlnext3').click(function(e) {
		e.preventDefault();
		owl3.trigger('next.owl.carousel');
	});
	
	//4
	owl4 = $('.owl-carousel4');
	owl4.owlCarousel({
		loop:true,
		margin:10,
		autoplay:true,
		autoplayTimeout:8000,
		autoplayHoverPause:true,
		responsiveClass:true,
		pagination: false,
		dots: false, 
		responsive:{
			0:{
				items:1,
				nav:false,
				false:false
			},
			600:{
				items:1,
				nav:false,
				false:false
			}
		}
	});
	
	$('.owlprev4').click(function(e) {
		e.preventDefault();
		owl4.trigger('prev.owl.carousel');
	});
	
	$('.owlnext4').click(function(e) {
		e.preventDefault();
		owl4.trigger('next.owl.carousel');
	});
	
	
	//5
	owl5 = $('.owl-carousel5');
	owl5.owlCarousel({
		loop:true,
		margin:10,
		autoplay:true,
		autoplayTimeout:8000,
		autoplayHoverPause:true,
		responsiveClass:true,
		pagination: false,
		dots: false, 
		responsive:{
			0:{
				items:1,
				nav:false,
				false:false
			},
			600:{
				items:5,
				nav:false,
				false:false
			}
		}
	});
	
	$('.owlprev5').click(function(e) {
		e.preventDefault();
		owl5.trigger('prev.owl.carousel');
	});
	
	$('.owlnext5').click(function(e) {
		e.preventDefault();
		owl5.trigger('next.owl.carousel');
	});
	
	
	//6
	owl6 = $('.owl-carousel6');
	owl6.owlCarousel({
		loop:true,
		margin:10,
		autoplay:true,
		autoplayTimeout:8000,
		autoplayHoverPause:true,
		responsiveClass:true,
		pagination: false,
		dots: false, 
		responsive:{
			0:{
				items:1,
				nav:false,
				false:false
			},
			600:{
				items:5,
				nav:false,
				false:false
			}
		}
	});
	
	$('.owlprev6').click(function(e) {
		e.preventDefault();
		owl6.trigger('prev.owl.carousel');
	});
	
	$('.owlnext6').click(function(e) {
		e.preventDefault();
		owl6.trigger('next.owl.carousel');
	});
	
	
	//h
	owlh = $('.owl-carouselh');
	owlh.owlCarousel({
		loop:true,
		margin:10,
		autoplay:true,
		autoplayTimeout:8000,
		autoplayHoverPause:true,
		responsiveClass:true,
		pagination: false,
		dots: false, 
		responsive:{
			0:{
				items:1,
				nav:false,
				false:false
			}
		}
	});
	
	$('.owlprevh').click(function(e) {
		e.preventDefault();
		owlh.trigger('prev.owl.carousel');
	});
	
	$('.owlnexth').click(function(e) {
		e.preventDefault();
		owlh.trigger('next.owl.carousel');
	});
	
	
	//g
	owlg = $('.owl-carouselG');
	owlg.owlCarousel({
		loop:true,
		margin:10,
		autoplay:true,
		autoplayTimeout:8000,
		autoplayHoverPause:true,
		responsiveClass:true,
		pagination: false,
		dots: false, 
		responsive:{
			0:{
				items:1,
				nav:false,
				false:false
			},
			600:{
				items:5,
				nav:false,
				false:false
			}
		}
	});
	
	$('.owlprevG').click(function(e) {
		e.preventDefault();
		owlg.trigger('prev.owl.carousel');
	});
	
	$('.owlnextG').click(function(e) {
		e.preventDefault();
		owlg.trigger('next.owl.carousel');
	});
	
	//
	
	$('.linkMultiTira').click(function(e) {
		e.preventDefault();
		multarAct = $(this).attr('id').substring(13);
		irHastaThumb();
		clearInterval(inmul);
		inmul = setInterval(irHastaThumb, 10000);
	});
	
	cantSlidMul = $('.linkMultiTira').size();
	irHastaThumb();
	inmul = setInterval(irHastaThumb, 10000);
});
var owl;
var owl1;
var owl2;
var owl3;
var owl4;
var owl5;
var owlh;
var owlg;
var inmul;
var cantSlidMul;
var multarAct = 0;
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function irHastaThumb() {
	var altura = 0;
	for(var i=0; i<multarAct ;i++) {
		altura += $('#multinotisel-'+i).height();
	}
	var vid = $('#multinotisel-'+i).data('vid');
	var titulo = $('#multinotisel-'+i).data('tit');
	var conth = videos[vid];
	$('.videocon').html(conth);
	$('.multiBigTit').html(titulo);
	$(".selectorMultPrinc").animate({ scrollTop: altura }, 1000);
	if(multarAct<(cantSlidMul-1)) {
		multarAct++;
	} else {
		multarAct = 0;
	}
}

function urlCompartirEnFacebook() {
	var url = 'https://www.facebook.com/sharer/sharer.php?u='+window.location.href;
	window.open(url, "", "width=570,height=720");
}



function urlCompartirEnTwitter(titulo) {
	var url = 'https://twitter.com/intent/tweet?text='+titulo+'&url='+window.location.href;
	window.open(url, "", "width=570,height=420");
}
