import React from 'react';
import * as d3 from 'd3';
import { UserData, LifeStats } from '../types';
import { formatNumber, cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Clock, Moon, Sun, Coffee } from 'lucide-react';

interface LifeClockProps {
  userData: UserData;
}

export default function LifeClock({ userData }: LifeClockProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  
  const stats = React.useMemo(() => {
    const totalYears = userData.expectedAge;
    const livedYears = userData.age;
    const remainingYears = Math.max(0, totalYears - livedYears);
    
    const totalHoursRemaining = remainingYears * 365.25 * 24;
    const dailyCommitments = userData.sleepHours + userData.workHours + userData.socialHours;
    const awakeHoursRemaining = remainingYears * 365.25 * (24 - userData.sleepHours);
    const freeHoursRemaining = remainingYears * 365.25 * (24 - dailyCommitments);

    return {
      totalRemainingHours: totalHoursRemaining,
      awakeRemainingHours: awakeHoursRemaining,
      freeRemainingHours: freeHoursRemaining,
      yearsRemaining: remainingYears,
      daysRemaining: remainingYears * 365.25
    };
  }, [userData]);

  React.useEffect(() => {
    if (!svgRef.current) return;

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 20;

    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .html('') // Clear
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const totalYears = userData.expectedAge;
    const livedYears = userData.age;
    const remainingYears = Math.max(0, totalYears - livedYears);

    const arc = d3.arc<any>()
      .innerRadius(radius - 12)
      .outerRadius(radius)
      .startAngle(0)
      .cornerRadius(6);

    // Background track (Total Life)
    svg.append('path')
      .datum({ endAngle: 2 * Math.PI })
      .attr('class', 'track')
      .attr('d', arc)
      .style('fill', 'var(--color-line)')
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .style('opacity', 0.1);

    // Lived part (Burned out, invisible or very faint)
    svg.append('path')
      .datum({ endAngle: (livedYears / totalYears) * 2 * Math.PI })
      .attr('d', arc)
      .style('fill', 'var(--color-muted)')
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .style('opacity', 0.2);

    // Remaining part (The Amber/Candle)
    const remainingArc = d3.arc<any>()
      .innerRadius(radius - 12)
      .outerRadius(radius)
      .cornerRadius(6);
      
    // Animate from full to remaining (shrinking start angle)
    svg.append('path')
      .datum({ startAngle: 0, endAngle: 2 * Math.PI }) // start from full
      .attr('d', remainingArc)
      .style('fill', 'var(--color-accent)')
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .attr('opacity', 1)
      .transition()
      .duration(2000)
      .ease(d3.easeCubicInOut)
      .attrTween('d', function(d: any) {
        const iStart = d3.interpolate(d.startAngle, (livedYears / totalYears) * 2 * Math.PI);
        return function(t) {
          d.startAngle = iStart(t);
          return remainingArc(d) as string;
        };
      });

    // Add tick marks for years
    const ticks = svg.append('g').attr('class', 'ticks');
    for (let i = 0; i < totalYears; i++) {
        if (i % 5 === 0) { // Every 5 years
          const angle = (i / totalYears) * 2 * Math.PI - Math.PI / 2;
          const x1 = Math.cos(angle) * (radius - 20);
          const y1 = Math.sin(angle) * (radius - 20);
          const x2 = Math.cos(angle) * (radius - 15);
          const y2 = Math.sin(angle) * (radius - 15);
          
          ticks.append('line')
            .attr('x1', x1)
            .attr('y1', y1)
            .attr('x2', x2)
            .attr('y2', y2)
            .style('stroke', 'var(--color-line)')
            .style('stroke-width', 1)
            .style('opacity', 0)
            .transition()
            .delay(1000 + i * 10)
            .style('opacity', 0.5);
        }
    }

  }, [userData, stats]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative aspect-square max-w-[400px] mx-auto w-full glass-card flex items-center justify-center p-8 bg-[var(--color-card)]/50"
      >
        <svg ref={svgRef} className="w-full h-full drop-shadow-2xl opacity-90" />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xs uppercase tracking-widest text-[var(--color-muted)] font-medium"
          >
            Balance
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, type: "spring" }}
            className="text-4xl font-mono font-extrabold tracking-tight mt-1"
          >
            {formatNumber(stats.totalRemainingHours)}
          </motion.span>
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-xs uppercase tracking-widest text-[var(--color-muted)] font-medium mt-1"
          >
            Hours
          </motion.span>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="space-y-8"
      >
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="inline-block border border-[var(--color-line)] bg-[var(--color-card)] px-3 py-1 rounded-full font-mono text-xs text-[var(--color-muted)] tracking-wider">
            Reality Check Phase 01
          </div>
          <h2 className="text-3xl font-bold tracking-tight">The Inventory</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard 
            variants={itemVariants}
            icon={<Clock size={16} />} 
            label="Remaining Years" 
            value={stats.yearsRemaining.toFixed(1)} 
            sub="Total estimated duration"
          />
          <StatCard 
            variants={itemVariants}
            icon={<Sun size={16} />} 
            label="Conscious Hours" 
            value={formatNumber(stats.awakeRemainingHours)} 
            sub="Excluding sleeping time"
            highlight
          />
          <StatCard 
            variants={itemVariants}
            icon={<Moon size={16} />} 
            label="Sleeping Time" 
            value={formatNumber(stats.totalRemainingHours - stats.awakeRemainingHours)} 
            sub="Hours lost to dreams"
          />
          <StatCard 
            variants={itemVariants}
            icon={<Coffee size={16} />} 
            label="Net Free Time" 
            value={formatNumber(stats.freeRemainingHours)} 
            sub="Real time for goals"
            highlight
            accent
          />
        </div>
        
        <motion.div variants={itemVariants} className="glass-card p-5 border-l-4 border-l-[var(--color-accent)] bg-gradient-to-br from-[var(--color-accent)]/10 to-transparent">
           <p className="text-sm text-white/90 leading-relaxed italic">
            "You have <span className="font-bold text-[var(--color-accent)] font-mono text-base">{formatNumber(stats.freeRemainingHours)} hours</span> of true freedom left. Every hour you spend on distractions is a withdrawal from a finite bank account."
           </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, highlight, accent, variants }: any) {
  return (
    <motion.div 
      variants={variants}
      className={cn(
        "glass-card p-5 transition-all group hover:border-[var(--color-accent)]/40 hover:-translate-y-1 duration-300",
        highlight && "bg-white/5",
        accent && "border-[var(--color-accent)]/30 outline outline-1 outline-[var(--color-accent)]/20 shadow-[0_4px_20px_rgba(255,78,0,0.1)]"
      )}
    >
      <div className={cn("flex items-center gap-2 mb-3 text-[var(--color-muted)] group-hover:text-[var(--color-ink)] transition-colors", accent && "text-[var(--color-accent)] group-hover:text-[var(--color-accent)]")}>
        {icon}
        <span className="font-medium text-xs uppercase tracking-wider">{label}</span>
      </div>
      <div className={cn("text-3xl font-mono font-extrabold tracking-tight mb-2", accent && "text-[var(--color-accent)]")}>
        {value}
      </div>
      <div className="text-xs text-[var(--color-muted)]">{sub}</div>
    </motion.div>
  );
}
