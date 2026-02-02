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


         // clamp dt to avoid spiral of death on tab-screen 

         dt = Math.min(dt , 0.05);
         dt *= stateRef.current.timeScale;



         const cur = stateRef.current;
         const cfg = configRef.current;


         if(cur.status === 'running' && cur.particles.length > 0 ) {
           

             // updating positions of particles 

             let updated = cur.particles.map((p) => updateParticle(p , dt , cfg , canvasW , canvasH));



             // resolving collisions  

             const {particles : resolved , snapshots} = resolveCollisions(updated , cfg);


             // merging new collision snapshots 

             let newLog = cur.collisionLog;

             if(snapshots.length > 0) {
               newLog = [...cur.collisionLog , ...snapshots].slice(-MAX_COLLISION_LOG);
             }


             setState((prev) => ({
               ...prev,
               particles : resolved,
               collisionLog : newLog,



               // for graph data , auto select latest collision for immediate graph feedback 


               selectedCollision : snapshots.length > 0 ? snapshots[snapshots.length - 1] : prev.selectedCollision,

             }));
         }


         rafRef.current = requestAnimationFrame(tick);

     } , [canvasW , canvasH]);






     // some essential configuration like - stop , start the motion based on current status
     
     useEffect(() => {

        if(state.status === 'running' || state.status === 'paused') {
           lastTimeRef.current = 0;
           rafRef.current = requestAnimationFrame(tick);
        
        } 

        return () => {
           if(rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };

     } , [state.status , tick]);


     

    //  some actions on particles 

    const spawnParticle = useCallback((pos : Vec2) => {
        
         const p = createParticle(pos , configRef.current);

         setState((prev) => ({
            ...prev,
            particles : [...prev.particles , p],

            status : prev.status === 'idle' ? 'running' : prev.status,
         }))

    } , []);




    //reset function 

    const reset = useCallback(() => {

        setState({
           particles : [],
           collisionLog : [],
           status : 'idle',
           timeScale : 1,
           selectedCollision : null,
           canvasSize : {width : canvasW , height : canvasH},
        });
    } , [canvasW , canvasH]);





    const setStatus = useCallback((s : SimulationStatus) => {
        setState((prev) => ({...prev , status : s}));
    } , []);



    const setTimeScale = useCallback((ts : number) => {
         setState((prev) => ({...prev , timeScale : ts}));
    } , []);




    const selectCollision = useCallback((snap : CollisionSnapshot | null) => {
        setState((prev) => ({...prev , selectedCollision : snap}));
    } , []);




    // preview of the particle 


    const updatePreview = useCallback((pos : Vec2 | null) => {
        
         if(!pos) {
           setPreview(null);
           return;
         }




         const cfg = configRef.current;

         const angleRad = (cfg.angle * Math.PI) / 100;

         const vel : Vec2 = {
           x : cfg.speed * Math.cos(angleRad),
           y : cfg.speed * Math.sin(angleRad)
         };



         // trajectory for 0.5s 


         const steps = 20;
         const stepDt = 0.025;
         const points : Vec2[] = [{...pos}];

         let cur = {...pos};
         
         let curVel = {...vel};


         for(let i=0; i<steps; i++){

           if(cfg.gravityEnabled) curVel.y += cfg.gravity * stepDt;

           cur = {x : cur.x + curVel.x * stepDt , y : cur.y + curVel.y * stepDt};


           points.push({...cur});

         }



         setPreview({

           position : pos,
           velocity : vel,
           mass : cfg.mass,
           radius : 14 * Math.sqrt(cfg.mass),
           color : "#ffffff",
           trajectoryPoints : points,

         });

    } , []);


    return {
       state,
       config,
       setConfig,
       preview,
       spawnParticle,
       updatePreview,
       reset,
       setStatus,
       setTimeScale,
       selectCollision,
    }
}




