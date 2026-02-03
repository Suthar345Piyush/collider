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
          <div className="w-65 min-w-65 bg-slate-950 border-r border-slate-800 overflow-y-auto flex flex-col font-['Segoe_UI' , system-ui , sans-serif] text-slate-300 text-[13px]">


               <div  className="px-4 pt-4.5 pb-3 border-b border-slate-800 flex justify-between items-center">

                 <div className="text-[15px] font-bold text-slate-50 tracking-wide">Simulator Controls</div>

                 <div className="text-[11px] text-slate-600 bg-slate-800 px-2 py-0.5 rounded-[10px]">{particleCount} particles</div>
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

                 <div className="flex gap-2">
                    
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


                 <div className="bg-slate-800 rounded-md px-2.5 py-1.5 text-[11px] text-slate-500 leading-[1.4]">

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

                 <div className="flex gap-2">
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


                 <div className="text-[11px] text-slate-600 mt-1">Time Scale</div>

                 <div className="flex gap-1.5">

                   {[0.25 , 0.5 , 1 , 2].map((ts) => (

                      <SpeedBtn key={ts} active={timeScale === ts} onClick={() => onSetTimeScale(ts)}>

                         {ts}x

                      </SpeedBtn>

                   ))}

                 </div>

              </Section>


              {/* click on canvas to create particle   */}

              <div className="px-4 py-3 text-[11px] text-slate-600 text-center bg-[#0a0f1a] mt-auto">
                 * Click anywhere on the canvas to spawn a particle 
              </div>

          </div>
      );
}




//  some functions like (section , toggle , actionBtn , slider , etc...)


function Section({title , children} : {title : string , children : React.ReactNode}) {
    
     return (

        <div className="px-4 py-3.5 border-b border-slate-800 flex flex-col gap-2.5">
           <div className="text-[10px] uppercase tracking-[1.2px] text-slate-600 font-semibold mb-0.5">{title}</div>
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
          <div className="flex flex-col gap-1">

             <div className="flex justify-between text-xs text-slate-400">

               <span>{label}</span>

               <span className="text-blue-400 font-semibold font-['Courier_New' , monospace]">{value}{unit}</span>

             </div>

             <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full accent-blue-500 h-1 cursor-pointer"/>


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

        <div className="flex justify-between items-center">

           <span className="text-xs text-slate-400">{label}</span>

           <div className={`w-9.5 h-5.5 rounded-[11px] cursor-pointer relative transition-colors duration-200 ${
             value ? "bg-blue-500" : "bg-gray-700"
           }`} onClick={() => onChange(!value)}>
             
             
             <div className={`w-4.5 h-4.5 rounded-[9px] bg-white absolute top-0.5 transition-transform duration-200 ${ 
                value ? "translate-x-4.5" : "translate-x-0.5"
             }`} />

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

        className={`flex-1 py-1.5 border-none rounded-md cursor-pointer text-xs font-semibold trasition-all duration-200 ${
           active ? "bg-blue-500 text-white shadow-[0_0_12px_rgba(59 , 130 , 246 , 0.4)]" : "bg-slate-800 text-slate-400"

        }`}
       
       >

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

          <button onClick={onClick} className={`flex-1 border-none rounded-md py-2 text-white font-semibold text-xs cursor-pointer transition-opacity duration-150 ${color}`}>

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

         <button 
         onClick={onClick} 

         className={`flex-1 border-none rounded-[5px] py-1.25 text-[11px] font-semibold cursor-pointer transition-all duration-150 ${
            active ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-500"
          }`}>

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

          <div className="flex items-center gap-2 justify-center mt-0.5">
             <svg width={size} height={size} className="block">
               
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#334155" strokeWidth="2" />

                <circle cx={cx} cy={cy} r={r} fill="none" />

                <line x1={cx} y1={cy} x2={tipX} y2={tipY} stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>

                <circle cx={tipX} cy={tipY} r={3} fill="#3b82f6"/>
                   
             </svg>

             <span className="text-[11px] text-blue-400 font-['Courier_New' , monospace]">{angle}°</span>
          </div>

      );


   }
















