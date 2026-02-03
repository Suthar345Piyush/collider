// canvas api code here 

import { useRef , useEffect , useCallback  } from "react";
import type { Particle , SpawnPreview , Vec2 } from "../types";
import  { vec } from "../physics/vector";


interface CanvasProps {
   width : number;
   height : number;
   particles : Particle[];
   preview : SpawnPreview | null;
   showVelocityVectors : boolean;
   wallEnabled : boolean,
   onMouseMoves : (pos : Vec2 | null) => void;
   onClick : (pos : Vec2) => void;
}


export function SimulationCanvas({
    width,
    height,
    particles,
    preview,
    showVelocityVectors,
    wallEnabled,
    onMouseMoves,
    onClick,
} : CanvasProps) {
      

     const canvasRef = useRef<HTMLCanvasElement>(null);


     // drawing loop 

     useEffect(() => {
         
        const canvas = canvasRef.current;
        if(!canvas) return;

        const ctx = canvas.getContext("2d");

        if(!ctx) return;



        // clearing rectangle  

        ctx.clearRect(0 , 0 , width , height);


        //grid like shape  background 

        ctx.strokeStyle = "rgba(100 , 120 , 160 , 0.08)";
        ctx.lineWidth = 1;


        const gridSize = 40;

        // for x

        for(let x=0; x<=width; x += gridSize) {

            ctx.beginPath();
            ctx.moveTo(x , 0);
            ctx.lineTo(x , height);
            ctx.stroke();

        }

     // for y

        for(let y=0; y <= height; y += gridSize) {


           ctx.beginPath();
           ctx.moveTo(0 , y);
           ctx.lineTo(width , y);
           ctx.stroke();

        }

        // walls border  

        if(wallEnabled) {

           ctx.strokeStyle = "rgba(80 , 160 , 255 , 0.35)";
           ctx.lineWidth = 3;
           ctx.setLineDash([8 , 6]);
           ctx.strokeRect(1.5 , 1.5 , width - 3 , height - 3);
           ctx.setLineDash([]);

        }


        // drawing each particle 

        particles.forEach((p) => {
           drawTrail(ctx , p);
           drawParticle(ctx , p);

           if(showVelocityVectors) drawVelocityVector(ctx , p);
        });



        // drawing preview first 

        if(preview) {
           drawTrajectory(ctx , preview.trajectoryPoints);
           drawGhost(ctx , preview);
        }
     } , [width , height , particles , preview , wallEnabled , showVelocityVectors]);






     // handling mouse gestures / movements , getting mouse positions 


     const getPos = useCallback((e : React.MouseEvent<HTMLCanvasElement>) : Vec2 => {
        
        const rect = canvasRef.current!.getBoundingClientRect();

        const scaleX = width / rect.width;
        const scaleY = height / rect.height;


        return {

           x : (e.clientX - rect.left) * scaleX,
           y : (e.clientY - rect.top) * scaleY,

        };

     } , [width , height]);





     // mouse movement function 

     const handleMouseMove = useCallback((e : React.MouseEvent<HTMLCanvasElement>) => {

        onMouseMoves(getPos(e));

     } , [onMouseMoves , getPos]);




     // mouse leave function 

     const handleMouseLeave = useCallback(() => {

        onMouseMoves(null);

     } , [onMouseMoves]);


     // click event function 

     const handleClick = useCallback((e : React.MouseEvent<HTMLCanvasElement>) => {

        onClick(getPos(e));

     } , [onClick , getPos]);


     return (
        <canvas 
         ref={canvasRef} width={width} height={height} style={{cursor : 'crosshair' , display : 'block' , borderRadius : "12px"}}

         onMouseMove={handleMouseMove}
         onMouseLeave={handleMouseLeave}
         onClick={handleClick}
        
        />
     );

}




 // some helper function for drawing on canvas 


// particle trail drawing  function 

function drawTrail(ctx : CanvasRenderingContext2D , p : Particle) {
      
      if(p.trail.length < 2) return;

  // taking length of the trail , if it is greater then 2 

      const len = p.trail.length;

      for(let i=1; i < len; i++) {

           const alpha = i / len * 0.5;

           ctx.strokeStyle = hexToRgba(p.color , alpha);

           ctx.lineWidth = (i / len) * p.radius * 0.7;

           ctx.beginPath();
           ctx.moveTo(p.trail[i - 1].x , p.trail[i-1].y);
           ctx.lineTo(p.trail[i].x , p.trail[i].y);

           ctx.stroke();
      }

}


// drawing of the particle 

function drawParticle(ctx : CanvasRenderingContext2D , p : Particle) {

      // glowing effect 

      ctx.shadowColor = p.color;
      ctx.shadowBlur = 18;


      //filling the particle  

      const grad = ctx.createRadialGradient(
          p.position.x - p.radius * 0.3,
          p.position.y - p.radius * 0.3,
          p.radius * 0.05,
          p.position.x,
          p.position.y,
          p.radius
      );


      grad.addColorStop(0 , lighten(p.color , 0.4));
      grad.addColorStop(0.7 , p.color);
      grad.addColorStop(1 , darken(p.color , 0.3));


      ctx.beginPath();
      ctx.arc(p.position.x , p.position.y , p.radius , 0 , Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();


      ctx.shadowBlur = 0;


      // mass label 

      ctx.fillStyle = "#fff";
      ctx.font = `bold ${Math.max(10 , p.radius * 0.65)}px 'Courier New',  monospace`;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillText(`${p.mass.toFixed(1)}` , p.position.x , p.position.y);

}


// function to draw velocity vectors behind particles 

function drawVelocityVector(ctx : CanvasRenderingContext2D , p : Particle) {

     const speed = vec.mag(p.velocity);

     if(speed < 1) return;


     const scale = 0.15;   // pixel per unit

     const tip : Vec2 = {
        x : p.position.x + p.velocity.x + scale,
        y : p.position.y + p.velocity.y + scale,
     };


     // lines  

     ctx.strokeStyle = "rgba(255 , 255 , 255 , 0.7)";
     ctx.lineWidth = 2;
     ctx.beginPath();
     ctx.moveTo(p.position.x , p.position.y);
     ctx.lineTo(tip.x , tip.y);
     ctx.stroke();




     // arrow head in front of particle 

     const angle = Math.atan2(tip.y - p.position.y , tip.x - p.position.x);

     const arrowLen = 8;

     ctx.beginPath();
     ctx.moveTo(tip.x , tip.y);
     ctx.lineTo(tip.x - arrowLen * Math.cos(angle - 0.4) , tip.y - arrowLen * Math.sin(angle - 0.4));

     ctx.lineTo(tip.x - arrowLen * Math.cos(angle + 0.4), tip.y - arrowLen * Math.sin(angle - 0.4));

     ctx.closePath();
     ctx.fill();

}








//trajectory drawing function 


function drawTrajectory(ctx : CanvasRenderingContext2D , points : Vec2[]) {

     if(points.length < 2) return;

     ctx.strokeStyle = "rgba(255 , 255 , 255 , 0.25)";

     ctx.lineWidth = 1.5;

     ctx.setLineDash([5 , 5]);
     ctx.beginPath();
     ctx.moveTo(points[0].x , points[0].y);


     for(let i=1; i<points.length; i++) {

        ctx.lineTo(points[i].x , points[i].y);

     }

     ctx.stroke();
     ctx.setLineDash([]);

}



function drawGhost(ctx : CanvasRenderingContext2D , preview : SpawnPreview) {

    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.arc(preview.position.x , preview.position.y , preview.radius , 0 , Math.PI * 2);
    ctx.fillStyle = "#aaccff";
    ctx.fill();
    ctx.globalAlpha = 1;
   
};





// hex value to rgba value color 

function hexToRgba(hex : string , alpha : number) : string {
    
     // defining r , g , b values first 

     const r = parseInt(hex.slice(1 , 3) , 16);
     const g = parseInt(hex.slice(3 , 5) , 16);
     const b = parseInt(hex.slice(5 , 7) , 16);

     return `rgba(${r} , ${g} , ${b} , ${alpha})`;

};



// lighten function 

function lighten(hex : string , amount : number) : string {
    return blendHex(hex , "#ffffff" , amount);
}


function darken(hex : string , amount : number) : string {
    return blendHex(hex , "#000000" , amount);
}




//making hex using all rgb varients 

function blendHex(hex1 : string , hex2 : string , t : number) : string {

     const r1 = parseInt(hex1.slice(1 , 3) , 16);
     const g1 = parseInt(hex1.slice(3 , 5) , 16);
     const b1 = parseInt(hex1.slice(5 , 7) , 16);
     const r2 = parseInt(hex2.slice(1 , 3) , 16);
     const g2 = parseInt(hex2.slice(3 , 5) , 16);
     const b2 = parseInt(hex2.slice(5 , 7) , 16);

     const r = Math.round(r1 + (r2 - r1) * t);
     const g = Math.round(g1 + (g2 - g1) * t);
     const b = Math.round(b1 + (b2 - b1) * t);


     return `#${r.toString(16).padStart(2 , "0")}${g.toString(16).padStart(2 , "0")}${b.toString(16).padStart(2 , "0")}`;

};







