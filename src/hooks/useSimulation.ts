// custom useSimulation hook to perform the simulation 

import { useState , useRef , useCallback , useEffect } from "react";
import type { Particle , SimulationConfig , SimulationState , SimulationStatus , CollisionSnapshot , Vec2 , SpawnPreview } from "../types";

import { createParticle , updateParticle } from "../physics/particle";
import { resolveCollisions } from "../physics/collision";
import { vec } from "../physics/vector";



// some fix and default configuration 

const DEFAULT_CONFIG : SimulationConfig = {
    mass : 5,
    speed : 200,
    angle : 0,
    collisionType : "elastic",
    restitution : 0.6,
    gravityEnabled : false,
    gravity : 400,
    trailLength : 40,
    showVelocityVectors : true,
    wallsEnabled : true,
};



const MAX_COLLISION_LOG = 30;


export function useSimulation(canvasW : number , canvasH : number)  {


   // setting state for simulation state 
    

     const [state , setState] = useState<SimulationState>({
        particles : [],
        collisionLog : [],
        status : 'idle',
        timeScale : 1,
        selectedCollision : null,
        canvasSize : {width : canvasW , height : canvasH},
     });


     const [config , setConfig] = useState<SimulationConfig>(DEFAULT_CONFIG);

     const [preview , setPreview] = useState<SpawnPreview | null>(null);


     //refs for the animation loop 

     const stateRef = useRef(state);
     const configRef = useRef(config);
     const rafRef = useRef<number | null>(null);
     const lastTimeRef = useRef<number>(0);


     stateRef.current = state;
     configRef.current = config;



     // animation loop part here 

     const tick = useCallback((time : number) => {


         if(lastTimeRef.current === 0) lastTimeRef.current = time;
         
         let dt = (time - lastTimeRef.current) / 1000;  // difference in seconds 

         lastTimeRef.current = time;

         

     })

     








}




