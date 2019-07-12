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
			$('#glyphicon glyphicon-user').html($('#email').val());
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
			$('#glyphicon glyphicon-user').html($('#email2').val());
			ponerPantalla('pantalla0b');
		});
		
        $('#btnLogin').click(function(e) {
			e.preventDefault();
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
						estadisticas = data.estadisticas;
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
		
        $('.playbutton').click(function(e) {
			e.preventDefault();
			$('.videomin')[0].play();
	        $('.playbutton').hide();
	        $('.saltarVid').removeClass('hidden');
		});
		
		 $('.btnVolverapa').click(function(e) {
			e.preventDefault();
			var donde = $(this).data('apa');
			if(donde=='pantalla15') {
				$('#audClaseP')[0].pause();
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
		
		 $('#pantalla10 .btnVolverHome').click(function(e) {
			e.preventDefault();
			$('#audMedDiaria')[0].pause();
		});
		
		 $('.btnHome').click(function(e) {
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
		
		 $('.btnPodcasts').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla8');
		});
		
		 $('.btnLibreria').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla9');
		});
		
		 $('.btnMedDiaria').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla10');
		});
		
		 $('.btnUser').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla11');
		});
		
		 $('.btnMSBR').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla12');
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
		
		 $('.btnPlayMed').click(function(e) {
			e.preventDefault();
			if(isplay) {
				$('#med_ini')[0].pause();
				isplay = false;
			} else {
				$('#med_ini')[0].play();
				isplay = true;
			}
		});
		
		 $('.btnSaltarMedIn').click(function(e) {
			e.preventDefault();
			$('#med_ini')[0].pause();
			ponerPantalla('pantalla4');
		});
		app.getCuestionario();
		app.getMedIni();
		app.getMedDiaria();
		app.getPodcasts();
		app.getCategorias();
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
		$('#glyphicon glyphicon-user').html(datos.displayname);
		ponerPantalla('pantalla1');
	},
    hacerloginFace: function(datos) {
		
		facebookConnectPlugin.api("me/?fields=id,name,email,picture", [],
		  function onSuccess (result) {
			//~ $('.hola').html('<img src="'+result.picture.data.url+'"> Hola '+result.name+' <div class="emailjun">('+result.email+')</div>');
			$('.nombreuser').html('Hola '+result.name);
			$('#glyphicon glyphicon-user').html(result.name);
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
					alerta(data.msg);
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
					var podac;
					for(var i=0;i<categorias.length;i++) {
						podac = ''+
						'<div class="boxcate" onclick="app.ponerCursos('+i+','+categorias[i].ID+');" style="'+categorias[i].codigo+'" data-cate="'+i+'">'+
						'	<div class="titCate">'+categorias[i].nombre+'</div>'+
						'</div>';
						$('.categoriascur').append(podac);
					}
				} else {
					alerta(data.msg);
				}
			}
		});
	},
    ponerCursos: function(posc, catid) {
		var datos = {};
		datos.action = 'getCursos';
		datos.catid = catid;
		$('.tituloCat').html(categorias[posc].nombre);
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: apiURL,
			data: datos,
			success: function (data) {
				if(data.res) {
					ponerPantalla('pantalla13');
					cursos = data.cursos;
					var podac;
					$('.listcursos').html('');
					for(var i=0;i<cursos.length;i++) {
						podac = ''+
						'<div class="boxcate" onclick="app.ponerCurso('+i+','+cursos[i].ID+');" data-cur="'+i+'">'+
						'	<div class="titCate">'+cursos[i].nombre+'</div>'+
						'</div>';
						$('.listcursos').append(podac);
					}
					clases = data.clases;
					var podac;
					$('.listclasesind').html('');
					for(var i=0;i<clases.length;i++) {
						podac = ''+
						'<div class="boxcate" onclick="app.ponerClaseInd('+i+','+clases[i].ID+');" data-cur="'+i+'">'+
						'	<div class="titCate">'+clases[i].nombre+'</div>'+
						'</div>';
						$('.listclasesind').append(podac);
					}
				} else {
					alerta(data.msg);
				}
			}
		});
	},
    ponerCurso: function(posc, curid) {
		var datos = {};
		datos.action = 'getCurso';
		datos.curid = curid;
		$('.tituloCurso').html(cursos[posc].nombre);
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
					$('.listetapas').html('');
					for(var i=0;i<etapas.length;i++) {
						podac = ''+
						'<div class="boxcate" onclick="app.ponerEtapa('+i+','+etapas[i].ID+');" data-cur="'+i+'">'+
						'	<div class="titEtapa">'+etapas[i].nombre_etapa+'</div>'+
						'	<div class="clasesEtapa">Clases: '+etapas[i].cantCla+'</div>'+
						'</div>';
						$('.listetapas').append(podac);
					}
				} else {
					alerta(data.msg);
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
    ponerClase: function(i, posc, curid) {
		$('.tituloClase').html(etapas[posc].clases[i].nombre_clase);
		ponerPantalla('pantalla16');
		$('#audiosclase').html('');
		for(var k=0;k<etapas[posc].clases[i].archivos.length;k++) {
			$('#audiosclase').append('<div class="btnGenerico" onclick="app.ponerClaseAudio('+k+','+i+','+posc+','+curid+');" data-cur="'+i+'">'+etapas[posc].clases[i].archivos[k].duracion+'</div>');
		}
	},
    ponerClaseAudio: function(k,i, posc, curid) {
		$('.tituloClase').html(etapas[posc].clases[i].nombre_clase);
		ponerPantalla('pantalla17');
		datosClase.audio_ID = etapas[posc].clases[i].archivos[k].ID;
		$('#audClaseP').html('<source src="'+baseURL+etapas[posc].clases[i].archivos[k].file_clase+'" type="audio/mpeg">Su navegador no sorporta audio HTML5');
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
					$('#med_ini').html('<source src="'+baseURL+data.datos.archivo+'" type="audio/mpeg">Su navegador no sorporta audio HTML5');
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
					$('#med_ini').html('<source src="'+baseURL+data.datos.archivo+'" type="audio/mpeg">Su navegador no sorporta audio HTML5');
				} else {
					alerta(data.msg);
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
var podcasts;
var categorias;
var cursos;
var clases;
var etapas;
var meditadiraria;
var estadisticas;
var preguntaAct = 0;
var meditacionediarias;
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

function ponerEstadisticas() {
	$('.boxEstadisticas').html('<div class="estdis"><b>Clases tomadas:</b> '+estadisticas.clases+'</div><div class="estdis"><b>Meditaciones diarias:</b> '+estadisticas.meditaciones+'</div>');
}

function ponerPregunta() {
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

function ponerPod(num) {
	$('#nomrepod').html(podcasts[num].nombre);
	 var audio = $("#audPod");      
    $("#podsour").attr("src", baseURL+podcasts[num].archivo);
    audio[0].pause();
    audio[0].load();
    //audio[0].play(); changed based on Sprachprofi's comment below
    audio[0].oncanplaythrough = audio[0].play();
	$('#audPod').html('<source src="'+baseURL+podcasts[num].archivo+'"  id="podsour" type="audio/mpeg">Su navegador no sorporta audio HTML5');
	ponerPantalla('pantalla8b');
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
var audClaseP = document.getElementById("audClaseP");
audClaseP.onplaying = function() {
	var datos = {};
	datos.action = 'saveClase';
	datos.clase_ID = datosClase.audio_ID;
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
