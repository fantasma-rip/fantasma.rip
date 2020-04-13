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
            imprimir(500);
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

        function imprimir(muertes) {

            let loader = new THREE.OBJLoader();
            let url = "models/humano.obj"

            loader.load(
                url,
                object => {

                var R = 10;

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



        $('.texto1').click(function () {
            $('.paises').toggleClass('activo');
        });


       

    });
})(jQuery);