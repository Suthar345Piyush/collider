// collision canvas panel code 

import type { CollisionSnapshot } from "../types";
import { deriveGraphData } from "../utils/GraphData";
import {BarChart , Bar , XAxis , YAxis , CartesianGrid , Tooltip , Legend , ResponsiveContainer} from "recharts";


interface CollisionPanelProps {
     collisionLog : CollisionSnapshot[];
     selectedCollision : CollisionSnapshot | null;
     onSelect : (snap : CollisionSnapshot | null) => void;
}


export function CollisionPanel({collisionLog , selectedCollision , onSelect} : CollisionPanelProps) {
      
      const graphData = selectedCollision ? deriveGraphData(selectedCollision) : null;


      return (
          
          <div className="w-75 min-w-75 bg-slate-950 border-l border-slate-800 flex flex-col overflow-y-auto font-['Segoe_UI' , system-ui , sans-serif] text-slate-300 text-[13px]">

              {/* header section  */}

              <div className="px-4 pt-4.5 pb-3 border-b border-slate-800 flex justify-between items-center">

                 <div className="text-[15px] font-bold text-slate-50">
                    Collision Log
                 </div>

                 <div className="text-[11px] text-slate-600 bg-slate-800 px-2 py-0.5 rounded-[10px]">{
                   collisionLog.length
                 } events</div>
                
              </div>


              {/* main app canvas area - list of events   */}

              <div className="max-h-50 overflow-y-auto border-b border-slate-800">
                 {collisionLog.length === 0 && (
                     
                       <div className="px-4 py-6 text-center text-slate-600 text-xs leading-[1.6]">No collisions yet.<br /> Spawn particles to begin!!</div>

                 )} 

                 {[...collisionLog].reverse().map((snap , i) => {

                      const isSelected = selectedCollision === snap;

                      const idx = collisionLog.length - i;


                      return (

                          <div key={snap.collisionType + "-" + i} onClick={() => onSelect(isSelected ? null : snap)} 
                          
                          className={`px-3 py-2 border-b border-slate-800 transition-colors duration-150 cursor-pointer ${
                             isSelected ? "bg-[#1e3a5f] border-l-[3px] border-l-blue-500" : "bg-slate-950 border-l-[3px] border-l-transparent"
                          }`}>


                             <div className="flex gap-2 items-center mb-0.75">

                               <span className="text-[11px] font-bold text-blue-500 font-['Courier_New' , monospace]">
                                 #{idx}
                               </span>


                               <span className="text-[11px] flex-1">
                                  {
                                  snap.collisionType === 'elastic' ? <span className="text-emerald-400">● Elastic</span> : <span className="text-orange-400">● Inelastic</span>
                                  }
                               </span>


                               <span className="text-[10px] text-scale-600 font-['Courier_New' , monospace]">

                                 {new Date(snap.timestamp).toLocaleTimeString([] , {
                                   hour12 : false , hour : "2-digit" , minute : "2-digit" , second : "2-digit"
                                 })}



                               </span>

                              </div>


                              <div className="flex items-center gap-1.5 text-[11px]">

                                 <span className="bg-[#1e3a5f] text-blue-400 px-1.5 py-px rounded font-semibold">

                                   {snap.particleB.mass.toFixed(1)} kg
                                   
                                 </span>


                                 <span className="text-slate-600">↔</span>

                                 <span 
                                 className="bg-[#2d1b3b] text-purple-400 px-1.5 py-px rounded font-semibold">{snap.particleB.mass.toFixed(1)}
                                 </span>


                                 <span className="ml-auto text-[10px] text-slate-500">

                                 {snap.system.energyLost > 0.01
                                            ? `−${((snap.system.energyLost / snap.system.totalKEBefore) * 100).toFixed(1)}% KE`
                                                 : "KE conserved"}
                                 </span>

                                </div>






                             </div>

                      )
                        
                 })}

              </div>


              {/* graph data shown  */}


              {graphData && selectedCollision ? (

                 <div className="px-3.5 py-3 flex flex-col gap-3 flex-1">

                      {/* energy conservation  */}

                      <div className="flex flex-warp gap-1.5">

                         <Badge label="Momentum" conserved={graphData.conserved.momentumConserved} />

                         <Badge label="Kinetic Energy" conserved={graphData.conserved.energyConserved}/>


                         {
                           graphData.conserved.energyLostPercent > 0 && (

                              <div className="text-[10px] font-semibold px-2 py-0.75 rounded-xl bg-red-500/12 border border-red-500/30 text-red-400">

                                 Energy Lost : {graphData.conserved.energyLostPercent}%

                                 </div>

                           )
                         }

                      </div>


                      {/* momentum chart  */}


                      <ChartBlock title="Momentum (kg.px/s)">

                        <ResponsiveContainer width="100%" height={160}>

                           <BarChart data={graphData.momentum} barGap={2}>

                              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>

                              <XAxis dataKey="name" tick={{fill : "#64748b" , fontSize : 10}} axisLine={false} tickLine={false}/>

                              <YAxis  tick={{fill : "#64748b" , fontSize : 10}} axisLine={false} tickLine={false}/>

                              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color : "#cbd5e1" , fontSize : 11}}/>

                              <Legend wrapperStyle={{fontSize : 11 , color : "#94a3b8"}}/>

                              <Bar dataKey="before" name="Before" fill="#60a5fa" radius={[3 , 3 , 0 , 0]} barSize={24}/>

                            
                              <Bar dataKey="after" name="After" fill="#34d399" radius={[3 , 3 , 0 , 0]} barSize={24} />



                           </BarChart>
                        </ResponsiveContainer>
                         
                      </ChartBlock>


                      {/* kinetic energy chart  */}


                      <ChartBlock title="Kinetic Energy (½mv²)">

                   <ResponsiveContainer width="100%" height={160}>

                          <BarChart data={graphData.energy} barGap={2}>

                                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>

                                   <XAxis dataKey="name" tick={{fill : "#64748b" , fontSize : 10}} axisLine={false} tickLine={false}/>

                               <YAxis  tick={{fill : "#64748b" , fontSize : 10}} axisLine={false} tickLine={false}/>

                                     <Tooltip contentStyle={tooltipStyle} labelStyle={{ color : "#cbd5e1" , fontSize : 11}}/>

                                    <Legend wrapperStyle={{fontSize : 11 , color : "#94a3b8"}}/>

                          <Bar dataKey="before" name="Before" fill="#a78bfa" radius={[3 , 3 , 0 , 0]} barSize={24}/>

                    <Bar dataKey="after" name="After" fill="#fb923c" radius={[3 , 3 , 0 , 0]} barSize={24} />


               </BarChart>
              </ResponsiveContainer>
 
          </ChartBlock>


          {/* raw numbers representation   */}


          <div className="flex flex-col gap-0.75 bg-[#0a0f1a] rounded-md px-2.5 py-2">

             <RawRow label="ΣMomentum Before" value={`(${selectedCollision.system.totalMomentumBefore.x.toFixed(1)} , ${selectedCollision.system.totalMomentumBefore.y.toFixed(1)})`}/>

             <RawRow label="ΣMomentum After" value={`(${selectedCollision.system.totalMomentumAfter.x.toFixed(1)} , ${selectedCollision.system.totalMomentumAfter.y.toFixed(1)})`}/>

            <RawRow label="ΣKE Before" value={`${selectedCollision.system.totalKEBefore.toFixed(2)}`}/>


            <RawRow label="ΣKE After" value={`${selectedCollision.system.totalKEAfter.toFixed(2)}`}/>

            </div>

                  </div> 


              ) : (

                 <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6">
                    <div className="text-[28px]">📈</div>
                    <div className="text-slate-600 text-xs text-center">Select a collision event above to view graphs</div>
                   </div>
   
              )}




             
          </div>
      );
}





//some small sub components 

// badge function 


function Badge({label , conserved} : {label : string; conserved : boolean}) {
     
     return (

        <div className={`text-[10px] font-semibold px-2 py-0.75 rounded-xl ${

            conserved  ? "bg-emerald-400/12 border border-emerald-400/30 text-emerald-400" : "bg-orange-400/12 border border-orange-400/30 text-orange-400"

        }`}>

           {
             conserved ? "✓" : "✗" 
           } {label} {conserved ? "conserved" : "NOT conserved"}
           
        </div>

     );
}






// chart block 

 function ChartBlock({title , children} : {title : string; children : React.ReactNode;}) {

       return (
           <div className="flex flex-col gap-1">
             <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.8px]">
                {title}
             </div>
             {children}
           </div>
       );

 }



 // RawRow function 


 function RawRow({label , value } : {label : string; value : string;}) {
      return (
          <div className="flex justify-between text-[10px]">
              <span className="text-slate-600">{label}</span>
                 <span className="text-blue-400 font-['Courier-New' , monospace] font-semibold">
                  {value}
              </span>
          </div>
      );
 }




 

//  toolTip style styling css 

const tooltipStyle : React.CSSProperties = {
   background : "#1e293b",
   border : "1px solid #334155",
   borderRadius : 6,
   color : "#cbd5e1",
   fontSize : 11,
   padding : "4px 8px",
};





