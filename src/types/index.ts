// Complete app strict types here 


// VECTOR & SPATIAL 

export interface Vec2 {
   x : number;
   y : number;
}


// PARTICLE 

export interface Particle {
    id : string;
    position : Vec2;
    velocity : Vec2;
    mass : number;
    radius : number;
    color : string;
    trail : Vec2[];    // last N positions particle with trail rendering  
    isAlive : boolean;
}

// Two Kinds of collision - elastic and inelastic collision 


// COLLISION LOGIC

export type CollisionType = "elastic" | "inelastic";


// Collision capture snapshot types , collision b/w two particles at a time 

export interface CollisionSnapshot {
    
     particleA : {
        id : string;
        mass : number;
        velocityBefore : Vec2;
        velocityAfter : Vec2;
        keBefore : number;            // kinetic energy 
        keAfter : number;   
        momentumBefore : Vec2;
        momentumAfter : Vec2;
     }


     particleB : {
         id : string;
         mass : number;
         velocityBefore : Vec2;
        velocityAfter : Vec2;
        keBefore : number;           
        keAfter : number;   
        momentumBefore : Vec2;
        momentumAfter : Vec2;
     }


     // overall system metrices , all net of things 

     system : {
       totalMomentumBefore : Vec2;
       totalMomentumAfter : Vec2;
       totalKEBefore : number;
       totalKEAfter : number;
       energyLost : number;
     }


     collisionType : CollisionType;
     timestamp : number;
     position : Vec2;      // position of particle when collision is happening 

}



// Some simulation configuration which only control by user's 


export interface SimulationConfig {
     mass : number;
     speed : number;
     angle : number;
     collisionType : CollisionType;
     restitution : number;            // 0.0(perfectly inelastic) - 1.0(perfectly elastic)
     gravityEnabled : boolean;
     gravity : number;
     trailLength : number;
     showVelocityVectors : boolean;
     wallsEnabled : boolean;
}




// Simulation State -  idle , paused , running  

export type SimulationStatus = "idle" | "paused" | "running";

export interface SimulationState {
   particles : Particle[];
   collisionLog : CollisionSnapshot[];
   status : SimulationStatus;
   timeScale : number;             // 0.25 , 0.5 , 1 , 2
   selectedCollision : CollisionSnapshot | null;
   canvasSize : {width : number , height : number};
}


// Particle Spawn on canvas ,  click on canvas to spawn particle

export interface SpawnPreview {
   position : Vec2;
   velocity : Vec2;
   mass : number;
   radius  : number;
   color : string;
   trajectoryPoints : Vec2[];   // predicting path of particle in form of dotted lines    
}




// For representation - using Recharts Graph - Graph data types 
// Momentum and Energy bar graph 


export interface MomentumBarEntry {
   name : string;
   before : number;
   after : number;
}


export interface EnergyBarEntry {
   name : string;
   before : number;
   after : number;
} 



// types for graph data 

export interface GraphData {
   momentum : MomentumBarEntry[];
   energy : EnergyBarEntry[];
   conserved : {
     momentumConserved : boolean;
     energyConserved : boolean;
     energyLostPercent : number;
   }
};



