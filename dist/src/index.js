import { CanvasLocal } from './canvasLocal.js';
let canvas = document.getElementById('circlechart');
let graphics = canvas.getContext('2d');
const miCanvas = new CanvasLocal(graphics, canvas);
// Estructuras para almacenar los datos del modelo 3D del ventilador
let vertices3D = [];
let faces3D = [];
let originalVertices3D = [];
let angulo = 0;
// Referencias a los elementos del DOM de la interfaz
const fileInput = document.getElementById('fileInput');
const btnRotar = document.getElementById('btnRotar');
const fileNameDisplay = document.getElementById('fileNameDisplay');
if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        var _a;
        const target = e.target;
        const file = (_a = target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        // Actualizamos el nombre en la interfaz si el elemento existe
        if (fileNameDisplay) {
            fileNameDisplay.textContent = file.name;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            var _a;
            const text = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
            parseData3D(text);
            // Pasamos los 3 argumentos para que no brinque la imagen
            miCanvas.draw3DObject(vertices3D, faces3D, originalVertices3D);
        };
        reader.readAsText(file);
    });
}
if (btnRotar) {
    btnRotar.addEventListener('click', () => {
        if (vertices3D.length === 0) {
            alert("Por favor, sube primero tu archivo TXT del ventilador.");
            return;
        }
        angulo += 0.45; // Velocidad de giro de las aspas
        // --- LÓGICA DE ROTACIÓN DEL VENTILADOR ---
        // Los primeros 24 vértices corresponden a la base y el poste (estáticos).
        // A partir del índice 24 giran el centro y las aspas en el eje frontal (Z).
        for (let i = 24; i < vertices3D.length; i++) {
            let ov = originalVertices3D[i];
            vertices3D[i] = {
                x: ov.x * Math.cos(angulo) - ov.y * Math.sin(angulo),
                y: ov.x * Math.sin(angulo) + ov.y * Math.cos(angulo),
                z: ov.z
            };
        }
        // Redibujamos la pantalla pasando la matriz original para estabilizar
        miCanvas.draw3DObject(vertices3D, faces3D, originalVertices3D);
    });
}
// Función encargada de estructurar el archivo TXT a coordenadas de memoria
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
            if (parts.length >= 4) {
                const x = parseFloat(parts[1]);
                const y = parseFloat(parts[2]);
                const z = parseFloat(parts[3]);
                vertices3D.push({ x, y, z });
                originalVertices3D.push({ x, y, z });
            }
        }
        else {
            const parts = line.replace('.', '').split(/\s+/);
            const faceIndices = parts.map(p => parseInt(p)).filter(n => !isNaN(n));
            if (faceIndices.length > 0) {
                faces3D.push(faceIndices);
            }
        }
    }
}
