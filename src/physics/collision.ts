// particle collision action complete program flow  

import type { Particle , CollisionSnapshot , SimulationConfig  } from "../types";
import { vec } from "./vector";




// kinetic energy calculation function 
// ke = 1/2mv^2

const ke = (mass : number , vel : {x : number , y : number}) : number => 0.5 * mass * (vel.x *  vel.x + vel.y * vel.y);


// detecting and resolving all particle pairs 

// retruning updated particles and any new collision snapshots in that frame 

export function resolveCollisions(

    particles : Particle[],
    config : Pick<SimulationConfig , "restitution" | "collisionType">

) : {particles : Particle[]; snapshots : CollisionSnapshot[]} {
    

    const out = particles.map((p) => ({
       ...p,
       position : {...p.position},
       velocity : {...p.velocity},
    }));


    const snapshots : CollisionSnapshot[] = [];


    for(let i=0; i<out.length; i++){
        for(let j=i+1; j<out.length; j++){
             
              const a = out[i];
              const b = out[j];


              // distance and minimum distacne b/w a and b
              const dist = vec.dist(a.position , b.position);

              const minDist = a.radius + b.radius;

              if(dist >= minDist || dist == 0) continue;


              // before snapshot  function with partical and their config 

              const snap = buildSnapshot(a , b , config);



              // normal collision (with axis from b -> a)

              const normal = vec.normalize(vec.sub(a.position , b.position));

    // tangential collision

              const tangent = vec.prep(normal);


              // projecting (throwing) velocities into normal and tangential direction 
              
              const a1n = vec.dot(a.velocity , normal);   // first particle normal 
              const a1t = vec.dot(a.velocity , tangent);   // first particle tangent

              const b1n = vec.dot(b.velocity , normal);   // second particle normal 
              const b1t = vec.dot(b.velocity , tangent);   // second particle tangent



              // 1D collision along normal using restitution coefficient 
              // e = coefficient of restitution (1 = elastic , 0 = inelastic)


              const e = config.collisionType === 'elastic' ? 1.0 : config.restitution;

              const mA = a.mass;
              const mB = b.mass;

              const totalMass = mA + mB;


              let a2n : number;
              let b2n : number;

              if(config.collisionType === 'inelastic' && e === 0){
                   
                  // perfectly inelastic (stick together)

                  const comN = (mA * a1n + mB * b1n) / totalMass;
                  a2n = comN;
                  b2n = comN;

              } else {
                 
                   // general formula of collision with restitution 

                   a2n = ((mA - e * mB) * a1n + (1 + e) * mB * b1n) / totalMass;

                   b2n = ((mB - e * mA) * b1n + (1 + e) * mA * a1n) / totalMass;

              }


              // tangential component remains same as it is  

              const a2t = a1t;
              const b2t = b1t;


              // setting velocities  again 

              a.velocity = {
                 x : a2n * normal.x + a2t * tangent.x,
                 y : a2n * normal.y + b2t * tangent.y,
              };

              b.velocity = {
                 x : b2n * normal.x + b2t * tangent.x,
                 y : b2n * normal.y + b2t * tangent.y,
              };




              // separating overlapping particles 

              const overlap = minDist - dist;

              const correction = vec.scale(normal , overlap / 2);

              a.position = vec.add(a.position , correction);
              b.position = vec.sub(b.position , correction);


              // filling in next values which captured after collision happend , filling into snapshot  


              //for particle A
  
              snap.particleA.velocityAfter = {...a.velocity};
              snap.particleA.keAfter = ke(a.mass , a.velocity);
              snap.particleA.momentumAfter = vec.scale(a.velocity , a.mass);

              // for particle B 

              snap.particleB.velocityAfter = {...b.velocity};
              snap.particleB.keAfter = ke(b.mass , b.velocity);
              snap.particleB.momentumAfter = vec.scale(b.velocity , b.mass);


              // at the end adding both for total momentum 
              
              snap.system.totalMomentumAfter = vec.add(
                snap.particleA.momentumAfter,
                snap.particleB.momentumAfter,
              );


              // total kinetic energy and energy loss 

              snap.system.totalKEAfter = snap.particleA.keAfter + snap.particleB.keAfter;

               // kinetic energy before - kinetic energy after  =  energy lost 

              snap.system.energyLost = snap.system.totalKEBefore - snap.system.totalKEAfter;


              snapshots.push(snap);


        }
    }


    return {particles : out , snapshots};


}



// build snapshot function 


function buildSnapshot (

     a : Particle , b : Particle , config : Pick<SimulationConfig , "collisionType">

) : CollisionSnapshot {
       
       const momA = vec.scale(a.velocity , a.mass);

       const momB = vec.scale(b.velocity , b.mass);

       const keA = ke(a.mass , a.velocity);

       const keB = ke(b.mass , b.velocity);



       return {

          particleA : {
             id : a.id,
             mass : a.mass,
             velocityBefore : {...a.velocity},
             velocityAfter : {x : 0 , y : 0},
             keBefore : keA,
             keAfter : 0,
             momentumBefore : momA,
             momentumAfter : {x : 0  , y : 0},
          },


          particleB : {
            id : b.id,
            mass : b.mass,
            velocityBefore : {...b.velocity},
            velocityAfter : {x : 0 , y : 0},
            keBefore : keB,
            keAfter : 0,
            momentumBefore : momB,
            momentumAfter : {x : 0  , y : 0},

          },


          system : {
             totalMomentumBefore : vec.add(momA , momB),
             totalMomentumAfter : {x : 0 , y : 0},
             totalKEBefore : keA + keB,
             totalKEAfter : 0,
             energyLost : 0,
          },


          collisionType : config.collisionType,
          timestamp : Date.now(),
          position : vec.lerp(a.position , b.position , 0.5),


       }



}


