window.onerror = function(message, url, lineNumber) {
	log("Error: "+message+" in "+url+" at line "+lineNumber);
	alert("Error: "+message+" in "+url+" at line "+lineNumber);
}
var apiURL = "https://tranquiapp.net/apiTranqui.php";
var baseURL = "https://tranquiapp.net/";
var isLoginSave = false;
var isLogin = false;
var userLogId = false;
var primeraVez = false;
var volverHome = false;
var timerac = '';
var guiadaac = '';
var dataFilesStore = {};
var sinintrombsr = false;
var codmbsr = '';
var vinedeconf = false;
var cambiandopantalla = false;
var buscandoCont = false;
var respirando = false;
var loginData_nombre = '';
var pantact = 'pantalla5';
var ultimapant = '';
var tiempo_insp=2;
var tiempo_mant=2;
var tiempo_exalar=2;
var tiempo_veces=15;
var tiempo_vecesT=0;
var cur_i;
var cur_i_e;
var posetapa;
var cursoelegHome = 0;
var poscate;
var vibrar = true;
var suscrito = false;
var suscrito_cup = false;
var cur_posc;
var cur_curid;
var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        setTimeout(sacarSplash, 1000);
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    logOff: function() {
        isLoginSave = false;
        loginData_nombre  = '';
        userLogId = false;
        localStorage.setItem('isLogin', isLoginSave);
        localStorage.setItem('loginData_nombre', loginData_nombre);
        localStorage.setItem('userLogId', userLogId);
        localStorage.setItem('sinintrombsr', "false");
        localStorage.setItem('primeraVez', "false");
        localStorage.setItem('dataFilesStore', "");
        
        $('.ventana').addClass('hidden');
        ponerPantalla('pantalla0');
    },
    onDeviceReady: function() {
		var isapp = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
		if ( isapp ) {
			app.setupPush();
		}
		if ( isapp ) {
			app.initStore();
		}
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
        primeraVez = localStorage.getItem('primeraVez');
        if(!primeraVez) {
			localStorage.setItem('primeraVez', "true");
			primeraVez = 'true';
		} else {
			localStorage.setItem('primeraVez', "false");
			primeraVez = 'false';
		}
        var dataFilesStoreS = localStorage.getItem('dataFilesStore');
        if(!dataFilesStoreS) {
			dataFilesStore.etapas = new Array();
			dataFilesStore.files = new Array();
		} else {
			dataFilesStore  = JSON.parse(dataFilesStoreS);
		}
        
        if(isLoginSave=="true") {
			$('#pantalla0').removeClass('activa');
			$('#pantalla0').addClass('hidden');
			$('.nombreuser').html('Hola '+loginData_nombre);
			if(primeraVez!='false') {
				$('#pantalla1').removeClass('hidden');
				$('#pantalla1').addClass('activa');
				$('#pantalla1').css({'display':'block'});
			} else {
				$('#pantalla5').removeClass('hidden');
				$('#pantalla5').addClass('activa');
				$('#pantalla5').css({'display':'block'});
			}
			app.setSession();
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
		
        $('.boxprem').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla18');
		});
		
        $('#login').click(function(e) {
			e.preventDefault();
			//~ $('#glyphicon glyphicon-user').html($('#email').val());
			ponerPantalla('pantalla0a');
		});
		
        $('.respuesta').click(function(e) {
			e.preventDefault();
			preguntaAct++;
			ponerSigPreg();
		});
		
        $('#registro').click(function(e) {
			e.preventDefault();
			//~ $('#glyphicon glyphicon-user').html($('#email2').val());
			ponerPantalla('pantalla0b');
		});
		
		
        $('#recpass').click(function(e) {
			e.preventDefault();
			//~ $('#glyphicon glyphicon-user').html($('#email2').val());
			ponerPantalla('pantalla0c');
		});
		
        $('#btnLogin').click(function(e) {
			e.preventDefault();
			$(':focus').blur();
			ponerLoading();
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
					sacarLoading();
					if(data.res) {
						if(primeraVez!='false') {
							ponerPantalla('pantalla1');
						} else {
							ponerPantalla('pantalla5');
						}
						app.iniciarCont();
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
				datos.apellido = $('#apellido').val();
				datos.email = $('#email2').val();
				datos.password = $('#password2').val();
				ponerLoading();
				$.ajax({
					type: 'POST',
					dataType: 'json',
					url: apiURL,
					data: datos,
					success: function (data) {
						sacarLoading();
						if(data.res) {
							if(primeraVez!='false') {
								ponerPantalla('pantalla1');
							} else {
								ponerPantalla('pantalla5');
							}
							app.iniciarCont();
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
		
        $('#btnRecpass').click(function(e) {
			e.preventDefault();
			$(':focus').blur();
			if(validateEmail($('#email3').val())) {
				var datos = {};
				datos.action = 'doRecPass';
				datos.email = $('#email3').val();
				ponerLoading();
				$.ajax({
					type: 'POST',
					dataType: 'json',
					url: apiURL,
					data: datos,
					success: function (data) {
						sacarLoading();
						if(data.res) {
							ponerPantalla('pantalla0d');
							alerta(data.message);
						} else {
							alerta(data.message);
						}
					}
				});
			} else {
				alerta("debes ingresar el email con el que te has registrado.");
			}
		});
		
        $('#btnResetpass').click(function(e) {
			e.preventDefault();
			$(':focus').blur();
			if($('#codigo').val()!='' && $('#password3').val()!='' && $('#password3').val()==$('#password3b').val()) {
				var datos = {};
				datos.action = 'doResetPass';
				datos.codigo = $('#codigo').val();
				datos.pass1 = $('#password3').val();
				datos.pass2 = $('#password3b').val();
				datos.email = $('#email3').val();
				ponerLoading();
				$.ajax({
					type: 'POST',
					dataType: 'json',
					url: apiURL,
					data: datos,
					success: function (data) {
						sacarLoading();
						if(data.res) {
							ponerPantalla('pantalla0a');
							alerta(data.message);
						} else {
							alerta(data.message);
						}
					}
				});
			} else {
				if($('#codigo').val()=='') {
					alerta("El código no debe estar vacío.");
				}
				if($('#codigo').val()=='') {
					alerta("La contraseña no debe estar vacía.");
				}
				if($('#password3').val()!='' && $('#password3').val()!=$('#password3b').val()) {
					alerta("Las contraseñas no coinciden.");
				}
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
			if(donde=='lastapant') {
				donde = ultimapant;
			}
			if(donde=='pantalla16') {
				$('#audClaseP')[0].pause();
			}
			if(donde=='pantalla13') {
				$('#audClaseInd')[0].pause();
			}
			if(donde=='pantalla14' && volverHome) {
				volverHome = false;
				donde = 'pantalla5';
			}
			if(donde=='pantalla13' && volverHome) {
				volverHome = false;
				donde = 'pantalla5';
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
			var cont_i = $(this).parent().find('.campoculto');
			var hor = parseInt(cont.html());
			var max = cont.data('max');
			if(hor<max) {
				hor++;
			}
			if(hor<10) {
				hor = '0'+hor;
			}
			cont.html(hor);
			cont_i.val(hor);
		});
		
		 $('.infhor').click(function(e) {
			e.preventDefault();
			var cont = $(this).parent().find('.notinumber');
			var cont_i = $(this).parent().find('.campoculto');
			var hor = parseInt(cont.html());
			if(hor>0) {
				hor--;
			}
			if(hor<10) {
				hor = '0'+hor;
			}
			cont.html(hor);
			cont_i.val(hor);
		});
		
		 $('#confNotResp').click(function(e) {
			e.preventDefault();
			$('#pantalla4 .btnGenerico.btnViole').removeClass('activo');
			$('#notRespM').removeClass('activo');
			$('#notRespB').addClass('activo');
			$('#confNotResp').addClass('activo');
		});
		
		 $('#confNotMed').click(function(e) {
			e.preventDefault();
			$('#pantalla4 .btnGenerico.btnViole').removeClass('activo');
			$('#notRespB').removeClass('activo');
			$('#notRespM').addClass('activo');
			$('#confNotMed').addClass('activo');
		});
		
		 $('.saltar').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla3b');
		});
		
		 $('#volver_prog').click(function(e) {
			e.preventDefault();
			ponerMBSRAct();
		});
		
		 $('#pantalla2b .btnContinuar').click(function(e) {
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
			saveConfig('respirar', $('#conf_val_1a_i').val()+':'+$('#conf_val_1b_i').val()+':00');
		});
		
		 $('.btnConfirmar2').click(function(e) {
			e.preventDefault();
			$('#notRespB').removeClass('activo');
			$('#notRespM').removeClass('activo');
			$('#pantalla4 .btnGenerico.btnViole').removeClass('activo');
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
			saveConfig('meditar', $('#conf_val_2a_i').val()+':'+$('#conf_val_2b_i').val()+':00');
		});
		
		 $('.btnFinalizarConf').click(function(e) {
			e.preventDefault();
			if(vinedeconf) {
				ponerPantalla('pantalla11b');
			} else {
				ponerPantalla('pantalla5');
			}
		});
		
		 $('.btnConfigurarNot').click(function(e) {
			e.preventDefault();
			vinedeconf = true;
			ponerPantalla('pantalla4');
			$('.btnFinalizarConf').html('volver');
		});
		
		 $('#btnRepetirClase').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla16');
			var method
			var audi = document.getElementById('audClaseP')
			  
			$('.btnPlayMed.ct_audClaseP .circsma').html('<i class="glyphicon glyphicon-pause"></i>');
			estaplay = true
			method = 'play';
			
			setTimeout(function() {
				audi.currentTime = 0; 
				audi[method]();
			}, 900);
		});
		
		 $('#btnRepetirClaseInd').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla16c');
			var method
			var audi = document.getElementById('audClaseInd')
			  
			$('.btnPlayMed.ct_audClaseInd .circsma').html('<i class="glyphicon glyphicon-pause"></i>');
			estaplay = true
			method = 'play';
			
			setTimeout(function() {
				audi.currentTime = 0; 
				audi[method]();
			}, 900);
		});
		
		 $('#btnRepetirMBSR').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla12d');
			var method
			var audi = document.getElementById('uad_MBSR')
			  
			$('.btnPlayMed.ct_uad_MBSR .circsma').html('<i class="glyphicon glyphicon-pause"></i>');
			estaplay = true
			method = 'play';
			
			setTimeout(function() {
				audi.currentTime = 0; 
				audi[method]();
			}, 900);
		});
		
		 $('#btnRepetirPod').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla8b');
			var method
			var audi = document.getElementById('audPod')
			  
			$('.btnPlayMed.ct_audPod .circsma').html('<i class="glyphicon glyphicon-pause"></i>');
			estaplay = true
			method = 'play';
			
			setTimeout(function() {
				audi.currentTime = 0; 
				audi[method]();
			}, 900);
		});
		
		 $('#btnRepetirMEdIni').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla3');
			var method
			var audi = document.getElementById('med_ini')
			  
			$('.btnPlayMed.ct_med_ini .circsma').html('<i class="glyphicon glyphicon-pause"></i>');
			estaplay = true
			method = 'play';
			
			setTimeout(function() {
				audi.currentTime = 0; 
				audi[method]();
			}, 900);
		});
		
		 $('#btnSigClase').click(function(e) {
			e.preventDefault();
			
			curoreco = etapas[posetapa].curso_ID;
			app.ponerCursos(poscate, categorias[poscate].ID, true);
			//~ ponerPantalla('pantalla15');
			
		});
		
		 $('#btnContinuarmedini').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla4');
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
			if(vibrar) {
				navigator.vibrate(100);
			}
			ponerPantalla('pantalla5');
		});
		
		 $('.btnGuiada').click(function(e) {
			e.preventDefault();
			if(suscrito || suscrito_cup) {
				guiadaac = 'GUIADA';
				app.ponerGuiada(5);
				$('.titSeccionSubT').html('GUIADA - 5 minutos');
				ponerPantalla('pantalla19b');
			} else {
				ponerPantalla('pantalla18');
			}
		});
		
		 $('.btnNoGuiada').click(function(e) {
			e.preventDefault();
			if(suscrito || suscrito_cup) {
				guiadaac = 'NO GUIADA';
				app.ponerGuiada(5);
				ponerPantalla('pantalla19b');
			} else {
				ponerPantalla('pantalla18');
			}
		});
				
		 $('.btnMedGuiada').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla19');
		});

		 $('.btnGratuita').click(function(e) {
			e.preventDefault();
			timerac = 'GRATUITA';
			app.ponerTimer(5);
			ponerPantalla('pantalla6b');
		});
		
		 $('.btnTimers').click(function(e) {
			e.preventDefault();
			//~ ponerPantalla('pantalla6');
			timerac = 'GRATUITA';
			app.ponerTimer(5);
			ponerPantalla('pantalla6b');
		});
		
		 $('.btnEsfera').click(function(e) {
			e.preventDefault();
			$('.circ_resp').removeClass('activo');
			$('.mensajere').removeClass('activo');
			ponerPantalla('pantalla7');
		});
		
		 $('.btnPodcasts').click(function(e) {
			e.preventDefault();
			if(vibrar) {
				navigator.vibrate(100);
			}
			ponerPantalla('pantalla8');
		});
		
		 $('.btnLibreria').click(function(e) {
			e.preventDefault();
			if(vibrar) {
				navigator.vibrate(100);
			}
			app.ponerCategorias();
			ponerPantalla('pantalla9');
		});
		
		 $('.btnMedDiaria').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla10');
		});
		
		 $('.btnCargarCodigoG').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla20');
		});
		
		 $('.btnMisdatos').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla21');
		});
		
		 $('#btnSuscibirse').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla18b');
		});
		
		 $('.btnPlayMed.ct_audEsfera').click(function(e) {
			e.preventDefault();
			if(!respirando) {
				$('.btnPlayMed.ct_audEsfera .circsma').html('<i class="glyphicon glyphicon-stop" style="margin-left: -5px;"></i>');
				app.iniciarResp();
			} else {
				$('.circ_resp').removeClass('activo');
				$('.mensajere').removeClass('activo');
				$('.btnPlayMed.ct_audEsfera .circsma').html('<i class="glyphicon glyphicon-play"></i>');
				respirando = false;
				var audi = document.getElementById('audEsfera');
				method = 'pause';
				audi.currentTime = 0; 
				audi[method]();
			}
		});
		
		 $('.btnUser').click(function(e) {
			e.preventDefault();
			if(vibrar) {
				navigator.vibrate(100);
			}
			ponerPantalla('pantalla11');
		});
		
		 $('.btnMSBR').click(function(e) {
			e.preventDefault();
			if(vibrar) {
				navigator.vibrate(100);
			}
			var muestroono = localStorage.getItem('sinintrombsr');
			if(muestroono=="true" || sinintrombsr) {
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
				localStorage.setItem('sinintrombsr', "true");
				sinintrombsr = true;
			}
			ponerPantalla('pantalla12b');
		});
		
		$('#codigombsr').keypress(function(event){
			var keycode = (event.keyCode ? event.keyCode : event.which);
			if(keycode == '13'){
				$('.btnGetCupon').click();	
			}
		});
		
		$('.btnGetCupon').click(function(e) {
			e.preventDefault();
			var codval = $('#codigombsr').val();
			codmbsr = codval;
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
							mbsr_cont = data.mbsr;
							app.doMBSR();
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
		
		$('.btnValidarCodigo').click(function(e) {
			e.preventDefault();
			var codval = $('#codigoApp').val();
			if(codval!='') {
				var datos = {};
				datos.action = 'validateAppCode';
				datos.code = codval;
				$.ajax({
					type: 'POST',
					dataType: 'json',
					url: apiURL,
					data: datos,
					success: function (data) {
						if(data.res) {
							alerta(data.message);
							suscrito_cup = true;
							validarSuscrip();
							ponerPantalla('pantalla11b');
						} else {
							alerta(data.message);
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
		
		$('.btnUserOptions').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla11b');
		});
		
		$('.btnMiscursos').click(function(e) {
			e.preventDefault();
			ponerPantalla('pantalla11c');
		});
		
		$('.btnCerrarSession').click(function(e) {
			e.preventDefault();
			app.logOff();
		});
		
		$('#buscarCate').keypress(function(event){
			var keycode = (event.keyCode ? event.keyCode : event.which);
			if(keycode == '13'){
				$('#btnBuscar').click();	
			}
		});
		
		$('.btnVolverLib').click(function(e) {
			e.preventDefault();
			$('#buscarCate').val('');
			$('#btnBuscar').click();	
		});
		
		$('#btnBuscar').click(function(e) {
			e.preventDefault();
			var wts = $('#buscarCate').val();
			$('.categoriascur').html('');
			var podac;
			var cant = 0;
			var yaestan = new Array();
			var candado = '';
			for(var i=0;i<categorias.length;i++) {
				candado = (categorias[i].ID!=5 && !(suscrito || suscrito_cup))?' <i class="fa fa-lock sinrep"></i>':'';
				if(wts!='') {
					var keywords = categorias[i].keywords.toLowerCase().split(',');
					var encontro1 = false;
					if(categorias[i].nombre.toLowerCase().search(wts)!=-1 && !inArray(categorias[i].ID, yaestan)) {
						yaestan.push(categorias[i].ID);
						encontro1 = true;
					}
					for(var t=0;t<keywords.length;t++) {
						if(keywords[t].search(wts)!=-1 && !inArray(categorias[i].ID, yaestan)) {
							yaestan.push(categorias[i].ID);
							encontro1 = true;
						}
					}
					if(encontro1 || categorias[i].nombre.search(wts)!=-1) {
						podac = ''+
						'<div class="boxcate" onclick="app.ponerCursos('+i+','+categorias[i].ID+');" style="'+categorias[i].codigo+'" data-cate="'+i+'">'+
						'	<div class="titCate">'+categorias[i].nombre+candado+'</div>'+
						'</div>';
						$('.categoriascur').append(podac);
						cant++;
					}
					//~ wts = wts.substring(0, 3);
					//~ for(var t=0;t<keywords.length;t++) {
						//~ if(keywords[t].search(wts)!=-1) {
							//~ encontro1 = true;
						//~ }
					//~ }
					//~ if(encontro1 || categorias[i].nombre.search(wts)!=-1) {
						//~ podac = ''+
						//~ '<div class="boxcate" onclick="app.ponerCursos('+i+','+categorias[i].ID+');" style="'+categorias[i].codigo+'" data-cate="'+i+'">'+
						//~ '	<div class="titCate">'+categorias[i].nombre+candado+'</div>'+
						//~ '</div>';
						//~ $('.categoriascur').append(podac);
						//~ cant++;
					//~ }
				} else {
					podac = ''+
					'<div class="boxcate" onclick="app.ponerCursos('+i+','+categorias[i].ID+');" style="'+categorias[i].codigo+'" data-cate="'+i+'">'+
					'	<div class="titCate">'+categorias[i].nombre+candado+'</div>'+
					'</div>';
					$('.categoriascur').append(podac);
				}
			}
			if(wts!='' && cant==0) {
				$('.sinresu').removeClass('hidden');
			} else {
				$('.sinresu').addClass('hidden');
			}
		});
		
		$('body').on('click','.btnDescargaFile', function(e) {
			e.preventDefault();
			var quien = $(this).find('.bolita');
			var btnensi = $(this);
			if(navigator.onLine) {
				//~ downloader.init({folder: "TranquiFiles"});
				//~ downloader.get($(this).data('file'));
				if($(this).data('file')!="todos") {
					guardarFileSto('files', $(this).data('file'));
					ponerLoading();
					setTimeout(function() {
						sacarLoading();
						if(quien.hasClass('bolitaOn')) {
							quien.removeClass('bolitaOn');
						} else {
							quien.addClass('bolitaOn');
						}
					}, 1000);
					
					btnensi.find('.fondobotondes').animate({
						width: '100%'
					}, 1000, function() {
						btnensi.find('.fondobotondes').animate({
							width: '0%'
						}, 10, function() {
							btnensi.replaceWith('<div class="volverint btnSinborde btnDescargaFileOk" ><div class="iconDecargado"></div> descargado</div>');
						});
					})
				} else {
					guardarFileSto('etapa', $(this).data('etid'));
					if(quien.hasClass('bolitaOn')) {
						quien.removeClass('bolitaOn');
					} else {
						quien.addClass('bolitaOn');
					}
					btnensi.find('.fondobotondes').animate({
						width: '100%'
					}, 3000, function() {
						btnensi.find('.fondobotondes').animate({
							width: '0%'
						}, 10, function() {
							btnensi.replaceWith('<div class="volverint btnSinborde btnDescargaFileOk" ><div class="iconDecargado"></div> descargado</div>');
						});
					})
				}
			} else {
				alerta("No tienes internet");
			}
		});
		
		$('.btnUserMenu').click(function(e) {
			e.preventDefault();
			var quien = $(this).find('.bolita');
			if(quien) {
				var tipo = $(this).data('tipo');
				var valor = "true";
				if(quien.hasClass('bolitaOn')) {
					quien.removeClass('bolitaOn');
					quien.parent().removeClass('bolitaOn_c');
					valor = "false";
				} else {
					quien.addClass('bolitaOn');
					quien.parent().addClass('bolitaOn_c');
				}
				if(tipo=="vibrar") {
					if(valor=="true") {
						vibrar = true;
					} else {
						vibrar = false;
					}
					saveConfig('vibrar', valor);
				}
				if(tipo=="notificaciones") {
					saveConfig('notificaciones', valor);
				}
				if(tipo=="emails") {
					saveConfig('emails', valor);
				}
				if(tipo=="anuncios") {
					ponerPantalla('pantalla18');
				}
			}
		});
		
		
		 $('.carruselotrasoprac').on('click', '.item',function(e) {
			e.preventDefault();
			var posci=0;
			var curpos=0;
			var curoreco2 = $(this).data('curco');
			curoreco = $(this).data('curco'); // es el ID del curso
			var bloqueado = $(this).data('bloqueado');
			cursos = allcursos;
			for(var k=0;k<cursos.length;k++) {
				if(cursos[k].ID==curoreco2) {
					curpos = k;
					cursoelegHome = k;
					cateid = cursos[k].categoria_ID
				}
			}
			var poscate = 0;
			for(var m=0;m<categorias.length;m++) {
				if(categorias[m].ID==cateid) {
					poscate = m;
				}
			}
			buscandoCont = false;
			//i posicion del cuso
			app.ponerCursos(poscate, cateid, true);
		});
		
		$('.btnProximoCurso').click(function(e) {
			e.preventDefault();
			//posc es indide dentro de categorias
			var posci=0;
			var curpos=0;
			cursos = allcursos;
			for(var k=0;k<allcursos.length;k++) {
				if(allcursos[k].ID==curoreco) {
					curpos = k;
					cateid = allcursos[k].categoria_ID
				}
			}
			var poscate = 0;
			for(var m=0;m<categorias.length;m++) {
				if(categorias[m].ID==posci) {
					poscate = m;
				}
			}
			buscandoCont = false;
			//i posicion del cuso
			app.ponerCursos(poscate, cateid, true);
			
			//~ app.ponerCurso(curpos,cateid,curoreco);
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
		
		$("#audClaseInd_control").roundSlider({
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
				var audio = $('#audClaseInd')[0];
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
		
		$("#audGuiada_control").roundSlider({
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
				var audio = $('#audGuiada')[0];
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
		//~ $("<style type='text/css'> .contenidoApp, .ventana{ min-height: "+altpan+"px;} </style>").appendTo("head");
		
		mobiscroll.settings = {
			
			lang: 'es',   // Specify language like: lang: 'pl' or omit setting to use default
			theme: 'ios'            // Specify theme like: theme: 'ios' or omit setting to use default
		};
		
		
		$('#codigombsr').focusin(function() {
			$('.bototneraBottom').hide();
		});
		$('#codigombsr').focusout(function() {
			$('.bototneraBottom').show();
		});

    },
    iniciarCont: function() {
		var datos = {};
		datos.action = 'getContenido';
		ponerLoading();
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: apiURL,
			data: datos,
			success: function (data) {
				sacarLoading();
				if(data.res) {
					//mbsr
					//cursos
					allcursos = data.cursos;
					cursos = data.cursos;
					//cuestionario
					preguntas = data.preguntas;
					//meditacioninicial
					app.doMedIni(data.medini);
					//medidaria
					app.doMedDiaria(data.med_diaria);
					//podcasts
					podcasts = data.podcasts;
					app.doPodcasts();
					//guiadas
					guiadas = data.guiadas;
					$('#tiempoclaseGuiadas').mobiscroll().select({
						display: 'inline',  // Specify display mode like: display: 'bottom' or omit setting to use default
						showInput: false    // More info about showInput: https://docs.mobiscroll.com/4-7-3/select#opt-showInput
					});
					//timers
					timers = data.timers;
					$('#tiempoclaseTimer').mobiscroll().select({
						display: 'inline',  // Specify display mode like: display: 'bottom' or omit setting to use default
						showInput: false    // More info about showInput: https://docs.mobiscroll.com/4-7-3/select#opt-showInput
					});
					
					tiempo_insp=data.timers_anim.t_inspirar;
					tiempo_mant=data.timers_anim.t_aguantar;
					tiempo_exalar=data.timers_anim.t_exalar;
					tiempo_veces=data.timers_anim.repeticiones;
					//categorias
					categorias = data.categorias;
					//esfera
					$('#audEsfera').html('<source src="'+baseURL+data.esfera.archivo+'" type="audio/mpeg">Su navegador no sorporta audio HTML5');
					//mensajes
					mensajes_app = data.mensajes;
					
					animres = data.a_respiracion;
					
					
					//beneficios
					beneficios = data.beneficios;
					app.doBeneficios();
					
					//susbcripto via code?
					if(data.suscrito_cup=="true") {
						suscrito_cup = true;
						validarSuscrip();
					}
					
					//listo?
					
					app.ponerInfoHome();
					app.ponerCategorias();
		
					setTimeout(function() {
						app.loadEstadisticas();
					}, 900);
					
					
		
					
					
					if(primeraVez!='false') {
						$('#videoIni')[0].play();
					}
				} else {
					alerta(data.message);
				}
			},
			error: function(xhr, status, error) {
				alerta("Problemas con el servidor.");
			}
		});
    },
    initStore: function() {
		if (!window.store) {
			alerta('Store not available');
			return;
		}
		
		app.platform = device.platform.toLowerCase();
		document.getElementsByTagName('body')[0].className = app.platform;
		// Enable maximum logging level
		//store.verbosity = store.DEBUG;
		
		 store.validator = "https://api.fovea.cc:1982/check-purchase";

		// Inform the store of your products
		store.register({
			id:    'tranquisusc1', // id without package name!
			alias: 'tranquisusc1',
			type:  store.PAID_SUBSCRIPTION
		});
			
		store.when("product").updated(function (p) {
			app.renderIAP(p);
		});
		store.when("tranquisusc1").approved(function(p) {
			//~ alerta("verify subscription");
			p.verify();
		});
		store.when("tranquisusc1").verified(function(p) {
			//~ alerta("subscription verified");
			p.finish();
		});
		store.when("tranquisusc1").unverified(function(p) {
			//~ alerta("subscription unverified");
		});
		store.when("tranquisusc1").updated(function(p) {
			if (p.owned) {
				suscrito = true;
			}
			validarSuscrip();
		});
		
		// otra subsc
		
		store.register({
			id:    'subscription1', // id without package name!
			alias: 'subscription1',
			type:  store.PAID_SUBSCRIPTION
		});
		
		store.when("subscription1").approved(function(p) {
			//~ alerta("verify subscription");
			p.verify();
		});
		store.when("subscription1").verified(function(p) {
			//~ alerta("subscription verified");
			p.finish();
		});
		store.when("subscription1").unverified(function(p) {
			//~ alerta("subscription unverified");
		});
		store.when("subscription1").updated(function(p) {
			if (p.owned) {
				suscrito = true;
			}
			validarSuscrip();
		});
		
		// otra subsc
		
		store.register({
			id:    'tranquisusc_6m', // id without package name!
			alias: 'tranquisusc_6m',
			type:  store.PAID_SUBSCRIPTION
		});
		
		store.when("tranquisusc_6m").approved(function(p) {
			//~ alerta("verify subscription");
			p.verify();
		});
		store.when("tranquisusc_6m").verified(function(p) {
			//~ alerta("subscription verified");
			p.finish();
		});
		store.when("tranquisusc_6m").unverified(function(p) {
			//~ alerta("subscription unverified");
		});
		store.when("tranquisusc_6m").updated(function(p) {
			if (p.owned) {
				suscrito = true;
			}
			validarSuscrip();
		});


		// Log all errors
		store.error(function(error) {
			//~ $('#logbox').html($('#logbox').html()+'ERROR ' + error.code + ': ' + error.message);
		});
		store.error(store.ERR_SETUP, function() {
		   store.trigger("refreshed");
		 });
		
		store.ready(function() {
			var el = document.getElementById("loading-indicator");
			if (el)
				el.style.display = 'none';
		});
		

		// When store is ready, activate the "refresh" button;
		store.ready(function() {
			var el = document.getElementById('comprasbox');
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
		// id='buy-" + p.id + "' productId='" + p.id + "'
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
				html += "<div class='buttonPurchase'>" + p.price + "</div>";
			}
			el.innerHTML = html;
			if (p.canPurchase) {
				el.setAttribute("productId", p.id);
				document.getElementById(elId + '-purchase').onclick = function (event) {
					var pid = this.getAttribute("productId");
					store.order(pid);
				};
			}
		}
	},
    hacerloginGoog: function(datos) {
		//~ log("VA: "+JSON.stringify(obj)); // do something useful instead of alerting
		//~ $('.hola').html('<img src="'+datos.imageurl+'"> Hola '+datos.displayname+' <div class="emailjun">('+datos.email+')</div>');
		
		var datos = {};
		datos.action = 'doGoogle';
		datos.tipo = 'google';
		var nombre = (datos.givenName!='')?datos.givenName:datos.displayName;
		datos.nombre = datos.givenName;
		datos.apellido = datos.familyName;
		datos.email = datos.email;
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: apiURL,
			data: datos,
			success: function (data) {
				if(data.res) {
					$('.nombreuser').html('Hola '+datos.displayname);
					$('#glyphicon glyphicon-user').html(datos.displayname);
					if(primeraVez!='false') {
						ponerPantalla('pantalla1');
					} else {
						ponerPantalla('pantalla5');
					}
					app.savePushToken();
					app.iniciarCont();
					isLogin = true;
					loginData_nombre = datos.displayname;
					localStorage.setItem('loginData_nombre', loginData_nombre);
					localStorage.setItem('isLogin', isLogin);
				} else {
					alerta(data.message);
				}
			}
		});
		$('.videomin')[0].play();
	},
    hacerloginFace: function(datos) {
		
		facebookConnectPlugin.api("me/?fields=id,name,email,picture,last_name,first_name", [],
		  function onSuccess (result) {
			var datos = {};
			datos.action = 'doFacebook';
			datos.tipo = 'face';
			var nombre = (result.first_name!='')?result.first_name:result.name;
			datos.nombre = nombre;
			datos.apellido = result.last_name;
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
						
						if(primeraVez!='false') {
							ponerPantalla('pantalla1');
						} else {
							ponerPantalla('pantalla5');
						}
						app.savePushToken();
						app.iniciarCont();
						isLogin = true;
						loginData_nombre = result.name;
						localStorage.setItem('loginData_nombre', loginData_nombre);
						localStorage.setItem('isLogin', isLogin);
						userLogId = data.datos.ID;
						localStorage.setItem('userLogId', userLogId);
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
					app.savePushToken();
					app.iniciarCont();
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
					app.getConfig();
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
					if(data.cursohome.nombre!=undefined && data.cursohome.nombre!='') {
						app.ponerCursoHome(data.cursohome.nombre, data.cursohome.etapa, data.cursohome.curso, data.cursohome.catei);
					}
					$('.carruselotrasoprac').owlCarousel('destroy');
					$('.carruselotrasoprac').html('');
					var pago = '';
					var bloqueado = '0';
					for(var i=0;i<data.cursorecomendado.length;i++) {
						pago = '';
						bloqueado = '0';
						if(data.cursorecomendado[i].gratuito!=1 && !(suscrito || suscrito_cup)) {
							pago = ' <i class="fa fa-lock sinrep"></i>';
							bloqueado = '1';
						}
						$('.carruselotrasoprac').append('<div class="item" data-curco="'+data.cursorecomendado[i].ID+'" data-bloqueado="'+bloqueado+'" style="'+data.cursorecomendado[i].codigo+'"><div class="titcursoreco">'+data.cursorecomendado[i].nombre+pago+'</div><div class="titcursoreco"> • </div><div class="txtcursoreco">'+data.cursorecomendado[i].descripcion+'</div></div>');
					}
					$('.carruselotrasoprac').owlCarousel({
						loop:true,
						center:true,
						margin:20,
						nav:false,
						dots:false,
						stagePadding: 80,
						items:1
					})
					curoreco = data.cursorecomendado[0].ID;
					$('.btnProximoCurso .sub').html(data.cursorecomendado[0].nombre);
				} else {
					alerta(data.message);
				}
			}
		});
	},
    getConfig: function() {
		var datos = {};
		datos.action = 'getConfig';
		datos.userid = userLogId;
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: apiURL,
			data: datos,
			success: function (data) {
				if(data.res) {
					glocbalConf = data.datos;
					if(glocbalConf.length>0) {
						for(var i=0;i<glocbalConf.length;i++) {
							if(glocbalConf[i].tipo=="vibrar") {
								var quien = $('.btnVibrar').find('.bolita');
								if(glocbalConf[i].valor=="true") {
									vibrar = true;
									quien.addClass('bolitaOn');
									quien.parent().addClass('bolitaOn_c');
								} else {
									vibrar = false;
									quien.removeClass('bolitaOn');
									quien.parent().removeClass('bolitaOn_c');
								}
							}
							if(glocbalConf[i].tipo=="notificaciones") {
								var quien = $('.btnNotificaciones').find('.bolita');
								if(glocbalConf[i].valor=="true") {
									quien.addClass('bolitaOn');
									quien.parent().addClass('bolitaOn_c');
								} else {
									quien.removeClass('bolitaOn');
									quien.parent().removeClass('bolitaOn_c');
								}
							}
							if(glocbalConf[i].tipo=="emails") {
								var quien = $('.btnEmailNot').find('.bolita');
								if(glocbalConf[i].valor=="true") {
									quien.addClass('bolitaOn');
									quien.parent().addClass('bolitaOn_c');
								} else {
									quien.removeClass('bolitaOn');
									quien.parent().removeClass('bolitaOn_c');
								}
							}
						}
					} else {
						var quien = $('.btnVibrar').find('.bolita');
						vibrar = true;
						quien.addClass('bolitaOn');
						quien.parent().addClass('bolitaOn_c');
						var quien = $('.btnNotificaciones').find('.bolita');
						quien.addClass('bolitaOn');
						quien.parent().addClass('bolitaOn_c');
						var quien = $('.btnEmailNot').find('.bolita');
						quien.addClass('bolitaOn');
						quien.parent().addClass('bolitaOn_c');
					}
				} else {
					//~ alerta(data.message);
				}
			}
		});
	},
    doPodcasts: function() {
		var podac;
		for(var i=0;i<podcasts.length;i++) {
			if(i==0) {
				$('.ultimopodcast .titPod').html(podcasts[i].nombre);
				$('.ultimopodcast .durPod').html(podcasts[i].duration);
			} else {
				podac = ''+
				'<div class="boxcast btnAl70w" data-pod="'+i+'">'+
				'	<div class="titPod">'+podcasts[i].nombre+'</div>'+
				'	<div class="durPod">'+podcasts[i].duration+'</div>'+
				'</div>';
				$('.todospods').append(podac);
			}	
		}
	},
    doBeneficios: function() {
		var podac;
		if(beneficios.length==0) {
			$('.beneficios').hide();
		} else {
			for(var i=0;i<beneficios.length;i++) {
				podac = ''+
				'<div class="item">'+
				'	<div class="titBene">'+beneficios[i].titulo+'</div>'+
				'	<div class="txtBene">'+beneficios[i].texto+'</div>'+
				'</div>';
				$('.beneficios').append(podac);
			}
			//~ $('.beneficios').owlCarousel({
				//~ loop:false,
				//~ margin:0,
				//~ nav:false,
				//~ dots:true,
				//~ items:1
			//~ })
		}
	},
    animaRespirar: function() {
		$('.circ_resp').css({'transition':tiempo_insp+'s'});
		$('.circ_resp').addClass('activo');
		if(respirando) {
			$('.mensajere').removeClass('activo');
			$('#resp_txt_1').addClass('activo');
			setTimeout(function() {
				$('.mensajere').removeClass('activo');
				$('#resp_txt_2').addClass('activo');
				if(respirando) {
					setTimeout(function() {
						$('.circ_resp').css({'transition':tiempo_exalar+'s'});
						$('.circ_resp').removeClass('activo');
						$('.mensajere').removeClass('activo');
						$('#resp_txt_3').addClass('activo');
						if(respirando) {
							setTimeout(function() {
								if(tiempo_vecesT<tiempo_veces) {
									tiempo_vecesT++;
									if(respirando) {
										app.animaRespirar();
									}
								} else {
									//pararaaudio
									var method = 'pause';
									var audi = document.getElementById('audEsfera');
									audi.currentTime = 0; 
									audi[method]();
									respirando = false;
									ponerPantalla('pantalla5');
								}
							}, tiempo_exalar*1000);
						}
					}, tiempo_mant*1000);
				}
			}, tiempo_insp*1000);
		}
	},
    iniciarResp: function() {
		$('.circ_resp').removeClass('activo');
		$('.mensajere').removeClass('activo');
		setTimeout(function() {
			var method = 'play';
			tiempo_vecesT = 0;
			var audi = document.getElementById('audEsfera');
			audi.currentTime = 0; 
			respirando = true;
			app.animaRespirar();
			audi[method]();
		}, 1000);
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
					app.ponerCategorias();
				} else {
					alerta(data.message);
				}
			}
		});
	},
    ponerCategorias: function() {
		var podac;
		$('.categoriascur').html('');
		var candado = '';
		for(var i=0;i<categorias.length;i++) {
			candado = (categorias[i].ID!=5 && !(suscrito || suscrito_cup))?' <i class="fa fa-lock sinrep"></i>':'';
			podac = ''+
			'<div class="boxcate" onclick="app.ponerCursos('+i+','+categorias[i].ID+');" style="'+categorias[i].codigo+'" data-cate="'+i+'">'+
			'	<div class="titCate">'+categorias[i].nombre+candado+'</div>'+
			'</div>';
			$('.categoriascur').append(podac);
		}
	},
    ponerCursos: function(posc, catid, sinc) {
		sinc = (sinc==undefined)?0:sinc;
		var datos = {};
		datos.action = 'getCursos';
		datos.catid = catid;
		$('.tituloCat').html(categorias[posc].nombre);
		$('.descripcionCat').html(categorias[posc].descripcion);
		ponerLoading();
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: apiURL,
			data: datos,
			success: function (data) {
				if(data.res) {
					sacarLoading();
					$('#pantalla13').attr('style',categorias[posc].codigo);
					$('#pantalla14').attr('style',categorias[posc].codigo);
					$('body').attr('style',categorias[posc].codigo);
					$('#pantalla13 .monchito').attr('style','background-image: url('+baseURL+categorias[posc].file_fondo+');');
					//~ $('#pantalla14 .contenidoGen').attr('style','background-image: url('+baseURL+categorias[posc].file_fondo+');');
					//~ $('#pantalla15 .contenidoGen').attr('style','background-image: url('+baseURL+categorias[posc].file_fondo+');');
					if(categorias[posc].fondo_pantalla!=undefined || categorias[posc].fondo_pantalla!='') {
						$('#pantalla13 .contenidoGen').attr('style','background-image: url('+baseURL+categorias[posc].fondo_pantalla+')');
						$('#pantalla14 .contenidoGen').attr('style','background-image: url('+baseURL+categorias[posc].fondo_pantalla+')');
						$('#pantalla15 .contenidoGen').attr('style','background-image: url('+baseURL+categorias[posc].fondo_pantalla+')');
						$('#pantalla16 .contenidoGen').attr('style','background-image: url('+baseURL+categorias[posc].fondo_pantalla+')');
						$('#pantalla16b .contenidoGen').attr('style','background-image: url('+baseURL+categorias[posc].fondo_pantalla+')');
						$('#pantalla16c .contenidoGen').attr('style','background-image: url('+baseURL+categorias[posc].fondo_pantalla+')');
						$('#pantalla16d .contenidoGen').attr('style','background-image: url('+baseURL+categorias[posc].fondo_pantalla+')');
						$('#pantalla16d .btnViole').attr('style', categorias[posc].codigo);
					}
					cursos = data.cursos;
					var podac;
					$('.listcursos').show();
					$('.listcursos').html('');
					var curpos = 0;
					for(var i=0;i<cursos.length;i++) {
						
						if((i%2)==0 && i>0) {
							$('.listcursos').append('<div class="clear"></div>');
						}
						var pago = '';
						var bloqueado = '0';
						if(cursos[i].gratuito!=1 && !(suscrito || suscrito_cup)) {
							pago = ' <i class="fa fa-lock sinrep"></i>';
							bloqueado = '1';
						}
						//~ if(i>0) {
							//~ pago = ' <i class="fa fa-lock sinrep"></i>';
							//~ bloqueado = '1';
						//~ }
						//~ if(catid==5) {
							//~ if(cursos[i].ID!=7) {
								//~ pago = ' <i class="fa fa-lock sinrep"></i>';
								//~ bloqueado = '1';
							//~ } else {
								//~ pago = '';
								//~ bloqueado = '0';
							//~ }
						//~ }
						
						podac = ''+
						'<div class="boxcatex" onclick="app.ponerCurso('+i+','+posc+','+cursos[i].ID+','+bloqueado+');" data-cur="'+i+'">'+
						'	<div class="titCate">'+cursos[i].nombre+pago+'</div>'+
						'	<div class="descCate" style="color:#'+categorias[posc].color+'">'+cursos[i].descripcion+'</div>'+
						'</div>';
						$('.listcursos').append(podac);
						
						
						//~ if(bloqueado == '0') {
							//~ curpos = i;
						//~ }
						
						if(cursos[i].ID==curoreco) {
							curpos = i;
						}
					}
					if(cursos.length==0) {
						$('.listcursos').hide();
					}
					clases = data.clases;
					var podac;
					var candado = '';
					var bloqueado = '0';
							
					$('.listclasesind').html('');
					for(var i=0;i<clases.length;i++) {
						candado = (categorias[i].ID!=5 && !(suscrito || suscrito_cup))?' <i class="fa fa-lock sinrep"></i>':'';
						bloqueado = (categorias[i].ID!=5)?1:0;
						podac = ''+
						'<div class="boxcate" onclick="app.ponerClaseInd('+i+','+posc+','+clases[i].ID+', '+bloqueado+');" data-cur="'+i+'">'+
						'	<div class="titCate">'+clases[i].nombre+candado+'</div>'+
						'</div>';
						$('.listclasesind').append(podac);
					}
					if(clases.length==0) {
						$('#clasessueltit').hide();
					} else {
						$('#clasessueltit').show();
					}
					$('.listetapas').animate({scrollLeft: 37}, 500);
					$('#pantalla13 .boxcatex .titCate').attr('style',categorias[posc].codigo);
					$('#pantalla13 .listclasesind .boxcate').attr('style',categorias[posc].codigo);
					$('#pantalla14 .boxcatex').attr('style',categorias[posc].codigo);
					$('#pantalla14 .tituloCurso').attr('style',categorias[posc].codigo);
					if(!sinc) {
						ponerPantalla('pantalla13');
					} else {
						if(cursos[curpos].gratuito==1 || (suscrito || suscrito_cup)) {
							// pos del curso, pos de la cate, id del curso
							app.ponerCurso(curpos,posc,curoreco, undefined, sinc);
						} else {
							ponerPantalla('pantalla18');
						}
					}
				} else {
					alerta(data.message);
				}
			}
		});
	},
    ponerCurso: function(posc, posci, curid, bloqueado, sinc) {
		bloqueado = (bloqueado==undefined)?0:bloqueado;
		if(!buscandoCont) {
			if(bloqueado==0 || suscrito || suscrito_cup) {
				var datos = {};
				buscandoCont = true;
				var sigclase = 0;
				datos.action = 'getCurso';
				datos.curid = curid;
				console.log("pos del curso: "+posc);
				$('.tituloCurso .titcur').html(cursos[posc].nombre);
				$('.tituloCurso .descur').html(cursos[posc].descripcion);
				ponerLoading();
				$.ajax({
					type: 'POST',
					dataType: 'json',
					url: apiURL,
					data: datos,
					success: function (data) {
						buscandoCont = false;
						sacarLoading();
						if(data.res) {
							if(!sinc) {
								ponerPantalla('pantalla14');
							}
							etapas = data.etapas;
							var podac;
							$('.listetapas .contesli').html('');
							for(var i=0;i<etapas.length;i++) {
								podac = ''+
								'<div class="boxcatecon">'+
								'	<div class="boxcate item">'+
								'		<div class="titEtapa">'+etapas[i].nombre_etapa+'</div>'+
								'		<div class="clasesEtapa">'+
								'			<div class="listclases">';
								for(var j=0;j<etapas[i].clases.length;j++) {
									var claseTom = (inArray(etapas[i].clases[j].ID, estadisticas.clases_c))?'':' activo';
									if(!inArray(etapas[i].clases[j].ID, estadisticas.clases_c)) {
										if(sigclase==0 && sinc) {
											sigclase = 1;
											app.ponerClase(j,i,etapas[i].clases[j].ID, posci);
										}
									}
									podac += ''+
									'			<div class="curItemComp'+claseTom+'" onclick="app.ponerClase('+j+','+i+','+etapas[i].clases[j].ID+', '+posci+');" data-clase="'+j+'">'+
									'				<div class="circItemA">'+
									'					<div class="circItemB"><img src="img/check.png"></div>'+
									'				</div>'+
									'				<div class="numIteCu">'+(j+1)+'</div>'+
									'			</div>';
								}
								if(!inArray(etapas[i].ID, dataFilesStore.etapas)) {
									botondes = '		<div class="volverint btnSinborde btnDescargaFile" data-file="todos" data-tipo="etapas" data-etid="'+etapas[i].ID+'"><div class="fondobotondes"></div><div class="texttodos">descargar todo</div> <div class="marcloca"><div class="bolita"></div></div></div>';
								} else {
									botondes = '		<div class="volverint btnSinborde btnDescargaFileOk" ><div class="iconDecargado"></div> descargado</div>';
								}
								podac += ''+
								'			</div>'+
								'		</div>'+
								'		<div class="separaeta"></div>'+
								botondes+
								'	</div>'+
								'</div>';
								$('.listetapas .contesli').append(podac);
								$('#pantalla14 .listetapas .boxcate').attr('style',categorias[posci].codigo);
								$('#pantalla14 .listetapas .curItemComp .circItemA').attr('style',categorias[posci].codigo);
								$('#pantalla14 .listetapas .curItemComp .circItemB').attr('style',categorias[posci].codigo);
								$('#pantalla14 .bolita').attr('style',categorias[posci].codigo);
								if(categorias[posci].fondo_pantalla!=undefined || categorias[posci].fondo_pantalla!='') {
									$('#pantalla13 .contenidoGen').attr('style','background-image: url('+baseURL+categorias[posci].fondo_pantalla+')');
									$('#pantalla14 .contenidoGen').attr('style','background-image: url('+baseURL+categorias[posci].fondo_pantalla+')');
									$('#pantalla15 .contenidoGen').attr('style','background-image: url('+baseURL+categorias[posci].fondo_pantalla+')');
									$('#pantalla16 .contenidoGen').attr('style','background-image: url('+baseURL+categorias[posci].fondo_pantalla+')');
									$('#pantalla16b .contenidoGen').attr('style','background-image: url('+baseURL+categorias[posci].fondo_pantalla+')');
									$('#pantalla16c .contenidoGen').attr('style','background-image: url('+baseURL+categorias[posci].fondo_pantalla+')');
									$('#pantalla16d .contenidoGen').attr('style','background-image: url('+baseURL+categorias[posci].fondo_pantalla+')');
								}
							}
							
							$('.listetapas').scrollsnap({
								snaps: '.boxcatecon',
								direction: 'x',
								proximity: 170,
								duration : 100
							});
							$('.listetapas').animate({scrollLeft: 37}, 500);
							setTimeout(function() {
								$('.listetapas').animate({scrollLeft: 37}, 500);
							}, 300);
							
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
							if(sigclase==0 && sinc) {
								ponerPantalla('pantalla14');
							}
						} else {
							alerta(data.message);
						}
					}
				});
			} else {
				ponerPantalla('pantalla18');
			}
		}
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
							'	<div class="ultimoCursosTit">'+nonmbrecur+'<br> • <br><span class="curcortinop">'+n_etapas[i].nombre_etapa+'</span></div>'+
							//~ '	<div class="ultimoCursosSubTit">Última práctica</div>'+
							'	<div class="clasesEtapa">'+
							'		<div class="listclases">';
							var last = 0;
							var eselquesigue = false;
							for(var j=0;j<n_etapas[i].clases.length;j++) {
								var claseTom = (inArray(n_etapas[i].clases[j].ID, n_estadisticas.clases_c))?'':' activo';
								if(claseTom!='' && eselquesigue) {
									podac += ''+
									'		<div class="curItemComp" onclick="volverHome=true;app.ponerClase('+(j)+','+i+','+n_etapas[i].clases[j].ID+', '+posci+');" data-clase="'+(j)+'">'+
									'			<div class="circItemA">'+
									'				<div class="circItemB">&laquo;</div>'+
									'			</div>'+
									'			<div class="numIteCu">Práctica '+(j+1)+'</div>'+
									'		</div>';
								}
								if(claseTom=='') {
									eselquesigue = true;
									last++;
								} else {
									eselquesigue = false;
								}
								
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
		if(etapas[posc].clases[i].archivos.length>0) {
			$('.tituloClase').html(etapas[posc].clases[i].nombre_clase);
			$('.descripcionClase').html(etapas[posc].clases[i].descripcion);
			if(volverHome) {
				posetapa = posc;
				poscate = posci;
			}
			posetapa = posc;
			poscate = posci;
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
			app.ponerClaseAudio(0,i,posc,curid);
			$('#tiempoclase').mobiscroll().select({
				display: 'inline',  // Specify display mode like: display: 'bottom' or omit setting to use default
				showInput: false    // More info about showInput: https://docs.mobiscroll.com/4-7-3/select#opt-showInput
			});
			
			//~ $('#pantalla16').attr('style',$('#pantalla16').attr('style')+categorias[posci].codigo);
			$('#pantalla16').attr('style',categorias[posci].codigo);
			$('#pantalla15').attr('style',categorias[posci].codigo);
			$('#pantalla15 .contenidoGen').attr('style','background-image: url('+baseURL+categorias[posci].fondo_pantalla+')');
			$('#pantalla16b').attr('style', categorias[posci].codigo);
			$('#pantalla16b .btnViole').attr('style', categorias[posci].codigo);
			$('#pantalla16 .viole').attr('style', categorias[posci].codigo);
			$('#pantalla16 .bolita').attr('style', categorias[posci].codigo);
			$('#audiosclase .btnGenerico').attr('style',categorias[posci].codigo);
		} else {
			alerta("La clase seleccionada no tiene audios disponibles.");
		}
	},
    ponerClaseInd: function(i, posci, claseid, bloqueado) {
		if(bloqueado==0 || suscrito || suscrito_cup) {
			if(clases[i].archivos.length>0) {
				$('.tituloClaseInd').html(clases[i].nombre);
				ponerPantalla('pantalla16c');
				
				$('#tiempoclase2').html('');
				
				for(var k=0;k<clases[i].archivos.length;k++) {
					$('#tiempoclase2').append('<option value="'+k+'">'+clases[i].archivos[k].duracion+'</option>');
				}
				cur_i_e = i;
				app.ponerClaseAudioInd(0,cur_i_e);
				$('#tiempoclase2').mobiscroll().select({
					display: 'inline',  // Specify display mode like: display: 'bottom' or omit setting to use default
					showInput: false    // More info about showInput: https://docs.mobiscroll.com/4-7-3/select#opt-showInput
				});
				
				$('#pantalla16c').attr('style',categorias[posci].codigo);
				$('#pantalla16d').attr('style', categorias[posci].codigo);
				$('#pantalla16c .btnViole').attr('style', categorias[posci].codigo);
				$('#pantalla16c .viole').attr('style', categorias[posci].codigo);
				$('#pantalla16c .bolita').attr('style', categorias[posci].codigo);
				$('#audiosclasec .btnGenerico').attr('style',categorias[posci].codigo);
			} else {
				alerta('La clase no contiene Audios cargados.');
			}
		} else {
			ponerPantalla('pantalla18');
		}
	},
    ponerClase2: function(j, i, claid, i2) {
		$('.tituloClase2').html(mbsr_cont.semanas[i].clases[j].nombre_clase);
		ponerPantalla('pantalla12d');
		datosClase.audio_ID = mbsr_cont.semanas[i].clases[j].ID;
		registroClase = false;
		$('#uad_MBSR').html('<source src="'+baseURL+mbsr_cont.semanas[i].clases[j].file_clase+'" type="audio/mpeg">Su navegador no sorporta audio HTML5');
		$('#pantalla12d .btnDescargaFile').data('file', baseURL+mbsr_cont.semanas[i].clases[j].file_clase);
		$('#uad_MBSR')[0].pause();
		$('#uad_MBSR')[0].load();
	},
    ponerAudioFile: function(k) {
		app.ponerClaseAudio(k,cur_i,cur_posc,cur_curid);
	},
    ponerAudioFileInd: function(k) {
		app.ponerClaseAudioInd(k,cur_i_e);
	},
    ponerAudioFileTimer: function(k) {
		app.ponerClaseAudio(k,cur_i,cur_posc,cur_curid);
	},
    ponerClaseAudio: function(k,i, posc, curid) {
		$('.tituloClase').html(etapas[posc].clases[i].nombre_clase);
		//~ ponerPantalla('pantalla17');
		datosClase.audio_ID = etapas[posc].clases[i].archivos[k].ID;
		registroClase = false;
		$('#audClaseP').html('<source src="'+baseURL+etapas[posc].clases[i].archivos[k].file_clase+'" type="audio/mpeg">Su navegador no sorporta audio HTML5');
		$('#pantalla16 .btnDescargaFile').data('file', baseURL+etapas[posc].clases[i].archivos[k].file_clase);
		app.rebovinarAudio('audClaseP');
		$('#audClaseP')[0].pause();
		$('#audClaseP')[0].load();
	},
    ponerClaseAudioInd: function(k,i) {
		$('.tituloClaseInd').html(clases[i].nombre);
		//~ ponerPantalla('pantalla17');
		datosClase.audio_ID = clases[i].archivos[k].ID;
		registroClase = false;
		$('#audClaseInd').html('<source src="'+baseURL+clases[i].archivos[k].file_clase+'" type="audio/mpeg">Su navegador no sorporta audio HTML5');
		$('#pantalla16c .btnDescargaFile').data('file', baseURL+clases[i].archivos[k].file_clase);
		
		app.rebovinarAudio('audClaseInd');
		//~ $('#audClaseInd')[0].pause();
		//~ $('#audClaseInd')[0].load();
	},
    ponerTimer: function(dura) {
		var length = timers.length;
		for(var i = 0; i < length; i++) {
			if(timers[i]['tipo'] == dura && timers[i]['nombre']==timerac) {
				//~ ponerPantalla('pantalla6b');
				$('.titSeccionSubT').html(dura+' minutos');
				$('#audTim').html('<source src="'+baseURL+timers[i]['archivo']+'" type="audio/mpeg">Su navegador no sorporta audio HTML5');
				$('#audTim')[0].pause();
				$('#audTim')[0].load();
				app.rebovinarAudio('audTim');
			}
		}
	},
    ponerGuiada: function(dura) {
		var length = guiadas.length;
		for(var i = 0; i < length; i++) {
			if(guiadas[i]['tipo'] == dura && guiadas[i]['nombre']==guiadaac) {
				//~ ponerPantalla('pantalla6b');
				$('#pantalla19b .titSeccionSub').html('MEDITACIÓN '+guiadaac);
				$('#pantalla19b .titSeccionSubT').html(dura+' minutos');
				$('#audGuiada').html('<source src="'+baseURL+guiadas[i]['archivo']+'" type="audio/mpeg">Su navegador no sorporta audio HTML5');
				$('#audGuiada')[0].pause();
				$('#audGuiada')[0].load();
				app.rebovinarAudio('audGuiada');
			}
		}
	},
    rebovinarAudio: function(cual) {
		var method
		var audi = document.getElementById(cual);
		  
		$('.btnPlayMed.ct_'+cual+' .circsma').html('<i class="glyphicon glyphicon-play"></i>');
		estaplay = true
		method = 'pause';
		audi.currentTime = 0; 
		audi[method]();
	},
    doMedIni: function(data) {
		var podnaco = '';
		for(var j=0;j<data.clases_medini;j++) {
			var claseTom = (j==0)?'':' activo';
			podnaco += ''+
			'		<div class="curItemComp'+claseTom+'" >'+
			'			<div class="circItemA violet">'+
			'				<div class="circItemB violet"><img src="img/check.png"></div>'+
			'			</div>'+
			//~ '			<div class="numIteCu violet">'+(j+1)+'</div>'+
			'		</div>';
		}
		$('.contClasesmedini').html(podnaco);
		if(data.fondo!='') {
			$('#pantalla3b').attr('style',data.fondo);
			bntsombra = '-webkit-box-shadow: 5px 5px 10px 0px #'+data.color+'; -moz-box-shadow: 5px 5px 10px 0px #'+data.color+'; box-shadow: 5px 5px 10px 0px #'+data.color+';';
			$('#pantalla3c .btnGenerico').attr('style',data.fondo+bntsombra);
			$('#pantalla3c').attr('style',data.fondo);
			$('#pantalla3').attr('style',data.fondo);
			$('#pantalla3 .btnPlayMed').attr('style',data.fondo);
			$('#pantalla3 .circmed').attr('style',data.fondo);
			$('#pantalla3 .circsma').attr('style',data.fondo);
			$('#pantalla3 .contClasesmedini .circItemA').attr('style',data.fondo);
			$('#pantalla3 .contClasesmedini .circItemB').attr('style',data.fondo);
			$('#pantalla3 .activo .circItemA').attr('style','border-color: #'+data.color+';');
		}
		
		$('#med_ini').html('<source src="'+baseURL+data.datos.file_clase+'" type="audio/mpeg">Su navegador no sorporta audio HTML5');
	},
    doMedDiaria: function(data) {
		$('#diameddia').html(data.dia);
		$('.mensajetip').html(data.mensaje);
		meditadiraria = data.ID;
		$('#audMedDiaria').html('<source src="'+baseURL+data.archivo+'" type="audio/mpeg">Su navegador no sorporta audio HTML5');
	},
    doMensajes: function() {
		$('#mensajeFinenc').html(getTexto('final_encuesta'));
		$('#mensajeInimed').html(getTexto('meditacion_inicial'));
		$('#mensajeInimedFin').html(getTexto('meditacion_inicial_fin'));
		$('#sub_boton_config').html(getTexto('sub_boton_config'));
		$('.termcondcont').html(getTexto('terminos_condiciones'));
		$('.polprivcont').html(getTexto('politicas_privacidad'));
		$('.mensajesdesb').html(getTexto('texto_desbloquear_app'));
		$('.text_mb_1').html(getTexto('programas_slide_1'));
		$('.text_mb_2').html(getTexto('programas_slide_2'));
		$('.descripcionTimers').html(getTexto('intro_timers'));
	},
    doMBSR: function() {
		//~ var splitted = mbsr_cont['descripcion'].split("\n");
		//poner mbsr
		//poner cursos
		$('.nombreprog').html(mbsr_cont.nombre);
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
var beneficios;
var guiadas;
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

function validarSuscrip() {
	if(suscrito || suscrito_cup) {
		$('.bototneraBottom').removeClass('conpub');
		$('.contenidoGen').removeClass('conpub');
		$('.boxprem').hide();
		$('.fa.fa-lock').hide();
	} else {
		$('.bototneraBottom').addClass('conpub');
		$('.contenidoGen').addClass('conpub');
		$('.boxprem').show();
	}
}

function ponerEstadisticas() {
	var conte = ''+
	'<div class="estdis"><b>Tiempo<br>meditado:</b> <span class="numgig">'+secondsToHms(estadisticas.duracion*60)+' </span></div>'+
	'<div class="estdis"><b>Días desde que<br>no meditas:</b> <span class="numgig">'+estadisticas.dias+' </span></div>'+
	'<div class="estdis"><b>Clases tomadas:</b> <span class="numgig">'+estadisticas.clases+'</span></div>'+
	'<div class="estdis"><b>Meditaciones<br>diarias:</b> <span class="numgig">'+estadisticas.meditaciones+'</span></div>'+
	'<div class="estdis"><b>Cursos<br>completados:</b> <span class="numgig">'+estadisticas.cursos_completos+'</span></div>';
	$('.boxEstadisticas').html(conte);
	$('#miscursoscont').append('');
	allcursos = estadisticas.cursosAll;
	cursos = estadisticas.cursosAll;
	$('#miscursoscont').html('');
	for(var i=0;i<estadisticas.cursos.length;i++) {
		var posci=0;
		var curpos=0;
		var totoclases=0;
		for(var k=0;k<allcursos.length;k++) {
			if(allcursos[k].ID==estadisticas.cursos[i].ID) {
				curpos = k;
				posci = allcursos[k].categoria_ID
			}
		}
		//i posicion del cuso
		//~ var item = '<div class="btnNaranja" onclick="app.ponerCurso('+curpos+','+posci+','+estadisticas.cursos[i].ID+')"><div class="nombrcura">'+estadisticas.cursos[i].nombre+'</div><div class="detallecur">'+estadisticas.cursos[i].clases+'/'+estadisticas.cursos[i].clases_tot+'</div><div class="rayausu"></div></div>';
		var item = '<div class="btnNaranja"><div class="nombrcura">'+estadisticas.cursos[i].nombre+'</div><div class="detallecur">'+estadisticas.cursos[i].clases+'/'+estadisticas.cursos[i].clases_tot+'</div><div class="rayausu"></div></div>';
		$('#miscursoscont').append(item);
	}
	dateTimeParts = estadisticas.userInfo.fecha_registro.split(/[- :]/);
	var usercont = ''+
	'<span class="campousert">Nombre: </span> '+estadisticas.userInfo.nombre+'<br>'+
	'<span class="campousert">Apellido: </span> '+estadisticas.userInfo.apellido+'<br>'+
	'<span class="campousert">Email: </span> '+estadisticas.userInfo.email+'<br>'+
	'<span class="campousert">Usuario desde: </span> '+dateTimeParts[2]+'/'+dateTimeParts[1]+'/'+dateTimeParts[0]+'<br>'+
	'';
	$('.contMisDatos').html(usercont);
}
function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? "" : "") : "00";
    var mDisplay = m > 0 ? m + (m == 1 ? "" : "") : "00";
    var sDisplay = s > 0 ? s + (s == 1 ? "" : "") : "00";
    
    hDisplay = h;
    if(h<=9) {
		hDisplay = "0"+h;
	}
    
    mDisplay = m;
    if(m<=9) {
		mDisplay = "0"+m;
	}
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
			//~ setTimeout(function() {
				//~ videoIni.play();
			//~ }, 900);
		}
		$('.splashscreen').remove();
		$('.contenidoApp').removeClass('hidden');
		$('.contenidoApp').fadeIn(600);
	});
}

function ponerPod(num) {
	$('#nomrepod').html(podcasts[num].nombre);
	$('#nomrepod2').html(podcasts[num].nombre);
	 var audio = $("#audPod");      
    $("#podsour").attr("src", baseURL+podcasts[num].archivo);
	$('#audPod').html('<source src="'+baseURL+podcasts[num].archivo+'"  id="podsour" type="audio/mpeg">Su navegador no sorporta audio HTML5');
	$('.tiempopod').html(podcasts[num].duration);
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

function cambiarFondoBody(cual) {
	$('body').removeClass('fondoHome');
	if(cual=='pantalla5') {
		$('body').addClass('fondoHome');
	}
	$('body').removeClass('fondoLibre');
	if(cual=='pantalla9') {
		$('body').addClass('fondoLibre');
	}
	$('body').removeClass('fondoMBSR');
	if(cual=='pantalla12' || cual=='pantalla12b' || cual=='pantalla12c' || cual=='pantalla12d' || cual=='pantalla12e') {
		$('body').addClass('fondoMBSR');
	}
	$('body').removeClass('fondoPod');
	if(cual=='pantalla8' || cual=='pantalla8b' || cual=='pantalla8c') {
		$('body').addClass('fondoPod');
	}
	$('body').removeClass('fondoMedini');
	if(cual=='pantalla3' || cual=='pantalla3b' || cual=='pantalla3c') {
		$('body').addClass('fondoMedini');
	}
	$('body').removeClass('fondoUser');
	if(cual=='pantalla11' || cual=='pantalla11b' || cual=='pantalla11c' || cual=='pantalla20' || cual=='pantalla21') {
		$('body').addClass('fondoUser');
	}
	$('body').removeClass('fondoMeddia');
	if(cual=='pantalla10') {
		$('body').addClass('fondoMeddia');
	}
	$('body').removeClass('fondoResp');
	if(cual=='pantalla7') {
		$('body').addClass('fondoResp');
	}
	$('body').removeClass('fondoCompras');
	if(cual=='pantalla18') {
		$('body').addClass('fondoCompras');
	}
	$('body').removeClass('fondoTimer');
	if(cual=='pantalla6' || cual=='pantalla6a' || cual=='pantalla6b') {
		$('body').addClass('fondoTimer');
	}
	if(cual=='pantalla19' || cual=='pantalla19b') {
		$('body').addClass('fondoTimer');
	}
	if(cual!='pantalla13' && cual!='pantalla14' && cual!='pantalla15' && cual!='pantalla16' && cual!='pantalla16b' && cual!='pantalla16c' && cual!='pantalla16d') {
		$('body').attr('style','');
	}
}

function ponerPantalla(cual) {
	if(!cambiandopantalla) {
		ultimapant = pantact;
		pantact = cual;
		cambiarFondoBody(cual);
		cambiandopantalla=true;
		$('.bototneraBottom').show();
		$('.ventana.activa').fadeOut( 600, function() {
			if(cual!='pantalla14') {
				$('#pantalla14').addClass('hidden');
			}
			if(cual!='pantalla1') {
				$('.videomin')[0].pause();
			}
			$('.ventana.activa').removeClass('activa');
			$('.ventana').addClass('hidden');
			$('#'+cual).removeClass('hidden');
			$('#'+cual).addClass('activa');
			$('#'+cual).fadeIn(600, function() {
				cambiandopantalla=false;
			});
			if(cual=='pantalla2') {
				videoIni.pause();
				ponerPregunta();
			}
			respirando = false;
			rebobinarAudio('audPod');
			rebobinarAudio('med_ini');
			rebobinarAudio('audTim');
			rebobinarAudio('audGuiada');
			rebobinarAudio('audEsfera');
			rebobinarAudio('audMedDiaria');
			rebobinarAudio('audClaseP');
			rebobinarAudio('audClaseInd');
			rebobinarAudio('uad_MBSR');
			rebobinarAudio('audPod');
		});
	}
}

function rebobinarAudio(cual) {
	audi = $("#"+cual)[0];
	audi.currentTime = 0;
	$('.btnPlayMed.ct_'+cual+' .circsma').html('<i class="glyphicon glyphicon-play"></i>');
	estaplay = false;
	method = 'pause';
	audi[method]();
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
	var accion = datos.action;
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: apiURL,
		data: datos,
		success: function (data) {
			estadisticas = data.estadisticas;
			ponerEstadisticas();
			app.ponerInfoHome();
			if(accion=="saveClase") {
				$('#pantalla16b .descripcionClase').html(data.mensaje_random);
			}
		}
	});
};
var datosClase = {};
var isplay = false;
var isLogin = false;
var med_ini = document.getElementById("med_ini")
var audEsfera = document.getElementById("audEsfera")
var audTim = document.getElementById("audTim")
var audGuiada = document.getElementById("audGuiada")
var audPod = document.getElementById("audPod")
var audClaseP = document.getElementById("audClaseP")
var audClaseInd = document.getElementById("audClaseInd")
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

audGuiada.addEventListener('loadedmetadata', function() {
  var duration = audGuiada.duration
  var currentTime = audGuiada.currentTime
});

audPod.addEventListener('loadedmetadata', function() {
  var duration = audPod.duration
  var currentTime = audPod.currentTime
});

audClaseP.addEventListener('loadedmetadata', function() {
  var duration = audClaseP.duration
  var currentTime = audClaseP.currentTime
});

audClaseInd.addEventListener('loadedmetadata', function() {
  var duration = audClaseInd.duration
  var currentTime = audClaseInd.currentTime
});

uad_MBSR.addEventListener('loadedmetadata', function() {
  var duration = uad_MBSR.duration
  var currentTime = uad_MBSR.currentTime
});

document.getElementById('videoIni').addEventListener('ended',detenerVideoHome,false);
function detenerVideoHome(e) {
	ponerPantalla('pantalla2');
}

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
				datos.clase_ID = 126; //claase 1 de iniciales
				registrarAudioComp(datos);
				registroClase = true;
			}
		}
		if(percentage>=1) {
			var audi = document.getElementById(cual);
			audi['pause']();
			audi.currentTime = 0; 
		//~ }
		//~ if(percentage>0.99) {
			$('.btnPlayMed.ct_'+cual+' .circsma').html('<i class="glyphicon glyphicon-play"></i>');
			estaplay = false;
			if(cual=="med_ini") {
				ponerPantalla('pantalla3c');
				
			}
			if(cual=="audClaseP") {
				ponerPantalla('pantalla16b');
			}
			if(cual=="audPod") {
				ponerPantalla('pantalla8c');
			}
			if(cual=="audClaseInd") {
				ponerPantalla('pantalla16d');
			}
			if(cual=="uad_MBSR") {
				ponerPantalla('pantalla12e');
			}
		}
	}
	if(!estadrag) {
		$("#"+cual+"_control").roundSlider("setValue", (Math.round(percentage*100)), 1);
	}
	if(cual=="audPod") {
		//tiempopod;
		if(!isNaN(duration)) {
			$('.tiempopod').html(sToTime(duration-currentTime));
		}
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

function sToTime(t) {
  return padZero(parseInt((t / (60 * 60)) % 24)) + ":" +
         padZero(parseInt((t / (60)) % 60)) + ":" + 
         padZero(parseInt((t) % 60));
}

function padZero(v) {
  return (v < 10) ? "0" + v : v;
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
    targetElement = document.getElementById('pantalla12');// Element to delegate

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
					localStorage.setItem('sinintrombsr', "true");
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

function ponerLoading() {
	$('.loader').removeClass('hidden');
}

function sacarLoading() {
	$('.loader').addClass('hidden');
}

function compartirEnlace() {
	var options = {
	  message: 'Tranqui', // not supported on some apps (Facebook, Instagram)
	  subject: 'Tranqui', // fi. for email
	  url: 'https://tranquiapp.net/shareapp.php',
	  chooserTitle: 'Tranqui' // Android only, you can override the default share sheet title
	}
	window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
}

window.addEventListener('keyboardDidShow', function () {
	$('.bototneraBottom').hide();
});
window.addEventListener('keyboardDidHide', function () {
	$('.bototneraBottom').show();
});


function saveConfig(tipo, valor) {
	var datos = {};
	datos.action = 'saveConfig';
	datos.tipo = tipo;
	datos.userid = userLogId;
	datos.valor = valor;
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: apiURL,
		data: datos,
		success: function (data) {
			app.getConfig();
			//~ if(data.res) {
				//~ alerta(data.message);
			//~ } else {
				//~ alerta(data.message);
			//~ }
		}
	});
}

function guardarFileSto(tipo, valor) {
	if(tipo=='etapa'){
		if(!inArray(valor, dataFilesStore.etapas)) {
			dataFilesStore.etapas.push(valor);
		}
	}
	if(tipo=='files'){
		if(!inArray(valor, dataFilesStore.files)) {
			dataFilesStore.files.push(valor);
		}
	}
	localStorage.setItem('dataFilesStore', JSON.stringify(dataFilesStore));
}

function ponerMBSRAct() {
	var codval =codmbsr;
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
				mbsr_cont = data.mbsr;
				app.doMBSR();
				ponerPantalla('pantalla12c');
			} else {
				alerta("El código ingresado no es válido.");
			}
		}
	});
}


document.addEventListener('DOWNLOADER_downloadProgress', function(event){
  var data = event.data;
});
$.fn.roundSlider.prototype._handleDragDistance = 90;
