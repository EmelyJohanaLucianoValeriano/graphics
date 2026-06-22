import { CanvasLocal } from './canvasLocal.js';
let canvas = document.getElementById('circlechart');
let graphics = canvas.getContext('2d');
const miCanvas = new CanvasLocal(graphics, canvas);
// Estructuras para almacenar los datos del modelo 3D
let vertices3D = [];
let faces3D = [];
let originalVertices3D = [];
let angulo = 0;
// Lógica para cargar y manipular el archivo .txt
const fileInput = document.getElementById('fileInput');
const btnRotar = document.getElementById('btnRotar');
if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        var _a;
        const target = e.target;
        const file = (_a = target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (event) => {
            var _a;
            const text = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
            parseData3D(text);
            miCanvas.draw3DObject(vertices3D, faces3D);
        };
        reader.readAsText(file);
    });
}
if (btnRotar) {
    btnRotar.addEventListener('click', () => {
        if (vertices3D.length === 0) {
            alert("Primero carga un archivo 3D.");
            return;
        }
        angulo += 0.2; // Velocidad de giro base
        // Rotación de la manecilla de los minutos (Vértices 35 al 42)
        for (let i = 34; i < 42; i++) {
            let ov = originalVertices3D[i];
            vertices3D[i] = {
                x: ov.x * Math.cos(angulo) - ov.z * Math.sin(angulo),
                y: ov.y,
                z: ov.x * Math.sin(angulo) + ov.z * Math.cos(angulo)
            };
        }
        // Rotación de la manecilla de las horas (Vértices 43 al 50)
        // Gira 12 veces más lento para mayor realismo
        let anguloHoras = angulo / 12;
        for (let i = 42; i < 50; i++) {
            let ov = originalVertices3D[i];
            vertices3D[i] = {
                x: ov.x * Math.cos(anguloHoras) - ov.z * Math.sin(anguloHoras),
                y: ov.y,
                z: ov.x * Math.sin(anguloHoras) + ov.z * Math.cos(anguloHoras)
            };
        }
        // Redibujamos la pantalla con la nueva rotación
        miCanvas.draw3DObject(vertices3D, faces3D);
    });
}
// Función encargada de leer el archivo TXT
function parseData3D(data) {
    vertices3D = [];
    faces3D = [];
    originalVertices3D = [];
    let isFacesSection = false;
    const lines = data.split('\n');
    for (let line of lines) {
        line = line.trim();
        if (line === '')
            continue;
        if (line.includes('Faces:')) {
            isFacesSection = true;
            continue;
        }
        if (!isFacesSection) {
            const parts = line.split(/\s+/);
            // El formato es: id x y z
            if (parts.length >= 4) {
                const x = parseFloat(parts[1]);
                const y = parseFloat(parts[2]);
                const z = parseFloat(parts[3]);
                vertices3D.push({ x, y, z });
                originalVertices3D.push({ x, y, z });
            }
        }
        else {
            // Eliminar el punto final y procesar la cara
            const parts = line.replace('.', '').split(/\s+/);
            const faceIndices = parts.map(p => parseInt(p)).filter(n => !isNaN(n));
            if (faceIndices.length > 0) {
                faces3D.push(faceIndices);
            }
        }
    }
}
