import type { CollisionSnapshot , GraphData  } from "../types";
import { vec } from "../physics/vector";


const CONSERVATION_EPSILON = 0.01;

export function deriveGraphData(snap : CollisionSnapshot) : GraphData {
     
    const momABefore = vec.mag(snap.particleA.momentumBefore);
    const momAAfter = vec.mag(snap.particleA.momentumAfter);
    const momBBefore = vec.mag(snap.particleB.momentumBefore);
    const momBAfter = vec.mag(snap.particleB.momentumAfter);


    const sysMomBefore = vec.mag(snap.system.totalMomentumBefore);
    const sysMomAfter = vec.mag(snap.system.totalMomentumAfter);


    const momentum = [

       {name : "Particle A" , before : +momABefore.toFixed(2) , after : +momAAfter.toFixed(2)},

       {name : "Particle B" , before : +momBBefore.toFixed(2) , after : +momBAfter.toFixed(2)},

       {name : "System Total" , before : +sysMomBefore.toFixed(2) , after : +momBAfter.toFixed(2)},

    ];

    
    const energy = [

      {name : "Particle A" , before : +snap.particleA.keBefore.toFixed(2) , after : +snap.particleA.keAfter.toFixed(2)},

      {name : "Particle B" , before : +snap.particleB.keBefore.toFixed(2) , after : +snap.particleB.keAfter.toFixed(2)},

      {name : "System Total" , before : +snap.system.totalKEBefore.toFixed(2) , after : +snap.system.totalKEAfter.toFixed(2)},

    ];



    // difference b/w momentum 

    const momentumDiff = Math.abs(sysMomBefore - sysMomAfter);
    
    const momentumConserved = momentumDiff < CONSERVATION_EPSILON * Math.max(sysMomBefore , 1);


    // difference b/w energy 

    const energyDiff = Math.abs(snap.system.totalKEBefore - snap.system.totalKEAfter);

    const energyConserved = energyDiff < CONSERVATION_EPSILON * Math.max(snap.system.totalKEBefore , 1);



    // how much energy lost in collision process 

    const energyLostPercent = 
      snap.system.totalKEBefore > 0 ? (snap.system.energyLost / snap.system.totalKEBefore) * 100 : 0;


      return {
         momentum,
         energy,
        conserved : {
          momentumConserved,
          energyConserved,
          energyLostPercent : +energyLostPercent.toFixed(1),
        },
      };
}