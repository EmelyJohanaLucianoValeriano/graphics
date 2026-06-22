export class CanvasLocal {
  protected graphics: CanvasRenderingContext2D;
  protected rWidth:number;
  protected rHeight:number;
  protected maxX: number;
  protected maxY: number;
  protected pixelSize: number;
  protected centerX: number;
  protected centerY: number;
  
  public constructor(g: CanvasRenderingContext2D, canvas: HTMLCanvasElement){
    this.graphics = g;
    this.rWidth = 12;
    this.rHeight= 8;
    this.maxX = canvas.width - 1;
    this.maxY = canvas.height - 1;
    this.pixelSize = Math.max(this.rWidth / this.maxX, this.rHeight / this.maxY);
    this.centerX = this.maxX/12;
    this.centerY = this.maxY/8*7;
  }

  iX(x: number):number{return Math.round(this.centerX + x/this.pixelSize);}
  iY(y: number):number{return Math.round(this.centerY - y / this.pixelSize); }
  
  drawLine(x1: number, y1: number, x2: number, y2:number) {
    this.graphics.beginPath();
    this.graphics.moveTo(x1, y1);
    this.graphics.lineTo(x2, y2);
    this.graphics.closePath();
    this.graphics.stroke();
  }

  drawRmboide(x1: number, y1: number, x2: number, y2: number, x3:number, y3:number, x4:number, y4:number, color:string) {
    this.graphics.fillStyle = color;
    this.graphics.beginPath();
    this.graphics.moveTo(x1, y1);
    this.graphics.lineTo(x2, y2);
    this.graphics.lineTo(x3, y3); 
    this.graphics.lineTo(x4, y4);
    this.graphics.closePath();
    this.graphics.stroke();
    this.graphics.fill();
  }

  drawBarra3d(x1: number, y1: number, x2: number, y2: number, x3:number, y3:number, x4:number, y4:number, x5:number, y5:number, x6:number, y6:number,color:string) {
    this.graphics.fillStyle = color;
    this.graphics.beginPath();
    this.graphics.moveTo(x1, y1);
    this.graphics.lineTo(x2, y2);
    this.graphics.lineTo(x3, y3); 
    this.graphics.lineTo(x4, y4);
    this.graphics.lineTo(x5, y5);
    this.graphics.lineTo(x6, y6);
    this.graphics.closePath();
    this.graphics.stroke();
    this.graphics.fill();
  }

  fx(x:number):number {
    return Math.sin(x*2.5);
  }

  maxH(h: number[]): number{
    let max = h[0];
    for (let i = 1; i < h.length; i++) {
      if (max < h[i]) max = h[i];
    }
    let res:number;
    let pot: number = 10;
    while (pot<max) {
      pot *= 10;
    }
    pot /= 10;
    res = Math.ceil(max / pot) * pot;
    return res;
  }

  barra(x:number, y:number, alt:number):void{
    this.drawLine(this.iX(x), this.iY(0), this.iX(x-0.5), this.iY(0.5));
    this.drawLine(this.iX(x-0.5), this.iY(0.5), this.iX(x-0.5), this.iY(y+alt));
    this.drawLine(this.iX(x-0.5), this.iY(y+alt), this.iX(x), this.iY(y+alt-0.5));
    this.drawLine(this.iX(x), this.iY(y+alt-0.5), this.iX(x+0.5), this.iY(y+alt));
    this.drawLine(this.iX(x+0.5), this.iY(y+alt), this.iX(x+0.5), this.iY(0.5));
    this.drawLine(this.iX(x+0.5), this.iY(0.5), this.iX(x), this.iY(0));
    this.drawLine(this.iX(x), this.iY(0), this.iX(x), this.iY(y+alt-0.5));
    this.graphics.strokeStyle = 'gray';
    this.drawLine(this.iX(x-0.5), this.iY(y+alt), this.iX(x-0.5), this.iY(this.rHeight-2));
    this.drawLine(this.iX(x), this.iY(y+alt-0.5), this.iX(x), this.iY(this.rHeight-2.5));
    this.drawLine(this.iX(x+0.5), this.iY(y+alt), this.iX(x+0.5), this.iY(this.rHeight-2));
    this.drawLine(this.iX(x-0.5), this.iY(this.rHeight-2), this.iX(x), this.iY(this.rHeight-1.5));
    this.drawLine(this.iX(x+0.5), this.iY(this.rHeight-2), this.iX(x), this.iY(this.rHeight-1.5));
    this.drawLine(this.iX(x-0.5), this.iY(this.rHeight-2), this.iX(x), this.iY(this.rHeight-2.5));
    this.drawLine(this.iX(x+0.5), this.iY(this.rHeight-2), this.iX(x), this.iY(this.rHeight-2.5));
    this.graphics.strokeStyle = 'black';
  }

  paint(h: number[] = []) {
    if (!h || h.length === 0) return;
    this.graphics.clearRect(0, 0, this.graphics.canvas.width, this.graphics.canvas.height);
    
    let maxEsc: number;
    let colors: string[]= ['magenta', 'red', 'green', 'yellow', 'blue', 'magenta', 'red', 'green', 'yellow', 'blue'];
    maxEsc = this.maxH(h);

    this.graphics.strokeStyle = 'black';
    this.drawLine(this.iX(0), this.iY(0), this.iX(9), this.iY(0)); 
    this.drawLine(this.iX(0), this.iY(0), this.iX(0), this.iY(7)); 

    let i = 0;
    for (let x = 0.25; x <= 9; x += 2.125){
      this.drawLine(this.iX(x-0.25), this.iY(0), this.iX(x), this.iY(0.5));
      this.drawLine(this.iX(x), this.iY(0.5), this.iX(x), this.iY(7));
      this.graphics.strokeText((maxEsc*i/4)+"", this.iX(x-0.4), this.iY(-0.3));
      i++;
    }

    let avance = (6 / (Math.max(h.length, 1) * 1.5)); 
    let yStart = 0.5;

    for (let ind = 0; ind < h.length; ind++) {
      let y = yStart + (ind * avance * 1.5); 
      let valX = 8.5 * h[ind] / maxEsc;      

      this.graphics.strokeStyle = colors[ind % colors.length];
      this.graphics.fillStyle = colors[ind % colors.length];

      this.drawBarra3d(
          this.iX(0), this.iY(y),                   
          this.iX(valX), this.iY(y),                
          this.iX(valX+0.5), this.iY(y+0.25),       
          this.iX(valX+0.5), this.iY(y+avance+0.25),
          this.iX(0.5), this.iY(y+avance+0.25),     
          this.iX(0), this.iY(y+avance),            
          colors[ind % colors.length]
      ); 
  
      this.graphics.strokeStyle = 'black';
      
      this.drawLine(this.iX(0), this.iY(y), this.iX(valX), this.iY(y));
      this.drawLine(this.iX(valX), this.iY(y), this.iX(valX), this.iY(y+avance));
      this.drawLine(this.iX(0), this.iY(y), this.iX(0), this.iY(y+avance));
      this.drawLine(this.iX(0), this.iY(y+avance), this.iX(valX), this.iY(y+avance));
      
      this.drawLine(this.iX(valX), this.iY(y), this.iX(valX+0.5), this.iY(y+0.25));
      this.drawLine(this.iX(valX+0.5), this.iY(y+0.25), this.iX(valX+0.5), this.iY(y+avance+0.25));
      this.drawLine(this.iX(valX), this.iY(y+avance), this.iX(valX+0.5), this.iY(y+avance+0.25));
      
      this.drawLine(this.iX(0), this.iY(y+avance), this.iX(0.5), this.iY(y+avance+0.25));
      this.drawLine(this.iX(0.5), this.iY(y+avance+0.25), this.iX(valX+0.5), this.iY(y+avance+0.25));
    }
    
    for (let j = 0; j < h.length; j++) {
      this.graphics.strokeText("Valor: "+h[j], this.iX(10.5), this.iY(6 - j));
      this.graphics.fillStyle = colors[j % colors.length];
      this.graphics.fillRect(this.iX(10), this.iY(6 - j), 10, 10);
    }
  }

  // --- NUEVAS FUNCIONES PARA MODELADO 3D --- //

  // Proyección ortográfica/isométrica simple de 3D a 2D
  project(x: number, y: number, z: number): {px: number, py: number} {
    let px = x * 0.866 - z * 0.866;
    let py = y + x * 0.5 + z * 0.5;
    return {px, py};
  }

  draw3DObject(vertices: {x:number, y:number, z:number}[], faces: number[][]) {
    this.graphics.clearRect(0, 0, this.graphics.canvas.width, this.graphics.canvas.height);
    this.graphics.strokeStyle = '#273b47';
    this.graphics.lineWidth = 1.5;

    if (vertices.length === 0) return;

    // AUTO-ESCALA: Calculamos los límites de la figura para que la cámara siempre la enfoque
    let minPx = Infinity, maxPx = -Infinity;
    let minPy = Infinity, maxPy = -Infinity;
    
    let projs = vertices.map(v => {
        let p = this.project(v.x, v.y, v.z);
        if(p.px < minPx) minPx = p.px;
        if(p.px > maxPx) maxPx = p.px;
        if(p.py < minPy) minPy = p.py;
        if(p.py > maxPy) maxPy = p.py;
        return p;
    });

    let width = maxPx - minPx;
    let height = maxPy - minPy;
    let scaleX = (this.graphics.canvas.width * 0.8) / (width === 0 ? 1 : width);
    let scaleY = (this.graphics.canvas.height * 0.8) / (height === 0 ? 1 : height);
    let scale = Math.min(scaleX, scaleY);

    let cx = this.graphics.canvas.width / 2 - ((minPx + maxPx) / 2) * scale;
    let cy = this.graphics.canvas.height / 2 + ((minPy + maxPy) / 2) * scale;

    for (let face of faces) {
      this.graphics.beginPath();
      for (let i = 0; i < face.length; i++) {
        let vIdx = face[i] - 1; // El archivo TXT cuenta desde 1, los arreglos desde 0
        if(vIdx >= 0 && vIdx < vertices.length) {
            let proj = projs[vIdx];
            let sx = cx + proj.px * scale;
            let sy = cy - proj.py * scale; 

            if (i === 0) this.graphics.moveTo(sx, sy);
            else this.graphics.lineTo(sx, sy);
        }
      }
      this.graphics.closePath();
      this.graphics.stroke();
    }
  }
}