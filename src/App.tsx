import { useSimulation  } from "./hooks/useSimulation";
import { SimulationCanvas } from "./components/Canvas";
import { ControlPanel } from "./components/ControlPanel";
import { CollisionPanel } from "./components/CollisionPanel";


const CANVAS_W = 680;
const CANVAS_H = 520;

function App() {
    const sim = useSimulation(CANVAS_W , CANVAS_H);


    return (
        <>
         <div className="bg-[#080e1a] py-3">
           <h1 className="font-bold text-2xl text-cyan-400 p-0 ml-2 underline">Collider</h1>
         </div>


         <div className="flex h-[calc(100vh-60px)] bg-[#080e1a] font-sans overflow-hidden">


            {/* left side control panel  */}

            <ControlPanel 
              config={sim.config}
              setConfig={sim.setConfig}
              status={sim.state.status}
              timeScale={sim.state.timeScale}
              onSetStatus={sim.setStatus}
              onSetTimeScale={sim.setTimeScale}
              onReset={sim.reset}
              particleCount={sim.state.particles.length}
              />


              {/* middle canvas  */}

              <div className="flex-1 flex items-center justify-center bg-[#0a1020]">
                 <div className="rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6)] border border-slate-800">

                  <SimulationCanvas 
                     width={CANVAS_W}
                     height={CANVAS_H}
                     particles={sim.state.particles}
                     preview={sim.preview}
                     showVelocityVectors={sim.config.showVelocityVectors}
                     wallEnabled={sim.config.wallsEnabled}
                     onMouseMoves={sim.updatePreview}
                     onClick={sim.spawnParticle}
                     />

                 </div>
              </div>



              {/* right side collision metrices panel  */}

              <CollisionPanel 
                collisionLog={sim.state.collisionLog}
                selectedCollision={sim.state.selectedCollision}
                onSelect={sim.selectCollision}

    
              />






         </div>
        
        
        </>
    );

}


export default App;

