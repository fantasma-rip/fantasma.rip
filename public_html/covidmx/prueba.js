(function ($) {
    $(window).on('load', function () {

        let scene;
        let camera;
        let renderer;

        setup();
        draw();

        function setup() {
            setupScene();
            setupCamera();
            setupLights();
            setupRenderer();
            setupEventListeners();
        }

        var datos = 'https://pomber.github.io/covid19/timeseries.json';

        var fecha = '';
        var muertes = '';
        var country = 'Mexico';
        var clave = '2020-4-10';
        var multiplo = 1;

        conseguirdatos(clave, multiplo, country);

        var tenerdatos = '';
        var error = '';
        function conseguirdatos(clave, multiplo, country) {

            tenerdatos = $.getJSON(datos, function (data) {
                $.each(data[country], function (index, value) {
                    if (value.date == clave) {
                        fecha = value.date;
                        muertes = value.deaths * multiplo;
                        $('#muertes span').html(Math.ceil(muertes));
                        $('#fecha').html(fecha);
                        imprimir(fecha,
                            muertes);
                    }
                });
            }).done(function () {
                console.log("corrio los datos");
            }).fail(function (tenerdatos, textStatus, error) {
                var err = textStatus + ', ' + error;
                console.log("fallo: " + err);
            }).always(function () {
                console.log("cargo completo");
            });

        }
        function setupScene() {
            scene = new THREE.Scene();
        }

        function setupCamera() {
            let res = window.innerWidth / window.innerHeight;
            camera = new THREE.PerspectiveCamera( 75, res, 0.1, 1000);
            camera.position.z = 25;
        }

        function setupRenderer() {
            renderer = new THREE.WebGLRenderer({
                antialias: true
            });
            renderer.setSize(
                window.innerWidth,
                window.innerHeight);
            document.body.appendChild(renderer.domElement);

            controls = new THREE.OrbitControls(camera, renderer.domElement);
        }

        function setupLights() {
            let ambientLight = new THREE.AmbientLight(0x858585);
            scene.add(ambientLight);
            scene.background = new THREE.Color( 0xF7F7F8 );
            let spotLight = new THREE.SpotLight(0xaaaaaa);
            spotLight.position.set( 100, 1000, 100 );
            spotLight.castShadow = true;
            scene.add(spotLight);
        }

        function imprimir(fecha,
            muertes) {

            let loader = new THREE.OBJLoader();
            let url = "models/humano.obj"

            loader.load(
                url,
                object => {


            var R = 50/muertes;

            for (let i = 0; i < muertes;) {
                var posiciones = (Math.random() - 0.5) * R * 2 * Math.random();
                var posiciones2 = (Math.random() - 0.5) * R * 2 * Math.random();
                var posiciones3 = (Math.random() - 0.5) * R * 2 * Math.random();

                object = object.clone();

                object.scale.set(35/muertes,35/muertes,35/muertes);
                object.rotation.z = (Math.random() - 0.5) * R * 360 * Math.random();
                var material = new THREE.MeshNormalMaterial({
                });

                object.traverse( ( obj ) => {

                    if ( obj instanceof THREE.Mesh ) obj.material = material;
                
                } );

				object.position.set(posiciones, posiciones2, posiciones3);


                var distance_squared = object.position.x * object.position.x + object.position.y * object.position.y + object.position.z * object.position.z;

                if (distance_squared <= R * R) {
                    scene.add(object);
                    ++i;
                }
            }

            },
            xhr => {
                let amount = Math.round(xhr.loaded / xhr.total * 100);
                console.log(`${amount}% loaded`);
            },
            () => {
                console.log('An error happened');
            }
        );


        }

        function draw() {
            camera.position.z -= 0.01;
            requestAnimationFrame(draw);
            renderer.render(scene, camera);
        }


        function setupEventListeners() {
            window.addEventListener("resize", onWindowResize);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }




        /*
        $('.nextarr').click(function () {
        });
        $('.prevarr').click(function () {
        });
        $('#fecha').on('change', function () {
            $('canvas').remove();
            setup();
            var claveformato = $(this).val();
            var claveformato = new Date(claveformato);
            var d = claveformato.getDate();
            var m =  claveformato.getMonth();
            m += 1;  // JavaScript months are 0-11
            var y = claveformato.getFullYear();
            clave = y + "-" + m + "-" + d;
            console.log(clave);
            conseguirdatos(clave);
        });
        */
        $('.texto1').click(function () {
            $('.paises').toggleClass('activo');
        });
       
        $('.p_se').click(function () {
            $('.paises').removeClass('activo');
            $('.p_se').removeClass('activo');
            $(this).toggleClass('activo');
            $('canvas').remove();
            setup();
            var country = $(this).find('p').html();
            $('#paisponer').html(country);
            var clave = '2020-4-10';
            var multiplo = 1;
            conseguirdatos(clave, multiplo, country);
        });
        /*
        $('#centinela').click(function () {
            if($(this).hasClass('activo')){
                $(this).removeClass('activo');
                $(this).html('Activar escala 1 : 8');
                $('canvas').remove();
                setup();
                multiplo = 1;
                conseguirdatos(clave, multiplo, country);
            }else{
                $(this).addClass('activo');
                $(this).html('Activar escala 1 : 1');
                $('canvas').remove();
                setup();
                multiplo = 8.2;
                conseguirdatos(clave, multiplo, country);
            }
        });
        */



    });
})(jQuery);