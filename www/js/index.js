window.onerror = function(message, url, lineNumber) {
	log("Error: "+message+" in "+url+" at line "+lineNumber);
	alert("Error: "+message+" in "+url+" at line "+lineNumber);
}
var apiURL = "http://tranquiapp.net/apiTranqui.php";
var baseURL = "http://tranquiapp.net/";
var isLoginSave = false;
var userLogId = false;
var timerac = '';
var sinintrombsr = false;
var loginData_nombre = '';
var cur_i;
var cur_posc;
var cur_curid;
var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        //~ app.setupPush();
        //~ app.initStore();
        setTimeout(sacarSplash, 1000);
		loginData_nombre = '';
        
        isLoginSave = localStorage.getItem('isLogin');
        loginData_nombre = localStorage.getItem('loginData_nombre');
        if(!loginData_nombre) {
			loginData_nombre  = '';
		}
        userLogId = localStorage.getItem('userLogId');
        if(!userLogId) {
			userLogId  = '';
		}
        
        if(isLoginSave) {
			$('#pantalla0').removeClass('activa');
			$('#pantalla0').addClass('hidden');
			$('#pantalla1').removeClass('hidden');
			$('#pantalla1').addClass('activa');
			$('.nombreuser').html('Hola '+loginData_nombre);
			app.setSession();
			app.loadEstadisticas();
			app.savePushToken();
			app.iniciarCont();
		}
        
        $('#facebooklogin').click(function(e) {
			e.preventDefault();
			facebookConnectPlugin.login(['email'], app.hacerloginFace,
			  function loginError (error) {
				alerta(JSON.stringify(error))
			  }
			);
		});
        
        $('#googlelogin').click(function(e) {
			e.preventDefault();
			window.plugins.googleplus.login({
					'scopes': 'https://www.googleapis.com/auth/contacts.readonly profile email',
					'offline': true
                }, app.hacerloginGoog,
				function (msg) {
					alerta('error: ' + JSON.stringify(msg));
				}
			);
		});
		
        $('.btnCerrarAlerta').click(function(e) {
			e.preventDefault();
			sacarAlerta();
		});
		
        $('#login').click(function(e) {
			e.preventDefault();
			$('#glyphicon glyphicon-user').html($('#email').val());
			ponerPantalla('pantalla0a');
		});
		
        $('.respuesta').click(function(e) {
			e.preventDefault();
			preguntaAct++;
			ponerSigPreg();
		});
		
        $('#registro').click(function(e) {
			e.preventDefault();
			$('#glyphicon glyphicon-user').html($('#email2').val());
			ponerPantalla('pantalla0b');
		});
		
        $('#btnLogin').click(function(e) {
			e.preventDefault();
			$(':focus').blur();
			var datos = {};
			datos.action = 'doLogin';
			datos.tipo = 'user';
			datos.email = $('#email').val();
			datos.password = $('#password').val();
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: apiURL,
				data: datos,
				success: function (data) {
					if(data.res) {
						ponerPantalla('pantalla1');
						app.iniciarCont();
						$('.videomin')[0].play();
						isLogin = true;
						localStorage.setItem('isLogin', isLogin);
						loginData_nombre = data.datos.nombre;
						localStorage.setItem('loginData_nombre', loginData_nombre);
						userLogId = data.datos.ID;
						localStorage.setItem('userLogId', userLogId);
						
						estadisticas = data.estadisticas;
						app.savePushToken();
						ponerEstadisticas();
						$('.nombreuser').html('Hola '+data.datos.nombre);
					} else {
						alerta(data.message);
					}
				}
			});
		});
		
        $('#btnRegistro').click(function(e) {
			e.preventDefault();
			$(':focus').blur();
			if($('#nombre2').val()!='' && validateEmail($('#email2').val()) && $('#password2').val()!='' && $('#password2').val()==$('#password2b').val()) {
				var datos = {};
				datos.action = 'doRegistro';
				datos.tipo = 'user';
				datos.nombre = $('#nombre2').val();
				datos.email = $('#email2').val();
				datos.password = $('#password2').val();
				$.ajax({
					type: 'POST',
					dataType: 'json',
					url: apiURL,
					data: datos,
					success: function (data) {
						if(data.res) {
							ponerPantalla('pantalla1');
							app.iniciarCont();
							$('.videomin')[0].play();
							isLogin = true;
							localStorage.setItem('isLogin', isLogin);
							loginData_nombre = data.datos.nombre;
							localStorage.setItem('loginData_nombre', loginData_nombre);
							userLogId = data.datos.ID;
							localStorage.setItem('userLogId', userLogId);
							app.savePushToken();
							$('.nombreuser').html('Hola '+data.datos.nombre);
						} else {
							alerta(data.message);
						}
					}
				});
			} else {
				alerta("debes completar todos los campos");
			}
		});
		
        //~ $('.playbutton').click(function(e) {
			//~ e.preventDefault();
			//~ $('.videomin')[0].play();
	        //~ $('.playbutton').hide();
	        //~ $('.saltarVid').removeClass('hidden');
	        //~ $('.videomin').show();
		//~ });
		
        //~ $('.videomin').click(function(e) {
			//~ e.preventDefault();
			//~ $('.videomin')[0].pause();
	        //~ $('.playbutton').show();
	        //~ $('.videomin').hide();
		//~ });
		
		 $('.btnVolverapa').click(function(e) {
			e.preventDefault();
			var donde = $(this).data('apa');
			if(donde=='pantalla16') {
				$('#audClaseP')[0].pause();
			}
			if(donde=='pantalla12d') {
				$('#uad_MBSR')[0].pause();
			}
			ponerPantalla(donde);
		});
		
		 $('.saltarVid').click(function(e) {
			e.preventDefault();
			$('.videomin')[0].pause();
			ponerPantalla('pantalla2');
		});
		
		 $('.suphor').click(function(e) {
			e.preventDefault();
			var cont = $(this).parent().find('.notinumber');
			var hor = parseInt(cont.html());
			var max = cont.data('max');
			if(hor<max) {
				hor++;
			}
			if(hor<10) {
				hor = '0'+hor;
			}
			cont.html(hor);
		});
		
		 $('.infhor').click(function(e) {
			e.preventDefault();
			var cont = $(this).parent().find('.notinumber');
			var hor = parseInt(cont.html());
			if(hor>0) {
				hor--;
			}
			if(hor<10) {
				hor = '0'+hor;
			}
			cont.html(hor);
		});
		
		 $('#confNotResp').click(function(e) {
			e.preventDefault();
			$('#notRespB').addClass('activo');
			$('#notRespM').removeClass('activo');
		});
		
		 $('#confNotMed').click(function(e) {
			e.preventDefault();
			$('#notRespM').addClass('activo');
			$('#notRespB').removeClass('activo');
		});
		
		 $('.saltar').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla3b');
		});
		
		 $('.iniciarmedini').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla3');
		});
		
		 $('.btnConfirmar1').click(function(e) {
			e.preventDefault();
			$('#notRespB').removeClass('activo');
			$('#notRespM').removeClass('activo');
			$('#msjconf').css({'opacity':0});
			$('#msjconf').html(getTexto('confirm_notificaciones_meditar'));
			$('#msjconf').animate({opacity: 1}, 300, 
				function() {
					$('#msjconf').delay(2000).animate({opacity: 0}, 300, 
						function() {
							$('#msjconf').html('');
						}
					);
				}
			);
		});
		
		 $('.btnConfirmar2').click(function(e) {
			e.preventDefault();
			$('#notRespB').removeClass('activo');
			$('#notRespM').removeClass('activo');
			$('#msjconf').css({'opacity':0});
			$('#msjconf').html(getTexto('confirm_notificaciones_respirar'));
			$('#msjconf').animate({opacity: 1}, 300, 
				function() {
					$('#msjconf').delay(2000).animate({opacity: 0}, 300, 
						function() {
							$('#msjconf').html('');
						}
					);
				}
			);
		});
		
		 $('.btnFinalizarConf').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla5');
		});
		
		 $('#btnRepetirMEdIni').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla3');
		});
		
		 $('.btnVolverHome').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla5');
		});
		
		 $('#pantalla10 .btnVolverHome').click(function(e) {
			e.preventDefault();
			$('#audMedDiaria')[0].pause();
		});
		
		 $('.btnHome').click(function(e) {
			e.preventDefault();
			navigator.vibrate(100);
			ponerPantalla('pantalla5');
		});
		
		 $('.btnGuiada').click(function(e) {
			e.preventDefault();
			timerac = 'GUIADA';
			ponerPantalla('pantalla6a');
		});
		
		 $('.btnNoGuiada').click(function(e) {
			e.preventDefault();
			timerac = 'NO GUIADA';
			ponerPantalla('pantalla6a');
		});
		
		 $('.btnGratuita').click(function(e) {
			e.preventDefault();
			timerac = 'GRATUITA';
			ponerPantalla('pantalla6a');
		});
		
		 $('.btnTimers').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla6');
		});
		
		 $('.btnEsfera').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla7');
		});
		
		 $('.btnPodcasts').click(function(e) {
			e.preventDefault();
			navigator.vibrate(100);
			ponerPantalla('pantalla8');
		});
		
		 $('.btnLibreria').click(function(e) {
			e.preventDefault();
			navigator.vibrate(100);
			ponerPantalla('pantalla9');
		});
		
		 $('.btnMedDiaria').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla10');
		});
		
		 $('.btnMedDiaria').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla10');
		});
		
		 $('.btnUser').click(function(e) {
			e.preventDefault();
			navigator.vibrate(100);
			ponerPantalla('pantalla11');
		});
		
		 $('.btnMSBR').click(function(e) {
			e.preventDefault();
			navigator.vibrate(100);
			var muestroono = localStorage.getItem('sinintrombsr');
			if(muestroono || sinintrombsr) {
				ponerPantalla('pantalla12b');
			} else {
				$('#elotro').removeClass('activo');
				$('.text_mb_2').css({opacity:0});
				$('.text_mb_1').css({opacity:1});
				ponerPantalla('pantalla12');
			}
		});
		
		 $('.btnSigPantMBSR').click(function(e) {
			e.preventDefault();
			if($('#nomostrarmbsrintro').prop("checked")) {
				localStorage.setItem('sinintrombsr', true);
				sinintrombsr = true;
			}
			ponerPantalla('pantalla12b');
		});
		
		$('.btnGetCupon').click(function(e) {
			e.preventDefault();
			var codval = $('#codigombsr').val();
			if(codval!='') {
				var datos = {};
				datos.action = 'validateMBSRCode';
				datos.code = codval;
				$.ajax({
					type: 'POST',
					dataType: 'json',
					url: apiURL,
					data: datos,
					success: function (data) {
						if(data.res) {
							ponerPantalla('pantalla12c');
						} else {
							alerta("El código ingresado no es válido.");
						}
					}
				});
			} else {
				alerta("Debes ingresar un codigo.");
			}
		});
		
		 $('.btnVolverPods').click(function(e) {
			e.preventDefault();
			$('#audPod').html('');
			$('#audPod')[0].pause();
			ponerPantalla('pantalla8');
		});
		
		 $('.todospods').on('click', '.boxcast',function(e) {
			e.preventDefault();
			$('#audPod').html('');
			$('#audPod')[0].pause();
			ponerPod($(this).data('pod'));
		});
		
		 $('.ultimopodcast').click(function(e) {
			e.preventDefault();
			$('#audPod')[0].pause();
			$('#audPod').html('');
			ponerPod(0);
		});
		
		$('.btnSaltarMedIn').click(function(e) {
			e.preventDefault();
			$('#med_ini')[0].pause();
			ponerPantalla('pantalla4');
		});
		
		$("#changeTypePass").click(function(){
			if($('#password').prop('type')=='password') {
				$('#password').prop('type', 'text');
				$(this).removeClass('glyphicon-eye');
				$(this).addClass('glyphicon-eye-close');
			} else {
				$('#password').prop('type', 'password');
				$(this).removeClass('glyphicon-eye-close');
				$(this).addClass('glyphicon-eye');
			}
		});
		
		$("#changeTypePass2").click(function(){
			if($('#password2').prop('type')=='password') {
				$('#password2').prop('type', 'text');
				$(this).removeClass('glyphicon-eye');
				$(this).addClass('glyphicon-eye-close');
			} else {
				$('#password2').prop('type', 'password');
				$(this).removeClass('glyphicon-eye-close');
				$(this).addClass('glyphicon-eye');
			}
		});
		
		$("#changeTypePass3").click(function(){
			if($('#password2b').prop('type')=='password') {
				$('#password2b').prop('type', 'text');
				$(this).removeClass('glyphicon-eye');
				$(this).addClass('glyphicon-eye-close');
			} else {
				$('#password2b').prop('type', 'password');
				$(this).removeClass('glyphicon-eye-close');
				$(this).addClass('glyphicon-eye');
			}
		});
		
		$('#btnBuscar').click(function(e) {
			e.preventDefault();
			var wts = $('#buscarCate').val();
			$('.categoriascur').html('');
			var podac;
			
			for(var i=0;i<categorias.length;i++) {
				if(wts!='') {
					var keywords = categorias[i].keywords.split(',');
					var encontro1 = false;
					for(var t=0;t<keywords.length;t++) {
						if(keywords[t].search(wts)!=-1) {
							encontro1 = true;
						}
					}
					if(encontro1 || categorias[i].nombre.search(wts)!=-1) {
						podac = ''+
						'<div class="boxcate" onclick="app.ponerCursos('+i+','+categorias[i].ID+');" style="'+categorias[i].codigo+'" data-cate="'+i+'">'+
						'	<div class="titCate">'+categorias[i].nombre+'</div>'+
						'</div>';
						$('.categoriascur').append(podac);
					}
				} else {
					podac = ''+
					'<div class="boxcate" onclick="app.ponerCursos('+i+','+categorias[i].ID+');" style="'+categorias[i].codigo+'" data-cate="'+i+'">'+
					'	<div class="titCate">'+categorias[i].nombre+'</div>'+
					'</div>';
					$('.categoriascur').append(podac);
				}
			}
		});
		
		$('.btnDescargaFile').click(function(e) {
			e.preventDefault();
			var quien = $(this).find('.bolita');
			if(quien.hasClass('bolitaOn')) {
				quien.removeClass('bolitaOn');
			} else {
				quien.addClass('bolitaOn');
			}
		});
		
		$('.btnProximoCurso').click(function(e) {
			e.preventDefault();
			//posc es indide dentro de categorias
			var posci=0;
			var curpos=0;
			for(var k=0;k<allcursos.length;k++) {
				if(allcursos[k].ID==curoreco) {
					curpos = k;
					posci = allcursos[k].categoria_ID
				}
			}
			//i posicion del cuso
			app.ponerCurso(curpos,posci,curoreco);
		});
		
		$("#med_ini_control").roundSlider({
			radius: 60,
			width: 1,
			handleSize: "+10",
			handleShape: "dot",
			sliderType: "min-range",
			value: 0,
			startAngle: 90,
			start: function(e) {
				estadrag = true;
			},
			stop: function(e) {
				estadrag = false;
				var porc = e.value;
				var audio = $('#med_ini')[0];
				var tototime = (porc*audio.duration)/100;
				audio.currentTime = tototime; 
			}
		});
		
		$("#audClaseP_control").roundSlider({
			radius: 60,
			width: 1,
			handleSize: "+10",
			handleShape: "dot",
			sliderType: "min-range",
			value: 0,
			startAngle: 90,
			start: function(e) {
				estadrag = true;
			},
			stop: function(e) {
				estadrag = false;
				var porc = e.value;
				var audio = $('#audClaseP')[0];
				var tototime = (porc*audio.duration)/100;
				audio.currentTime = tototime; 
			}
		});
		
		$("#uad_MBSR_control").roundSlider({
			radius: 60,
			width: 1,
			handleSize: "+10",
			handleShape: "dot",
			sliderType: "min-range",
			value: 0,
			startAngle: 90,
			start: function(e) {
				estadrag = true;
			},
			stop: function(e) {
				estadrag = false;
				var porc = e.value;
				var audio = $('#uad_MBSR')[0];
				var tototime = (porc*audio.duration)/100;
				audio.currentTime = tototime; 
			}
		});
		
		$("#audEsfera_control").roundSlider({
			radius: 60,
			width: 1,
			handleSize: "+10",
			handleShape: "dot",
			sliderType: "min-range",
			value: 0,
			startAngle: 90,
			start: function(e) {
				estadrag = true;
			},
			stop: function(e) {
				estadrag = false;
				var porc = e.value;
				var audio = $('#audEsfera')[0];
				var tototime = (porc*audio.duration)/100;
				audio.currentTime = tototime; 
			}
		});
		
		$("#audPod_control").roundSlider({
			radius: 60,
			width: 1,
			handleSize: "+10",
			handleShape: "dot",
			sliderType: "min-range",
			value: 0,
			startAngle: 90,
			start: function(e) {
				estadrag = true;
			},
			stop: function(e) {
				estadrag = false;
				var porc = e.value;
				var audio = $('#audPod')[0];
				var tototime = (porc*audio.duration)/100;
				audio.currentTime = tototime; 
			}
		});
		
		$("#audTim_control").roundSlider({
			radius: 60,
			width: 1,
			handleSize: "+10",
			handleShape: "dot",
			sliderType: "min-range",
			value: 0,
			startAngle: 90,
			start: function(e) {
				estadrag = true;
			},
			stop: function(e) {
				estadrag = false;
				var porc = e.value;
				var audio = $('#audTim')[0];
				var tototime = (porc*audio.duration)/100;
				audio.currentTime = tototime; 
			}
		});
		
		$("#audMedDiaria_control").roundSlider({
			radius: 60,
			width: 1,
			handleSize: "+10",
			handleShape: "dot",
			sliderType: "min-range",
			value: 0,
			startAngle: 90,
			start: function(e) {
				estadrag = true;
			},
			stop: function(e) {
				estadrag = false;
				var porc = e.value;
				var audio = $('#audMedDiaria')[0];
				var tototime = (porc*audio.duration)/100;
				audio.currentTime = tototime; 
			}
		});
		var altpan = $(window).height();
		$("<style type='text/css'> .contenidoApp, .ventana{ min-height: "+altpan+"px;} </style>").appendTo("head");
		
		mobiscroll.settings = {
			
			lang: 'es',   // Specify language like: lang: 'pl' or omit setting to use default
			theme: 'ios'            // Specify theme like: theme: 'ios' or omit setting to use default
		};

    },
    iniciarCont: function() {
		app.ponerAllCursos();
		app.getCuestionario();
		app.getMedIni();
		app.getMedDiaria();
		app.getPodcasts();
		app.getTimers();
		app.getCategorias();
		app.getEsfera();
		app.getMensajes();
		app.getMBSR();
    },
    initStore: function() {
		if (!window.store) {
			log('Store not available');
			return;
		}
		
		app.platform = device.platform.toLowerCase();
		document.getElementsByTagName('body')[0].className = app.platform;

		// Enable maximum logging level
		//store.verbosity = store.DEBUG;
		
		 store.validator = "https://api.fovea.cc:1982/check-purchase";

		// Inform the store of your products
		log('registerProducts');
		store.register({
			id:    'subscription1', // id without package name!
			alias: 'subscription1',
			type:  store.PAID_SUBSCRIPTION
		});
			
		store.when("product").updated(function (p) {
			app.renderIAP(p);
		});
		store.when("subscription1").approved(function(p) {
			log("verify subscription");
			p.verify();
		});
		store.when("subscription1").verified(function(p) {
			log("subscription verified");
			p.finish();
		});
		store.when("subscription1").unverified(function(p) {
			log("subscription unverified");
		});
		store.when("subscription1").updated(function(p) {
			if (p.owned) {
				document.getElementById('subscriber-info').innerHTML = 'You are a lucky subscriber!';
			}
			else {
				document.getElementById('subscriber-info').innerHTML = 'You are not subscribed';
			}
		});

		// Log all errors
		store.error(function(error) {
			log('ERROR ' + error.code + ': ' + error.message);
		});
		
		store.ready(function() {
			var el = document.getElementById("loading-indicator");
			if (el)
				el.style.display = 'none';
		});

		// When store is ready, activate the "refresh" button;
		store.ready(function() {
			var el = document.getElementById('refresh-button');
			if (el) {
				el.style.display = 'block';
				el.onclick = function(ev) {
					store.refresh();
				};
			}
		});
		store.refresh();
	},
	renderIAP: function(p) {

		var parts = p.id.split(".");
		var elId = parts[parts.length-1];

		var el = document.getElementById(elId + '-purchase');
		if (!el) return;

		if (!p.loaded) {
			el.innerHTML = '<h3>...</h3>';
		}
		else if (!p.valid) {
			el.innerHTML = '<h3>' + p.alias + ' Invalid</h3>';
		}
		else if (p.valid) {
			var html = "<h3>" + p.title + "</h3>" + "<p>" + p.description + "</p>";
			if (p.canPurchase) {
				html += "<div class='button' id='buy-" + p.id + "' productId='" + p.id + "' type='button'>" + p.price + "</div>";
			}
			el.innerHTML = html;
			if (p.canPurchase) {
				document.getElementById("buy-" + p.id).onclick = function (event) {
					var pid = this.getAttribute("productId");
					store.order(pid);
				};
			}
		}
	},
    hacerloginGoog: function(datos) {
		//~ log("VA: "+JSON.stringify(obj)); // do something useful instead of alerting
		//~ $('.hola').html('<img src="'+datos.imageurl+'"> Hola '+datos.displayname+' <div class="emailjun">('+datos.email+')</div>');
		$('.nombreuser').html('Hola '+datos.displayname);
		$('#glyphicon glyphicon-user').html(datos.displayname);
		ponerPantalla('pantalla1');
		app.iniciarCont();
		isLogin = true;
		loginData_nombre = datos.displayname;
		localStorage.setItem('loginData_nombre', loginData_nombre);
		localStorage.setItem('isLogin', isLogin);
		$('.videomin')[0].play();
	},
    hacerloginFace: function(datos) {
		
		facebookConnectPlugin.api("me/?fields=id,name,email,picture", [],
		  function onSuccess (result) {
			var datos = {};
			datos.action = 'doFacebook';
			datos.tipo = 'face';
			datos.nombre = result.name;
			datos.email = result.email;
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: apiURL,
				data: datos,
				success: function (data) {
					if(data.res) {
						
						$('.nombreuser').html('Hola '+result.name);
						$('#glyphicon glyphicon-user').html(result.name);
						ponerPantalla('pantalla1');
						app.iniciarCont();
						isLogin = true;
						loginData_nombre = result.name;
						localStorage.setItem('loginData_nombre', loginData_nombre);
						localStorage.setItem('isLogin', isLogin);
						userLogId = data.datos.ID;
						localStorage.setItem('userLogId', userLogId);
						$('.videomin')[0].play();
					} else {
						alerta(data.message);
					}
				}
			});
			  
			//~ $('.hola').html('<img src="'+result.picture.data.url+'"> Hola '+result.name+' <div class="emailjun">('+result.email+')</div>');
		$('.videomin')[0].play();
		  }, function onError (error) {
			alerta("Failed: "+JSON.stringify(error));
		  }
		);
	},
    setSession: function() {
		var datos = {};
		datos.action = 'setSession';
		datos.userid = userLogId;
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: apiURL,
			data: datos,
			success: function (data) {
				if(data.res) {
				} else {
					alerta(data.message);
				}
			}
		});
	},
    loadEstadisticas: function() {
		var datos = {};
		datos.action = 'loadEstadisticas';
		datos.userID = userLogId;
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: apiURL,
			data: datos,
			success: function (data) {
				if(data.res) {
					estadisticas = data.estadisticas;
					ponerEstadisticas();
				} else {
					alerta(data.message);
				}
			}
		});
	},
    ponerInfoHome: function() {
		var datos = {};
		datos.action = 'getInfoHome';
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: apiURL,
			data: datos,
			success: function (data) {
				if(data.res) {
					n_estadisticas = data.estadisticas;
					app.ponerCursoHome(data.cursohome.nombre, data.cursohome.etapa, data.cursohome.curso, data.cursohome.catei);
					curoreco = data.cursorecomendado.ID;
				} else {
					alerta(data.message);
				}
			}
		});
	},
    getCuestionario: function() {
		var datos = {};
		datos.action = 'getPreguntas';
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: apiURL,
			data: datos,
			success: function (data) {
				if(data.res) {
					preguntas = data.datos;
					//~ ponerPregunta();
				} else {
					alerta(data.message);
				}
			}
		});
	},
    getPodcasts: function() {
		var datos = {};
		datos.action = 'getPodcasts';
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: apiURL,
			data: datos,
			success: function (data) {
				if(data.res) {
					podcasts = data.datos;
					var podac;
					for(var i=0;i<podcasts.length;i++) {
						if(i==0) {
							$('.ultimopodcast .titPod').html(podcasts[i].nombre);
							$('.ultimopodcast .durPod').html(podcasts[i].duration);
						} else {
							podac = ''+
							'<div class="boxcast" data-pod="'+i+'">'+
							'	<div class="titPod">'+podcasts[i].nombre+'</div>'+
							'	<div class="durPod">'+podcasts[i].duration+'</div>'+
							'</div>';
							$('.todospods').append(podac);
						}	
					}
				} else {
					alerta(data.message);
				}
			}
		});
	},
    getTimers: function() {
		var datos = {};
		datos.action = 'getTimers';
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: apiURL,
			data: datos,
			success: function (data) {
				if(data.res) {
					timers = data.datos;
				} else {
					alerta(data.message);
				}
			}
		});
	},
    getCategorias: function() {
		var datos = {};
		datos.action = 'getCategorias';
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: apiURL,
			data: datos,
			success: function (data) {
				if(data.res) {
					categorias = data.datos;
					app.ponerInfoHome();
					var podac;
					for(var i=0;i<categorias.length;i++) {
						podac = ''+
						'<div class="boxcate" onclick="app.ponerCursos('+i+','+categorias[i].ID+');" style="'+categorias[i].codigo+'" data-cate="'+i+'">'+
						'	<div class="titCate">'+categorias[i].nombre+'</div>'+
						'</div>';
						$('.categoriascur').append(podac);
					}
				} else {
					alerta(data.message);
				}
			}
		});
	},
    ponerAllCursos: function() {
		var datos = {};
		datos.action = 'getCursos';
		datos.catid = 0;
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: apiURL,
			data: datos,
			success: function (data) {
				if(data.res) {
					allcursos = data.cursos;
					cursos = data.cursos;
				} else {
					alerta(data.message);
				}
			}
		});
	},
    ponerCursos: function(posc, catid) {
		var datos = {};
		datos.action = 'getCursos';
		datos.catid = catid;
		$('.tituloCat').html(categorias[posc].nombre);
		$('.descripcionCat').html(categorias[posc].descripcion);
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: apiURL,
			data: datos,
			success: function (data) {
				if(data.res) {
					ponerPantalla('pantalla13');
					$('#pantalla13').attr('style',categorias[posc].codigo);
					$('#pantalla14').attr('style',categorias[posc].codigo);
					cursos = data.cursos;
					var podac;
					$('.listcursos').html('');
					for(var i=0;i<cursos.length;i++) {
						podac = ''+
						'<div class="boxcatex" onclick="app.ponerCurso('+i+','+posc+','+cursos[i].ID+');" data-cur="'+i+'">'+
						'	<div class="titCate">'+cursos[i].nombre+'</div>'+
						'	<div class="descCate" style="color:#'+categorias[posc].color+'">'+cursos[i].descripcion+'</div>'+
						'</div>';
						$('.listcursos').append(podac);
					}
					clases = data.clases;
					var podac;
					$('.listclasesind').html('');
					for(var i=0;i<clases.length;i++) {
						podac = ''+
						'<div class="boxcate" onclick="app.ponerClaseInd('+i+','+posc+','+clases[i].ID+');" data-cur="'+i+'">'+
						'	<div class="titCate">'+clases[i].nombre+'</div>'+
						'</div>';
						$('.listclasesind').append(podac);
					}
					$('#pantalla13 .boxcatex .titCate').attr('style',categorias[posc].codigo);
					$('#pantalla13 .listclasesind .boxcate').attr('style',categorias[posc].codigo);
					$('#pantalla14 .boxcatex').attr('style',categorias[posc].codigo);
					$('#pantalla14 .tituloCurso').attr('style',categorias[posc].codigo);
				} else {
					alerta(data.message);
				}
			}
		});
	},
    ponerCurso: function(posc, posci, curid) {
		var datos = {};
		datos.action = 'getCurso';
		datos.curid = curid;
		$('.tituloCurso .titcur').html(cursos[posc].nombre);
		$('.tituloCurso .descur').html(cursos[posc].descripcion);
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: apiURL,
			data: datos,
			success: function (data) {
				if(data.res) {
					ponerPantalla('pantalla14');
					etapas = data.etapas;
					var podac;
					$('.listetapas .contesli').html('');
					for(var i=0;i<etapas.length;i++) {
						podac = ''+
						'<div class="boxcate item">'+
						'	<div class="titEtapa">'+etapas[i].nombre_etapa+'</div>'+
						'	<div class="clasesEtapa">'+
						'		<div class="listclases">';
						for(var j=0;j<etapas[i].clases.length;j++) {
							var claseTom = (inArray(etapas[i].clases[j].ID, estadisticas.clases_c))?'':' activo';
							podac += ''+
							'		<div class="curItemComp'+claseTom+'" onclick="app.ponerClase('+j+','+i+','+etapas[i].clases[j].ID+', '+posci+');" data-clase="'+j+'">'+
							'			<div class="circItemA">'+
							'				<div class="circItemB"><img src="img/check.png"></div>'+
							'			</div>'+
							'			<div class="numIteCu">'+(j+1)+'</div>'+
							'		</div>';
						}
						podac += ''+
						'		</div>'+
						'	</div>'+
						'</div>'+
						'</div>';
						$('.listetapas .contesli').append(podac);
						$('#pantalla14 .listetapas .boxcate').attr('style',categorias[posci].codigo);
						$('#pantalla14 .listetapas .curItemComp .circItemA').attr('style',categorias[posci].codigo);
						$('#pantalla14 .listetapas .curItemComp .circItemB').attr('style',categorias[posci].codigo);
					}
					
						
					//~ owl1 = $('.owl-carousel1');
					//~ owl1.owlCarousel({
						//~ loop:true,
						//~ margin:0,
						//~ responsiveClass:true,
						//~ pagination: false,dots: false,
						//~ responsive:{
							//~ 0:{
								//~ items:1,
								//~ nav:false,
								//~ false:false
							//~ },
							//~ 600:{
								//~ items:2,
								//~ nav:false,
								//~ false:false
							//~ }
						//~ }
					//~ });
				} else {
					alerta(data.message);
				}
			}
		});
	},
    ponerCursoHome: function(nonmbrecur, etapa, curid, catei) {
		var datos = {};
		datos.action = 'getCurso';
		datos.curid = curid;
		var posci=0;
		for(var k=0;k<categorias.length;k++) {
			if(categorias[k].ID==catei) {
				posci = k;
			}
		}
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: apiURL,
			data: datos,
			success: function (data) {
				if(data.res) {
					var n_etapas = data.etapas;
					etapas = data.etapas;
					var podac;
					$('.listetapas .contesli').html('');
					for(var i=0;i<n_etapas.length;i++) {
						if(n_etapas[i].ID==etapa) {
							podac = ''+
							'	<div class="ultimoCursosTit">'+nonmbrecur+' • '+n_etapas[i].nombre_etapa+'</div>'+
							'	<div class="ultimoCursosSubTit">Última práctica</div>'+
							'	<div class="clasesEtapa">'+
							'		<div class="listclases">';
							for(var j=0;j<n_etapas[i].clases.length;j++) {
								var claseTom = (inArray(n_etapas[i].clases[j].ID, n_estadisticas.clases_c))?'':' activo';
								podac += ''+
								'		<div class="curItemComp'+claseTom+'" onclick="app.ponerClase('+j+','+i+','+n_etapas[i].clases[j].ID+', '+posci+');" data-clase="'+j+'">'+
								'			<div class="circItemA">'+
								'				<div class="circItemB"><img src="img/check.png"></div>'+
								'			</div>'+
								'			<div class="numIteCu">'+(j+1)+'</div>'+
								'		</div>';
							}
							podac += ''+
							'		</div>'+
							'	</div>';
							$('.tituCurAct').html(podac);
						}
					}
				} else {
					alerta(data.message);
				}
			}
		});
	},
    ponerEtapa: function(posc, curid) {
		var datos = {};
		
		$('.tituloEtapa').html(etapas[posc].nombre_etapa);
		
		ponerPantalla('pantalla15');
		var podac;
		$('.listclases').html('');
		for(var i=0;i<etapas[posc].clases.length;i++) {
			podac = ''+
			'<div class="boxcate" onclick="app.ponerClase('+i+','+posc+','+etapas[posc].clases[i].ID+');" data-clase="'+i+'">'+
			'	<div class="titClase">'+etapas[posc].clases[i].nombre_clase+'</div>'+
			'</div>';
			$('.listclases').append(podac);
		}
	},
    ponerClase: function(i, posc, curid, posci) {
		$('.tituloClase').html(etapas[posc].clases[i].nombre_clase);
		$('.descripcionClase').html(etapas[posc].clases[i].descripcion);
		ponerPantalla('pantalla16');
		$('#audiosclase').html('');
		$('#tiempoclase').html('');
		
		cur_i=i;
		cur_posc=posc;
		cur_curid=curid;
		for(var k=0;k<etapas[posc].clases[i].archivos.length;k++) {
			//~ $('#audiosclase').append('<div class="btnGenerico btnViole" onclick="app.ponerClaseAudio('+k+','+i+','+posc+','+curid+');" data-cur="'+i+'">'+etapas[posc].clases[i].archivos[k].duracion+'</div>');
			$('#tiempoclase').append('<option value="'+k+'">'+etapas[posc].clases[i].archivos[k].duracion+'</option>');
		}
		$('#tiempoclase').mobiscroll().select({
            display: 'inline',  // Specify display mode like: display: 'bottom' or omit setting to use default
            showInput: false    // More info about showInput: https://docs.mobiscroll.com/4-7-3/select#opt-showInput
        });
		$('#pantalla16').attr('style',$('#pantalla16').attr('style')+categorias[posci].codigo);
		$('#pantalla16').attr('style',$('#pantalla16').attr('style')+categorias[posci].codigo);
		$('#pantalla16 .viole').attr('style', categorias[posci].codigo);
		$('#pantalla16 .bolita').attr('style', categorias[posci].codigo);
		$('#audiosclase .btnGenerico').attr('style',categorias[posci].codigo);
	},
    ponerClase2: function(j, i, claid, i2) {
		$('.tituloClase2').html(mbsr_cont.semanas[i].clases[j].nombre_clase);
		ponerPantalla('pantalla12d');
		datosClase.audio_ID = mbsr_cont.semanas[i].clases[j].ID;
		registroClase = false;
		$('#uad_MBSR').html('<source src="'+baseURL+mbsr_cont.semanas[i].clases[j].file_clase+'" type="audio/mpeg">Su navegador no sorporta audio HTML5');
		$('#uad_MBSR')[0].pause();
		$('#uad_MBSR')[0].load();
	},
    ponerAudioFile: function(k) {
		app.ponerClaseAudio(k,cur_i,cur_posc,cur_curid);
	},
    ponerClaseAudio: function(k,i, posc, curid) {
		$('.tituloClase').html(etapas[posc].clases[i].nombre_clase);
		//~ ponerPantalla('pantalla17');
		datosClase.audio_ID = etapas[posc].clases[i].archivos[k].ID;
		registroClase = false;
		$('#audClaseP').html('<source src="'+baseURL+etapas[posc].clases[i].archivos[k].file_clase+'" type="audio/mpeg">Su navegador no sorporta audio HTML5');
		$('#audClaseP')[0].pause();
		$('#audClaseP')[0].load();
	},
    ponerTimer: function(dura) {
		var length = timers.length;
		for(var i = 0; i < length; i++) {
			if(timers[i]['tipo'] == dura && timers[i]['nombre']==timerac) {
				ponerPantalla('pantalla6b');
				$('.titSeccionSubT').html(timerac+' - '+dura+' minutos');
				$('#audTim').html('<source src="'+baseURL+timers[i]['archivo']+'" type="audio/mpeg">Su navegador no sorporta audio HTML5');
				$('#audTim')[0].pause();
				$('#audTim')[0].load();
			}
		}
	},
    getMedIni: function() {
		var datos = {};
		datos.action = 'getMedIni';
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: apiURL,
			data: datos,
			success: function (data) {
				if(data.res) {
					var podnaco = '';
					for(var j=0;j<data.clases;j++) {
						var claseTom = (j==0)?'':' activo';
						podnaco += ''+
						'		<div class="curItemComp'+claseTom+'" >'+
						'			<div class="circItemA violet">'+
						'				<div class="circItemB violet"><img src="img/check.png"></div>'+
						'			</div>'+
						'			<div class="numIteCu violet">'+(j+1)+'</div>'+
						'		</div>';
					}
					$('.contClasesmedini').html(podnaco);
					
					$('#med_ini').html('<source src="'+baseURL+data.datos.file_clase+'" type="audio/mpeg">Su navegador no sorporta audio HTML5');
				} else {
					alerta(data.message);
				}
			}
		});
	},
    getMedDiaria: function() {
		var datos = {};
		datos.action = 'getMedDiaria';
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: apiURL,
			data: datos,
			success: function (data) {
				if(data.res) {
					$('#diameddia').html(data.datos.dia);
					meditadiraria = data.datos.ID;
					$('#audMedDiaria').html('<source src="'+baseURL+data.datos.archivo+'" type="audio/mpeg">Su navegador no sorporta audio HTML5');
				} else {
					alerta(data.message);
				}
			}
		});
	},
    getEsfera: function() {
		var datos = {};
		datos.action = 'getEsfera';
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: apiURL,
			data: datos,
			success: function (data) {
				if(data.res) {
					$('#audEsfera').html('<source src="'+baseURL+data.datos.archivo+'" type="audio/mpeg">Su navegador no sorporta audio HTML5');
				} else {
					alerta(data.message);
				}
			}
		});
	},
    getMensajes: function() {
		var datos = {};
		datos.action = 'getMensajes';
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: apiURL,
			data: datos,
			success: function (data) {
				if(data.res) {
					mensajes_app = data.datos;
					$('#mensajeFinenc').html(getTexto('final_encuesta'));
					$('#mensajeInimed').html(getTexto('meditacion_inicial'));
					$('#sub_boton_resp').html(getTexto('sub_boton_resp'));
					$('#sub_boton_med').html(getTexto('sub_boton_med'));
				} else {
					alerta(data.message);
				}
			}
		});
	},
    getMBSR: function() {
		var datos = {};
		datos.action = 'getMBSRCont';
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: apiURL,
			data: datos,
			success: function (data) {
				if(data.res) {
					mbsr_cont = data.datos;
					var splitted = mbsr_cont['descripcion'].split("\n");
					$('.text_mb_1').html(splitted[0]);
					$('.text_mb_2').html(splitted[1]).css({'opacity':'0'});
					
					var podac;
					$('.listetapas .contesli2').html('');
					for(var i=0;i<mbsr_cont.semanas.length;i++) {
						podac = ''+
						'<div class="boxcate">'+
						'	<div class="titEtapa">'+mbsr_cont.semanas[i].nombre_etapa+'</div>'+
						'	<div class="clasesEtapa">'+
						'		<div class="listclases">';
						for(var j=0;j<mbsr_cont.semanas[i].clases.length;j++) {
							var claseTom = ' activo';
							var claseTom = (inArray(mbsr_cont.semanas[i].clases[j].ID, estadisticas.mbsr_c))?'':' activo';
							podac += ''+
							'		<div class="curItemComp'+claseTom+'" onclick="app.ponerClase2('+j+','+i+','+mbsr_cont.semanas[i].clases[j].ID+', '+i+');" data-clase="'+j+'">'+
							'			<div class="circItemA">'+
							'				<div class="circItemB"><img src="img/check.png"></div>'+
							'			</div>'+
							'			<div class="numIteCu">'+(j+1)+'</div>'+
							'		</div>';
						}
						podac += ''+
						'		</div>'+
						'	</div>'+
						'</div>'+
						'</div>';
						$('.listetapas .contesli2').append(podac);
					}
				} else {
					alerta(data.message);
				}
			}
		});
	},
    savePushToken: function() {
		var datos = {};
		datos.action = 'saveToken';
		datos.userID = localStorage.getItem('userLogId');
		datos.token = localStorage.getItem('registrationId');
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: apiURL,
			data: datos,
			success: function (data) {
				if(data.res) {
				} else {
				}
			}
		});
	},
    setupPush: function() {
        var push = PushNotification.init({
            "android": {
                "senderID": "106600278326"
            },
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true
            }
        });

        push.on('registration', function(data) {
            //~ alert('registro de Token push: ' + data.registrationId);

            var oldRegId = localStorage.getItem('registrationId');
            if (oldRegId !== data.registrationId) {
                // Save new registration ID
                localStorage.setItem('registrationId', data.registrationId);
            }
            
        });

        push.on('error', function(e) {
            console.log("push error = " + e.message);
        });

        push.on('notification', function(data) {
            console.log('notification event');
            navigator.notification.alert(
                data.message,         // message
                null,                 // callback
                data.title,           // title
                'Ok'                  // buttonName
            );
       });
    }
};
var preguntas;
var podcasts;
var timers;
var categorias;
var cursos;
var allcursos;
var clases;
var etapas;
var meditadiraria;
var mensajes_app;
var mbsr_cont;
var estadisticas;
var preguntaAct = 0;
var meditacionediarias;
var n_estadisticas;
var curoreco;
var owl1;
function log(arg) { app.log(arg); }

// log both in the console and in the HTML #log element.
app.log = function(arg) {
    try {
        if (typeof arg !== 'string')
            arg = JSON.stringify(arg);
        console.log(arg);
        document.getElementById('log').innerHTML += '<div>' + arg + '</div>';
    } catch (e) {}
};

// make sure fn will be called with app as 'this'
app.bind = function(fn) {
    return function() {
        fn.call(app, arguments);
    };
};

function ponerSigPreg() {
	if(preguntaAct<preguntas.length) {
		ponerPregunta();
	} else {
		ponerPantalla('pantalla2b');
	}
}

function ponerEstadisticas() {
	var conte = ''+
	'<div class="estdis"><b>Tiempo meditado:</b> <span class="numgig">'+secondsToHms(estadisticas.duracion*60)+' </span></div>'+
	'<div class="estdis"><b>Días desde que no meditas:</b> <span class="numgig">'+estadisticas.dias+' </span></div>'+
	'<div class="estdis"><b>Clases tomadas:</b> <span class="numgig">'+estadisticas.clases+'</span></div>'+
	'<div class="estdis"><b>Meditaciones diarias:</b> <span class="numgig">'+estadisticas.meditaciones+'</span></div>'+
	'<div class="estdis"><b>Cursos completados:</b> <span class="numgig">0</span></div>';
	$('.boxEstadisticas').html(conte);
}
function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? "" : "") : "00";
    var mDisplay = m > 0 ? m + (m == 1 ? "" : "") : "00";
    var sDisplay = s > 0 ? s + (s == 1 ? "" : "") : "00";
    return hDisplay+':'+mDisplay; 
}

function ponerPregunta() {
	$('#pregunta').html(preguntas[preguntaAct].pregunta).css({'opacity':0});
	$('#resp_1').html(preguntas[preguntaAct].respuesta1).css({'opacity':0});
	$('#resp_2').html(preguntas[preguntaAct].respuesta2).css({'opacity':0});
		
	if(preguntas[preguntaAct].respuesta3=="") {
		$('#resp_3').hide();
	}
	if(preguntas[preguntaAct].respuesta4=="") {
		$('#resp_4').hide();
	}
	$('#resp_3').html(preguntas[preguntaAct].respuesta3).css({'opacity':0});
	$('#resp_4').html(preguntas[preguntaAct].respuesta4).css({'opacity':0});
	$('#pregunta').delay(300).animate({
		opacity: 1
		}, 300, function() {
			$('#resp_1').animate({
				opacity: 1
				}, 300, function() {
					$('#resp_2').animate({
						opacity: 1
						}, 300, function() {
							if(preguntas[preguntaAct].respuesta3!="") {
								$('#resp_3').animate({
									opacity: 1
									}, 300, function() {
										if(preguntas[preguntaAct].respuesta4!="") {
											$('#resp_4').animate({
												opacity: 1
											}, 300);
										}
								});
							}
					});
			});
	});
	$('.paso').html((preguntaAct+1)+' / '+preguntas.length);
}

function sacarSplash() {
	$('.splashscreen').fadeOut( 600, function() {
        if(isLoginSave) {
			setTimeout(function() {
				$('.videomin')[0].play();
			}, 700);
		}
		$('.splashscreen').remove();
		$('.contenidoApp').removeClass('hidden');
		$('.contenidoApp').fadeIn(600);
	});
}

function ponerPod(num) {
	$('#nomrepod').html(podcasts[num].nombre);
	 var audio = $("#audPod");      
    $("#podsour").attr("src", baseURL+podcasts[num].archivo);
	$('#audPod').html('<source src="'+baseURL+podcasts[num].archivo+'"  id="podsour" type="audio/mpeg">Su navegador no sorporta audio HTML5');
	ponerPantalla('pantalla8b');
    audio[0].pause();
    audio[0].load();
    //audio[0].play(); changed based on Sprachprofi's comment below
    //~ audio[0].oncanplaythrough = audio[0].play();
}

function alerta(msj) {
	$('#alerta').fadeOut(1);
	$('#alertatxt').html(msj);
	$('#alerta').fadeIn( 600);
	$('#alerta').removeClass('hidden');
}

function ponerPantalla(cual) {
	$('.ventana.activa').fadeOut( 600, function() {
		if(cual!='pantalla14') {
			$('#pantalla14').addClass('hidden');
		}
		$('.ventana.activa').removeClass('activa');
		$('.ventana.activa').addClass('hidden');
		$('#'+cual).removeClass('hidden');
		$('#'+cual).addClass('activa');
		$('#'+cual).fadeIn(600);
		if(cual=='pantalla2') {
			ponerPregunta();
		}
		
		$("#audPod")[0].pause();   
		$('#med_ini')[0].pause();
		$('#audTim')[0].pause();
		$('#audEsfera')[0].pause();
		$('#audMedDiaria')[0].pause();
		$('#audClaseP')[0].pause();
		$('#uad_MBSR')[0].pause();
		$('#audPod')[0].pause();
	});
}

function sacarAlerta() {
	$('#alerta').fadeOut( 600, function() {
		$('#alerta').addClass('hidden');
	});
}
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

var meddiaria = document.getElementById("audMedDiaria");
meddiaria.onplaying = function() {
	var datos = {};
	datos.action = 'saveMeditacion';
	datos.meditacion_ID = meditadiraria;
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: apiURL,
		data: datos,
		success: function (data) {
			estadisticas = data.estadisticas;
			ponerEstadisticas();
		}
	});
};
function registrarAudioComp(datos) {
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: apiURL,
		data: datos,
		success: function (data) {
			estadisticas = data.estadisticas;
			ponerEstadisticas();
		}
	});
};
var datosClase = {};
var isplay = false;
var isLogin = false;
var med_ini = document.getElementById("med_ini")
var audEsfera = document.getElementById("audEsfera")
var audTim = document.getElementById("audTim")
var audPod = document.getElementById("audPod")
var audClaseP = document.getElementById("audClaseP")
var uad_MBSR = document.getElementById("uad_MBSR")
var audMedDiaria = document.getElementById("audMedDiaria")
var estaplay = false

med_ini.addEventListener('loadedmetadata', function() {
  var duration = med_ini.duration
  var currentTime = med_ini.currentTime
});

audEsfera.addEventListener('loadedmetadata', function() {
  var duration = audEsfera.duration
  var currentTime = audEsfera.currentTime
});

audTim.addEventListener('loadedmetadata', function() {
  var duration = audTim.duration
  var currentTime = audTim.currentTime
});

audPod.addEventListener('loadedmetadata', function() {
  var duration = audPod.duration
  var currentTime = audPod.currentTime
});

audClaseP.addEventListener('loadedmetadata', function() {
  var duration = audClaseP.duration
  var currentTime = audClaseP.currentTime
});

uad_MBSR.addEventListener('loadedmetadata', function() {
  var duration = uad_MBSR.duration
  var currentTime = uad_MBSR.currentTime
});

function togglePlaying(cual) {
  var method
  var audi = document.getElementById(cual)
  
	if (!estaplay) {
		$('.btnPlayMed.ct_'+cual+' .circsma').html('<i class="glyphicon glyphicon-pause"></i>');
		estaplay = true
		method = 'play'
	} else {
		$('.btnPlayMed.ct_'+cual+' .circsma').html('<i class="glyphicon glyphicon-play"></i>');
		estaplay = false
		method = 'pause'
	}

	audi[method]()

}

var registroClase = false;
function updateBar(cual) {
	var audi = document.getElementById(cual)
	var currentTime = audi.currentTime
	var duration = audi.duration

	if (currentTime === duration) {
		estaplay = true
	}
	var percentage = currentTime / duration;
	if(percentage>0.95) {
		var datos = {};
		if(cual=="audClaseP") {
			if(!registroClase) {
				datos.action = 'saveClase';
				datos.clase_ID = datosClase.audio_ID;
				registrarAudioComp(datos);
				registroClase = true;
			}
		}
		if(cual=="uad_MBSR") {
			if(!registroClase) {
				datos.action = 'saveClase2';
				datos.clase_ID = datosClase.audio_ID;
				registrarAudioComp(datos);
				registroClase = true;
			}
		}
		if(cual=="med_ini") {
			if(!registroClase) {
				datos.action = 'saveClase';
				datos.clase_ID = 84; //claase 1 de iniciales
				registrarAudioComp(datos);
				registroClase = true;
			}
		}
		if(percentage>0.99) {
			if(cual=="med_ini") {
				ponerPantalla('pantalla3b');
			}
		}
	}
	if(!estadrag) {
		$("#"+cual+"_control").roundSlider("setValue", (Math.round(percentage*100)), 1);
	}
  $('.audioBorde.circle.ab_'+cual).circleProgress({
    value: (percentage).toFixed(2),
    animation: false,
    size: 120,
    startAngle: -Math.PI/2,
    thickness: 1,
    fill: {color: "#FFFFFF"}
  });
  
  //~ document.getElementById("current-time").innerHTML = convertElapsedTime(currentTime)
  
}

var estadrag = false;

function convertElapsedTime(inputSeconds) {
  var seconds = Math.floor(inputSeconds % 60)
  if (seconds < 10) {
    seconds = "0" + seconds
  }
  var minutes = Math.floor(inputSeconds / 60)
  return minutes + ":" + seconds
}

function getTexto(clave) {
	var resu = '';
	for(var i=0;i<mensajes_app.length;i++) {
		if(mensajes_app[i].clave==clave) {
			resu = mensajes_app[i].texto;
		}
	}
	return resu;
}

function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

document.addEventListener("backbutton", function(e){
	e.preventDefault();
    //~ if($.mobile.activePage.is('#homepage')){
        //~ navigator.app.exitApp();
    //~ } else {
        //~ navigator.app.backHistory()
    //~ }
    if(isLogin) {
	    ponerPantalla('pantalla5');
	}
}, false);


var touchStartCoords =  {'x':-1, 'y':-1}, // X and Y coordinates on mousedown or touchstart events.
    touchEndCoords = {'x':-1, 'y':-1},// X and Y coordinates on mouseup or touchend events.
    direction = 'undefined',// Swipe direction
    minDistanceXAxis = 30,// Min distance on mousemove or touchmove on the X axis
    maxDistanceYAxis = 30,// Max distance on mousemove or touchmove on the Y axis
    maxAllowedTime = 1000,// Max allowed time between swipeStart and swipeEnd
    startTime = 0,// Time on swipeStart
    elapsedTime = 0,// Elapsed time between swipeStart and swipeEnd
    itemmbs = 0,
    targetElement = document.getElementById('boxcuponre');// Element to delegate

function swipeStart(e) {
  e = e ? e : window.event;
  e = ('changedTouches' in e)?e.changedTouches[0] : e;
  touchStartCoords = {'x':e.pageX, 'y':e.pageY};
  startTime = new Date().getTime();
  //~ targetElement.textContent = " ";
}

function swipeMove(e){
  e = e ? e : window.event;
  e.preventDefault();
}

function swipeEnd(e) {
  e = e ? e : window.event;
  e = ('changedTouches' in e)?e.changedTouches[0] : e;
  touchEndCoords = {'x':e.pageX - touchStartCoords.x, 'y':e.pageY - touchStartCoords.y};
  elapsedTime = new Date().getTime() - startTime;
  if (elapsedTime <= maxAllowedTime){
    if (Math.abs(touchEndCoords.x) >= minDistanceXAxis && Math.abs(touchEndCoords.y) <= maxDistanceYAxis){
      direction = (touchEndCoords.x < 0)? 'left' : 'right';
      switch(direction){
        case 'left':
          //~ targetElement.textContent = "Left swipe detected";
			if(itemmbs<1) {
				itemmbs++;
				$('.text_mb_1').animate({opacity:0}, 300, function() {
					$('.text_mb_2').animate({opacity:1}, 300, function() {
						$('#elotro').addClass('activo');
					});
				});
			} else {
				if($('#nomostrarmbsrintro').prop("checked")) {
					localStorage.setItem('sinintrombsr', true);
					sinintrombsr = true;
				}
				ponerPantalla('pantalla12b');
			}
          break;
        case 'right':
			if(itemmbs>0) {
				itemmbs--;
				$('.text_mb_2').animate({opacity:0}, 300, function() {
					$('.text_mb_1').animate({opacity:1}, 300, function() {
						$('#elotro').removeClass('activo');
					});
				});
			} 
          break;
      }
    }
  }
}

function addMultipleListeners(el, s, fn) {
  var evts = s.split(' ');
  for (var i=0, iLen=evts.length; i<iLen; i++) {
    el.addEventListener(evts[i], fn, false);
  }
}

addMultipleListeners(targetElement, 'mousedown touchstart', swipeStart);
addMultipleListeners(targetElement, 'mousemove touchmove', swipeMove);
addMultipleListeners(targetElement, 'mouseup touchend', swipeEnd);


var onSuccess = function(result) {
  console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
  console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
}

var onError = function(msg) {
  console.log("Sharing failed with message: " + msg);
}

function compartirEnlace() {
	var options = {
	  message: 'Tranqui', // not supported on some apps (Facebook, Instagram)
	  subject: 'Tranqui', // fi. for email
	  url: 'https://www.tranqui.com/',
	  chooserTitle: 'Tranqui' // Android only, you can override the default share sheet title
	}
	window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
}

