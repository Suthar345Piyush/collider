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




 // some helper function for drawing 


