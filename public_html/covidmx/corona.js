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

        var datos = 'https://raw.githubusercontent.com/emirelesg/covid19-mx/master/public/api/stats.json';

        var fecha = '';
        var confirmados = '';
        var muertes = '';
        var clave = '2020-04-10';
        var multiplo = 1;

        conseguirdatos(clave);

        var tenerdatos = '';
        var error = '';
        function conseguirdatos(clave, multiplo) {

            tenerdatos = $.getJSON(datos, function (data) {
                $.each(data.timeseries, function (index, value) {
                    if (value.date == clave) {
                        fecha = value.date;
                        confirmados = value.confirmed;
                        muertes = value.deaths;
                        $('#infectados span').html(confirmados);
                        $('#muertes span').html(muertes);
                        $('#fecha').html(fecha);
                        imprimir(fecha, confirmados,
                            muertes, multiplo);
                    }
                });
            }).done(function () {
                console.log("todo bien");
            }).fail(function (tenerdatos, textStatus, error) {
                var err = textStatus + ', ' + error;
                console.log("fallo: " + err);
            }).always(function () {
                console.log("completo");
            });

        }
        function setupScene() {
            scene = new THREE.Scene();
        }

        function setupCamera() {
            let res = window.innerWidth / window.innerHeight;
            camera = new THREE.PerspectiveCamera( 75, res, 0.1, 1000);
            camera.position.z = 15;
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
            let ambientLight = new THREE.AmbientLight(0x101010);
            scene.add(ambientLight);
            let spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set( -10, -10, -10);
            spotLight.castShadow = true;
            scene.add(spotLight);
            let spotLight2 = new THREE.SpotLight(0xf0f0f0);
            spotLight2.position.set( 10, 10, 10);
            spotLight2.castShadow = true;
            scene.add(spotLight2);
        }

        function imprimir(fecha, confirmados,
            muertes, multiplo) {

                alert(multiplo);


            let loader = new THREE.OBJLoader();
            let url = "models/humano.obj"

            loader.load(
                url,
                object => {


            var R = 20;
            var pop = (confirmados + muertes) * multiplo;
            for (let i = 0; i < pop;) {
                var posiciones = (Math.random() - 0.5) * R * 2 * Math.random();
                var posiciones2 = (Math.random() - 0.5) * R * 2 * Math.random();
                var posiciones3 = (Math.random() - 0.5) * R * 2 * Math.random();

                object = object.clone();

                if (i < muertes) {
                    object.scale.set(0.05,0.05,0.05);
                    var material = new THREE.MeshLambertMaterial({
                        color: 0xFB525B
                    });
                    
                } else {
                    object.scale.set(0.01,0.01,0.01);
                    var material = new THREE.MeshToonMaterial({
                        color: 0xC3DDDF
                    });
                }
                if ($(window).width() < 960) {} else {}
                
                object.traverse( ( obj ) => {

                    if ( obj instanceof THREE.Mesh ) obj.material = material;
                
                } );

				object.position.set(posiciones, posiciones2, posiciones3);

                object.rotation.z = (Math.random() - 0.5) * R * 360 * Math.random();

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
            camera.position.z -= 0.001;
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




        $('.nextarr').click(function () {
            $('canvas').remove();
            setup();
            var clave = $('#estado').val();
            conseguirdatos(clave);
        });
        $('.prevarr').click(function () {
            $('canvas').remove();
            setup();
            var clave = $('#estado').val();
            conseguirdatos(clave);
        });
        $('#estado').on('change', function () {
            $('canvas').remove();
            setup();
            var clave = $(this).val();
            conseguirdatos(clave);
        });
        $('#centinela').click(function () {
            if($(this).hasClass('activo')){
                $(this).removeClass('activo');
                $('canvas').remove();
                setup();
                multiplo = 1;
                conseguirdatos(clave, multiplo);
            }else{
                $(this).addClass('activo');
                $('canvas').remove();
                setup();
                multiplo = 8.2;
                conseguirdatos(clave, multiplo);
            }
        });



    });
})(jQuery);