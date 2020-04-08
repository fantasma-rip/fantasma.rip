
        (function ($) {
                $(window).on('load', function () {

                    var datos = 'https://raw.githubusercontent.com/emirelesg/covid19-mx/master/public/api/stats.json';

                    var nombre = '';
                    var sospechosos = '';
                    var confirmados = '';
                    var muertes = '';
                    var clave = 'CDMX';

                    conseguirdatos(clave);

                    var tenerdatos = '';
                    var error = '';
                    

                    function conseguirdatos(clave) {

                        tenerdatos = $.getJSON(datos, function (data) {
                            $.each(data.statesAsArray, function (index, value) {
                                if (value.key == clave) {
                                    nombre = value.name;
                                    sospechosos = value.suspected;
                                    confirmados = value.confirmed;
                                    muertes = value.deaths;
                                    $('#sospechosos span').html(sospechosos);
                                    $('#infectados span').html(confirmados);
                                    $('#muertes span').html(muertes);
                                    $('#aqui').html(nombre);
                                    imprimir(nombre, sospechosos, confirmados,
                                        muertes);
                                }
                            });
                        }).done(function() {
                            console.log("todo bien");
                        }).fail(function(tenerdatos, textStatus, error) {
                            var err = textStatus + ', ' + error;
                            console.log("fallo: " + err);
                        }).always(function() {
                            console.log("completo");
                        });

                    }
/*
                    function sacargrafica() {
                        $('.datos').html('');
                        $.getJSON(datos, function (data) {
                            $.each(data.timeseries, function (index, value) {
                            fecha = value.date;
                            sospechosos = value.suspected;
                            confirmados = value.confirmed;
                            muertes = value.deaths;
                            var rconf = confirmados * 0.05;
                            var rdead = (muertes / confirmados) * 100;
                            rdead = rdead.toFixed(2);
                            zinde = rconf.toFixed(0);
                            $('.datos').append("<div class='estadogrph' style='height: " + rconf + "vw;'><span class='confirmed'>" + confirmados + "</span><span class='deaths'>" + muertes + "</span></div>");
                            });
                        });

                    }
                    */

                    function imprimir(nombre, sospechosos, confirmados, muertes) {

                        $('canvas').remove();
                        var scene = new THREE.Scene();
                        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window
                            .innerHeight, 0.1, 1000);

                        var renderer = new THREE.WebGLRenderer({
                            alpha: true
                        });
                        renderer.setClearColor(0xE4E2DE, 0);
                        renderer.setSize(window.innerWidth, window.innerHeight);
                        document.body.appendChild(renderer.domElement);

                        window.addEventListener('resize', function () {
                            var width = window.innerWidth;
                            var height = window.innerHeight;
                            renderer.setSize(width, height);
                            camera.aspect = width / height;
                            camera.updateProjectionMatrix();
                        });
                        controls = new THREE.OrbitControls(camera, renderer.domElement);

                        var light = new THREE.DirectionalLight(0xE4E2DE);
                        light.position.set(0.2, 1, 1).normalize();
                        scene.add(light);

                        var R=20;
                        for (let i = 0; i < sospechosos;) {
                            if (i < muertes) {
                                var material = new THREE.MeshToonMaterial({
                                    color: 0xB72A14
                                });
                            } else if (i < confirmados && i > muertes) {
                                var material = new THREE.MeshToonMaterial({
                                    color: 0xAED4C2
                                });
                            } else {
                                var material = new THREE.MeshToonMaterial({
                                    color: 0x6b6b6b
                                });
                            }
                            if ($(window).width() < 960) {
                            } else {
                             }

                             var geometry = new THREE.SphereGeometry(0.2, 3, 3);
                             var figura = new THREE.Mesh(geometry, material);

                             figura.position.x = ( Math.random() - 0.5) * R*2 * Math.random();
                             figura.position.y = ( Math.random() - 0.5) * R*2 * Math.random() ;
                             figura.position.z = ( Math.random() - 0.5) * R*2 * Math.random() ;
                         
                             figura.rotation.x = Math.random();
                             figura.rotation.y = Math.random();
                             figura.rotation.z = Math.random();
                         
                             var distance_squared = figura.position.x*figura.position.x + figura.position.y*figura.position.y + figura.position.z*figura.position.z;
                         
                             if(distance_squared <= R*R) {
                                 scene.add(figura);
                                 ++i;
                             }
                        }

                        camera.position.z = 32;

                        var update = function () {
                            camera.position.z -= 0.001;
                        };
                        var render = function () {
                            renderer.render(scene, camera);
                        };

                        var GameLoop = function () {
                            requestAnimationFrame(GameLoop);
                            update();
                            render();
                        }

                        GameLoop();

                    }





                    $('.nextarr').click(function() {
                        $('#estado option:selected').next().attr('selected', 'selected');
                        var clave = $('#estado option:selected').val();
                        conseguirdatos(clave);
                    });
                    $('.prevarr').click(function() {
                        $('#estado option:selected').prev().attr('selected', 'selected');
                        var clave = $('#estado option:selected').val();
                        conseguirdatos(clave);
                    });

                    $('#estado').on('change', function () {
                        var clave = $(this).val();
                        conseguirdatos(clave);
                    });



                });
        })(jQuery);