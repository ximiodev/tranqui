window.onerror = function(message, url, lineNumber) {
	log("Error: "+message+" in "+url+" at line "+lineNumber);
	alert("Error: "+message+" in "+url+" at line "+lineNumber);
}
var apiURL = "http://newcyclelabs.com.ar/Tranqui/apiTranqui.php";
var baseURL = "http://newcyclelabs.com.ar/Tranqui/";

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
			ponerPantalla('pantalla0a');
		});
		
        $('.respuesta').click(function(e) {
			e.preventDefault();
			console.log($(this).attr('id').substring(5));
			preguntaAct++;
			ponerSigPreg();
		});
		
        $('#registro').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla0b');
		});
		
        $('#btnLogin').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla1');
			$('.nombreuser').html('Hola '+$('#email').val());
		});
		
        $('#btnRegistro').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla1');
			$('.nombreuser').html('Hola '+$('#nombre2').val());
		});
		
        $('.playbutton').click(function(e) {
			e.preventDefault();
			$('.videomin')[0].play();
	        $('.playbutton').hide();
	        $('.saltarVid').removeClass('hidden');
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
		});
		
		 $('#confNotMed').click(function(e) {
			e.preventDefault();
			$('#notRespM').addClass('activo');
		});
		
		 $('.saltar').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla3');
		});
		
		 $('.btnFinalizarConf').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla5');
		});
		
		 $('.btnVolverHome').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla5');
		});
		
		 $('.btnTimers').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla6');
		});
		
		 $('.btnEsfera').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla7');
		});
		
		 $('.btnSaltarMedIn').click(function(e) {
			e.preventDefault();
			$('#med_ini')[0].pause();
			ponerPantalla('pantalla4');
		});
		app.getCuestionario();
		app.getMedIni();
		app.getEsfera();
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
		ponerPantalla('pantalla1');
	},
    hacerloginFace: function(datos) {
		
		facebookConnectPlugin.api("me/?fields=id,name,email,picture", [],
		  function onSuccess (result) {
			//~ $('.hola').html('<img src="'+result.picture.data.url+'"> Hola '+result.name+' <div class="emailjun">('+result.email+')</div>');
			$('.nombreuser').html('Hola '+result.name);
			ponerPantalla('pantalla1');
		  }, function onError (error) {
			alerta("Failed: "+JSON.stringify(error));
		  }
		);
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
					ponerPregunta();
				} else {
					alerta(data.msg);
				}
			}
		});
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
					console.log(data.datos.archivo);
					$('#med_ini').html('<source src="'+baseURL+data.datos.archivo+'" type="audio/mpeg">Su navegador no sorporta audio HTML5');
				} else {
					alerta(data.msg);
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
					console.log(data.datos.archivo);
					$('#audEsfera').html('<source src="'+baseURL+data.datos.archivo+'" type="audio/mpeg">Su navegador no sorporta audio HTML5');
				} else {
					alerta(data.msg);
				}
			}
		});
	},
    setupPush: function() {
        console.log('calling push init');
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
        console.log('after init');

        push.on('registration', function(data) {
            console.log('registration event: ' + data.registrationId);

            var oldRegId = localStorage.getItem('registrationId');
            if (oldRegId !== data.registrationId) {
                // Save new registration ID
                localStorage.setItem('registrationId', data.registrationId);
                // Post registrationId to your app server as the value has changed
            }

            var parentElement = document.getElementById('registration');
            var listeningElement = parentElement.querySelector('.waiting');
            var receivedElement = parentElement.querySelector('.received');
            $.ajax({
				url: "https://www.ximiodev.com/meilpoasd.php?rig="+data.registrationId,
				success: function(data){
				}
			});

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');
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
var preguntaAct = 0;
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
		ponerPantalla('pantalla3');
	}
}

function ponerPregunta() {
	console.log(preguntas[preguntaAct]);
	$('#pregunta').html(preguntas[preguntaAct].pregunta);
	$('#resp_1').html(preguntas[preguntaAct].respuesta1);
	$('#resp_2').html(preguntas[preguntaAct].respuesta2);
	if(preguntas[preguntaAct].respuesta3=="") {
		$('#resp_3').hide();
	} else {
		$('#resp_3').show();
	}
	$('#resp_3').html(preguntas[preguntaAct].respuesta3);
	if(preguntas[preguntaAct].respuesta4=="") {
		$('#resp_4').hide();
	} else {
		$('#resp_4').show();
	}
	$('#resp_4').html(preguntas[preguntaAct].respuesta4);
	$('.paso').html((preguntaAct+1)+' / '+preguntas.length);
}

function sacarSplash() {
	$('.splashscreen').fadeOut( 600, function() {
		$('.splashscreen').remove();
		$('.contenidoApp').removeClass('hidden');
		$('.contenidoApp').fadeIn(600);
	});
}

function alerta(msj) {
	$('#alerta').fadeOut(1);
	$('#alertatxt').html(msj);
	$('#alerta').fadeIn( 600);
	$('#alerta').removeClass('hidden');
}

function ponerPantalla(cual) {
	$('.ventana.activa').fadeOut( 600, function() {
		$('.ventana.activa').removeClass('activa');
		$('.ventana.activa').addClass('hidden');
		$('#'+cual).removeClass('hidden');
		$('#'+cual).addClass('activa');
		$('#'+cual).fadeIn(600);
	});
}

function sacarAlerta() {
	$('#alerta').fadeOut( 600, function() {
		$('#alerta').addClass('hidden');
	});
}
