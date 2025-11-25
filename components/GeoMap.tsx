import React, { useEffect, useRef, useState } from 'react';
import { User } from '../types';

interface MeshNode {
  id: string;
  username: string;
  nodeId: string;
  x: number; // Percentage 0-100 relative to canvas width
  y: number; // Percentage 0-100 relative to canvas height
  active: boolean;
  isCurrentUser?: boolean;
}

interface GeoMapProps {
  currentUser?: User | null;
  className?: string;
}

const MOCK_NAMES = [
  "Alpha_Station", "Bravo_Relay", "Charlie_Link", "Delta_Node", 
  "Echo_Base", "Foxtrot_Repeater", "Golf_Gateway", "Hotel_Hub", 
  "India_Outpost", "Juliet_Tower", "Kilo_Bridge", "Lima_Link"
];

export const GeoMap: React.FC<GeoMapProps> = ({ currentUser, className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<MeshNode[]>([]);
  const [hoveredNode, setHoveredNode] = useState<MeshNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Initialize nodes
  useEffect(() => {
    // Generate realistic looking mesh nodes
    const generated: MeshNode[] = MOCK_NAMES.map((name, i) => ({
      id: `node-${i}`,
      username: name,
      nodeId: `!${Math.random().toString(16).substr(2, 6)}`,
      x: 10 + Math.random() * 80, // Keep away from extreme edges
      y: 15 + Math.random() * 70,
      active: Math.random() > 0.15, // 85% uptime simulation
    }));

    if (currentUser) {
      // Add the current user to the map, typically central
      generated.push({
        id: currentUser.id,
        username: currentUser.username,
        nodeId: currentUser.nodeId,
        x: 50,
        y: 50, 
        active: true,
        isCurrentUser: true
      });
    }

    setNodes(generated);
  }, [currentUser?.id]); // Re-generate if user changes (login/logout)

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time++;
      
      // Use client dimensions to avoid stretching if CSS resizes it
      const rect = canvas.getBoundingClientRect();
      // Ensure internal resolution matches display or fixed high res
      // For simplicity here we rely on the width/height attrs set in JSX
      const w = canvas.width;
      const h = canvas.height;
      
      // Clear background
      ctx.clearRect(0, 0, w, h);

      // --- Draw Connections ---
      ctx.lineWidth = 1;
      
      nodes.forEach((node, i) => {
        const nx = (node.x / 100) * w;
        const ny = (node.y / 100) * h;

        nodes.forEach((other, j) => {
          if (i <= j) return; // distinct pairs only
          
          const ox = (other.x / 100) * w;
          const oy = (other.y / 100) * h;
          
          const dist = Math.hypot(nx - ox, ny - oy);
          const maxDist = w * 0.25; // Connection range relative to width
          
          if (dist < maxDist) {
             // Calculate opacity based on distance (closer = stronger)
             const opacity = (1 - dist / maxDist) * 0.4;
             
             // Highlight connections to the current user
             const isRelated = node.isCurrentUser || other.isCurrentUser;
             ctx.strokeStyle = isRelated
                ? `rgba(16, 185, 129, ${opacity + 0.2})` // Emerald for user
                : `rgba(148, 163, 184, ${opacity})`;      // Slate for others
             
             ctx.beginPath();
             ctx.moveTo(nx, ny);
             ctx.lineTo(ox, oy);
             ctx.stroke();

             // Simulate data packets traveling
             if (node.active && other.active) {
                // Determine direction based on time to animate a dot
                const speed = 0.005; // speed factor
                const offset = (time * speed + (i * j)) % 1;
                
                // Only draw packet if we are "lucky" to reduce clutter
                if ((i + j) % 3 === 0) {
                    const px = nx + (ox - nx) * offset;
                    const py = ny + (oy - ny) * offset;
                    
                    ctx.beginPath();
                    ctx.arc(px, py, 1.5, 0, Math.PI * 2);
                    ctx.fillStyle = isRelated ? '#34d399' : '#94a3b8';
                    ctx.fill();
                }
             }
          }
        });
      });

      // --- Draw Nodes ---
      nodes.forEach((node) => {
        const x = (node.x / 100) * w;
        const y = (node.y / 100) * h;
        
        // Pulse Effect for active nodes
        if (node.active) {
          const pulseColor = node.isCurrentUser ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.15)';
          // Pulse size oscillates with time
          const pulseSize = 6 + Math.sin(time * 0.05 + node.x) * 3;
          
          ctx.beginPath();
          ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
          ctx.fillStyle = pulseColor;
          ctx.fill();
        }

        // Inner Dot
        ctx.beginPath();
        ctx.arc(x, y, node.isCurrentUser ? 6 : 4, 0, Math.PI * 2);
        
        if (node.isCurrentUser) {
            ctx.fillStyle = '#10b981'; // Emerald 500
        } else if (node.active) {
            ctx.fillStyle = '#3b82f6'; // Blue 500
        } else {
            ctx.fillStyle = '#475569'; // Slate 600
        }
        ctx.fill();
        
        // Border
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#0f172a'; // Dark bg color
        ctx.stroke();

        // Label for current user
        if (node.isCurrentUser) {
            ctx.fillStyle = '#fff';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText("YOU", x, y + 16);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [nodes]);

  // Handle Mouse Hover
  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Scale coordinates if canvas display size differs from internal resolution
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const mx = x * scaleX;
    const my = y * scaleY;

    // Check collision
    let found = null;
    for (const node of nodes) {
      const nx = (node.x / 100) * canvas.width;
      const ny = (node.y / 100) * canvas.height;
      const dist = Math.hypot(mx - nx, my - ny);
      
      if (dist < 15) { // Hit radius
        found = node;
        break;
      }
    }
    
    setHoveredNode(found);
    if (found) {
        // Position tooltip near the mouse, but clamped
        setTooltipPos({ x: x + 15, y: y - 10 });
    }
  };

  const handleMouseLeave = () => {
    setHoveredNode(null);
  };

  return (
    <div className={`relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner ${className}`}>
       {/* Map HUD Overlay */}
       <div className="absolute top-3 left-4 z-10 flex flex-col pointer-events-none select-none">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold tracking-wider">LIVE_NET_TOPOLOGY</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1">
             ACTIVE_PEERS: {nodes.filter(n => n.active).length} | SIGNAL_FLOOR: -112dBm
          </span>
       </div>
       
       <canvas 
         ref={canvasRef}
         width={1200}
         height={600}
         className="w-full h-full object-cover cursor-crosshair"
         onMouseMove={handleMouseMove}
         onMouseLeave={handleMouseLeave}
       />

       {/* Tooltip */}
       {hoveredNode && (
         <div 
           className="absolute z-20 bg-slate-800/95 backdrop-blur border border-slate-600 p-3 rounded-lg shadow-2xl text-xs pointer-events-none transform transition-all duration-75"
           style={{ left: tooltipPos.x, top: tooltipPos.y }}
         >
           <div className="font-bold text-white mb-1 text-sm">{hoveredNode.username}</div>
           <div className="font-mono text-emerald-400 mb-1">{hoveredNode.nodeId}</div>
           <div className="flex items-center justify-between gap-4 border-t border-slate-700 pt-2 mt-1">
             <div className="text-slate-400 flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${hoveredNode.active ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                {hoveredNode.active ? 'Online' : 'Offline'}
             </div>
             {hoveredNode.isCurrentUser && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">YOU</span>
             )}
           </div>
         </div>
       )}
    </div>
  );
};