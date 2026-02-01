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


    



}
