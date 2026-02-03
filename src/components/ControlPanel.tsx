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

               <div  style={styles.header}>
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


              {/* simulation controls section  */}


              <Section title="Simulation">

                 <div style={styles.btnRow}>
                   {status === 'running' ? (

                      <ActionBtn color="#f59e0b" onClick={() => onSetStatus('paused')}>
                           ⏸ Pause
                      </ActionBtn>

                   ) : (
                      <ActionBtn color="#10b981" onClick={() => onSetStatus("running")}>
                         ▶  Play
                      </ActionBtn>
                     
                   )}

                   <ActionBtn color="#ef4444" onClick={onReset}>
                   ↺ Reset
                   </ActionBtn>
                   
                 </div>


                 <div style={styles.speedLabel}>Time Scale</div>

                 <div style={styles.speedRow}>

                   {[0.25 , 0.5 , 1 , 2].map((ts) => (

                      <SpeedBtn key={ts} active={timeScale === ts} onClick={() => onSetTimeScale(ts)}>

                         {ts}x

                      </SpeedBtn>

                   ))}

                 </div>

              </Section>


              {/* click on canvas to create particle   */}

              <div style={styles.hint}>
                 * Click anywhere on the canvas to spawn a particle 
              </div>

          </div>
      );
}




//  some functions like (section , toggle , actionBtn , slider , etc...)


function Section({title , children} : {title : string , children : React.ReactNode}) {
    
     return (

        <div style={styles.section}>
           <div style={styles.sectionTitle}>{title}</div>
           {children}
        </div>

     );
}



function Slider({
    label,
    value,
    min,
    max,
    step,
    unit,
    onChange,
} : {
   label : string;
   value : number;
   min : number;
   max : number;
   step : number;
   unit : string;

   onChange : (v : number) => void;
})  {
   

      return (
          <div style={styles.sliderGroup}>

             <div style={styles.sliderHeader}>

               <span>{label}</span>

               <span style={styles.sliderValue}>{value}{unit}</span>

             </div>

             <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} style={styles.slider}/>


          </div>
      );
}




function Toggle({

   label,
   value,
   onChange,

} : {

    label : string;
    value : boolean;
    onChange : (v : boolean) => void;

}) {

    return (

        <div style={styles.toggleGroup}>

           <span style={styles.toggleLabel}>{label}</span>

           <div style={{...styles.toggleTrack , background : value ? "#3b82f6" : "#374151"}} onClick={() => onChange(!value)}>
             
             <div style={{...styles.toggleThumb , transform : value ? 'translateX(18px)' : 'translateX(2px)'}} />

           </div>

        </div>

    );

}



function ToggleBtn({

   active,
   onClick,
   children,

} : {

   active : boolean;
   onClick : () => void;
   children : React.ReactNode;

})  {

    return (

       <button 
       onClick={onClick} 
       style={{...styles.toggleBtn , background : active ? "#3b82f6" : "#1e293b" , color : active ? "#fff" : "#94a3b8" , boxShadow : active ? "0 0 12px rgba(59 , 130 , 246 , 0.4)" : "none"}}>

        {children}

       </button>

    );

}



function ActionBtn({

   color,
   onClick,
   children,

} : {

   color : string;
   onClick : () => void;
   children : React.ReactNode;

}) {
   
     return (

          <button onClick={onClick} style={{...styles.actionBtn , background : color}}>

            {children}

          </button>

     );
}



function SpeedBtn({

   active,
   onClick,
   children,

} : {

   active : boolean;
   onClick : () => void;
   children : React.ReactNode;

}) 

   {
       return (

         <button onClick={onClick} style={{...styles.speedBtn , background : active ? "#3b82f6" : "#1e293b" , color : active ? "#fff" : "#64748b"}}>
           {children}
         </button>

       )
   }




   // angle indicator function 


   function AngleIndicator({angle} : {angle : number})  {

      const rad = (angle * Math.PI) / 180;
      const size = 44;
      const cx = size / 2;
      const cy = size / 2;
      const r = 16;

      const tipX = cx + r * Math.cos(rad);       // x-direction - cos
      const tipY = cy + r * Math.sin(rad);      // y-direction - sin 


      return (

          <div style={styles.angleWrap}>
             <svg width={size} height={size} style={styles.angleSvg}>
               
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#334155" strokeWidth="2" />

                <circle cx={cx} cy={cy} r={r} fill="none" />

                <line x1={cx} y1={cy} x2={tipX} y2={tipY} stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>

                <circle cx={tipX} cy={tipY} r={3} fill="#3b82f6"/>
                   
             </svg>

             <span style={styles.anglelabel}>{angle}°</span>
          </div>

      );


   }
















