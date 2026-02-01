// Particle movement logic here 

import type { Particle , Vec2 , SimulationConfig } from "../types/index";
import { vec } from "./vector";



// fixed radius and calculating mass from it  

// radius = base * sqrt(mass) 

const RADIUS_BASE = 14;

export const radiusFromMass = (mass : number) : number => RADIUS_BASE * Math.sqrt(mass);


    // color on particles , randomly automatic changing of color on particle  

    const PALETTE = [
       "#00d4ff" , "#ff6b6b" , "#51cf66" , "#ffd43b",
       "#cc5de8", "#ff922b", "#20c997", "#f06595",
       "#74b9ff", "#fd9644", "#a29bfe", "#55efc4",
    ];


     // indexing on palette array 

     let colorIndex = 0;
     
     export const nextColor = () : string => {
        const c = PALETTE[colorIndex % PALETTE.length];
        colorIndex++;
        return c;
     };



     // generating unique id's 

     let idCounter = 0;
     
     export const genId = () : string => `p_${++idCounter}`;



     // making particles infinite times  

     export function createParticle(

        position : Vec2,

        config : Pick<SimulationConfig , "mass" | "angle" | "speed">

     ) : Particle {

         // angle in radians 

         const angleRad = (config.angle * Math.PI) / 180;

         const velocity : Vec2 = {

           x : config.speed * Math.cos(angleRad),
           y : config.speed * Math.sin(angleRad),

         };


         return {
           id : genId(),
           position : vec.clone(position),
           velocity,
           mass : config.mass,
           radius : radiusFromMass(config.mass),
           color : nextColor(),
           trail : [vec.clone(position)],
           isAlive : true
         };
     }



     // per-frame updates of the particle  

   export function updateParticle (

        p : Particle , dt : number , config : Pick<SimulationConfig , "gravityEnabled" | "gravity" | "trailLength" | "wallsEnabled">,

        canvasW : number,
        canvasH : number,

     )  : Particle {
        

          let vel = vec.clone(p.velocity);


          // gravity part 
          
          if(config.gravityEnabled){
             vel.y += config.gravity * dt;
          }


          // new position rendered 

          let pos : Vec2 = {

             x : p.position.x + vel.x * dt,
             y : p.position.y + vel.y * dt,

          };


          // particle bouncing on all four walls 

          if(config.wallsEnabled) {

             if(pos.x - p.radius < 0){
               pos.x = p.radius;
               vel.x = Math.abs(vel.x);
             }

             if(pos.x + p.radius > canvasW){
              pos.x = canvasW - p.radius;
              vel.x = -Math.abs(vel.x);
            }

            if(pos.y - p.radius < 0){
              pos.y = p.radius;
              vel.y = Math.abs(vel.y);
            }

            if(pos.y + p.radius > canvasH){
              pos.y = p.radius;
              vel.y = -Math.abs(vel.y);
            }

          }



           // trail of the particle  

           const trail = [...p.trail , vec.clone(pos)];

           if(trail.length > config.trailLength) trail.shift();

           return {

              ...p, 
              position : pos,
              velocity : vel,
              trail,

           }
      };

      









