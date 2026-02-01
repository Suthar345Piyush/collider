

// complete vector defination of the app 

import type { Vec2 } from "../types/index";


export const vec = {

    // addition
   add : (a : Vec2 , b : Vec2) : Vec2 => ({x : a.x + b.x , y : a.y + b.y}),

   // subtraction
   sub : (a : Vec2 , b : Vec2) : Vec2 => ({x : a.x - b.x , y : a.y - b.y}),

   // scaling 
   scale : (v : Vec2 , s : number) : Vec2 => ({x : v.x * s , y : v.y * s}),
   
   // dot product
   dot : (a : Vec2 , b : Vec2) : number => a.x * b.x + a.y * b.y,

   // magnitude of vector
   mag : (v : Vec2) : number => Math.sqrt(v.x * v.x + v.y * v.y),

   // normalizing a vector
   normalize : (v : Vec2) : Vec2 => {


   // calculating magnitude , if it's 0 , then x , y coordinates both are 0
     const m = Math.sqrt(v.x * v.x + v.y * v.y);

     return m === 0 ? {x : 0 , y : 0} : {x : v.x / m , y : v.y / m};

   },

   prep : (v : Vec2) : Vec2 => ({x : -v.y , y : v.x}),

   zero : () : Vec2 => ({x : 0 , y : 0}),

   clone : (v : Vec2) : Vec2 => ({x : v.x , y : v.y}),


   // distance and change in distance 
   dist : (a : Vec2 , b : Vec2) : number => {
      const dx = a.x - b.x;
      const dy = a.y - b.y;

      return Math.sqrt(dx * dx + dy * dy);
   },


   // linear interpolation metrices 
   lerp : (a : Vec2 , b : Vec2 , t : number) : Vec2 => ({
      x : a.x + (b.x - a.x) * t,
      y : a.y + (b.y - a.y) * t,
   }),

};




