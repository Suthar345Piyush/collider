// control panel with all control metrices 


import type { SimulationStatus , SimulationConfig } from "../types";


interface ControlPanelProps {
   config : SimulationConfig;
   setConfig : (c : SimulationConfig) => void;
   status : SimulationStatus;
   timeScale : number;
   onSetStatus : (s : SimulationStatus) => void;
   onSetTimeScale : (ts : number) => void;
   onReset : () => void;
   particleCount : number;
}



export function ControlPanel({

    config,
    setConfig,
    status,
    timeScale,
    onSetStatus,
    onSetTimeScale,
    onReset,
    particleCount,

} : ControlPanelProps) {
     

      const update = (key : keyof SimulationConfig , value : any) => setConfig({...config , [key] : value});


      return (
          <div style={styles.panel}>

               <div style={styles.header}>
                 <div style={styles.headerTitle}>Simulator Controls</div>
                 <div style={styles.particleCount}>{particleCount} particles</div>
               </div>



               {/* spawn parameters  */}


               <Section title="Spawn Parameters">

                <Slider label="Mass" value={config.mass} min={0.5} max={20} step={0.5} unit="kg" onChange={(v) => update("mass" , v)} />

                <Slider label="Speed" value={config.speed} min={50} max={500} step={10} unit="px/s" onChange={(v) => update("speed" , v)} />

                <Slider label="Angle" value={config.angle} min={0} max={359} step={1} unit="°" onChange={(v) => update("angle" , v)} />


                {/* visually angle indicator show   */}

                <AngleIndicator angle={config.angle}/>

               </Section>



               {/* collision type toggle , what type of collision we want   */}


               <Section title="Collision Type">

                 <div style={styles.toggleRow}>
                    
                     <ToggleBtn active={config.collisionType === 'elastic'} onClick={() => update      ("collisionType" , "elastic")}>
                       Elastic
                     </ToggleBtn>

                     <ToggleBtn active={config.collisionType === 'inelastic'} onClick={() => update      ("collisionType" , "inelastic")}>
                       Inelastic
                     </ToggleBtn>

                 </div>


                 {config.collisionType === "inelastic" && (

                    <Slider label="Restitution (e)" value={config.restitution} min={0} max={1} step={0.05} unit="" onChange={(v) => update("restitution" , v)}/>

                 )}


                 <div>

                   {config.collisionType === "elastic" ? "KE & momentum fully conserved. e = 1.0" : `Energy lost on collision. e = ${config.restitution} (0 = stick together)`}

                 </div>

               </Section>




              {/* some physics options  */}

              <Section title="Physics">

                 <Toggle label="Gravity" value={config.gravityEnabled} onChange={(v) => update("gravityEnabled" , v)} />


                 {
                   config.gravityEnabled && (

                      <Slider label="Gravity"
                        value={config.gravity}
                         min={50}
                         max={1000}
                         step={50}
                         unit="px/s²"
                         onChange={(v) => update("gravity" , v)}
                      />


                   )

                 }  

                 <Toggle label="Walls" value={config.wallsEnabled} onChange={(v) => update("wallsEnabled" , v)}/>

                 <Toggle label="Velocity Vectors" value={config.showVelocityVectors} onChange={(v) => update("showVelocityVectors" , v)}/>

                 <Slider label="Trail Length" value={config.trailLength} min={5} max={80} step={5} unit="" onChange={(v) => update("trailLength" , v)}/>

              </Section>



 






    




          </div>
      )
}

