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
    const radius = Math.min(width, height) / 2;
    const innerRadius = 40;

    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .html('') // Clear
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const data = [
      { label: 'Lived', value: userData.age, color: 'var(--color-ink)', total: userData.expectedAge, width: 25 },
      { label: 'Awake', value: stats.awakeRemainingHours / (365.25 * 24), color: '#888', total: stats.totalRemainingHours / (365.25 * 24), width: 20 },
      { label: 'Free', value: stats.freeRemainingHours / (365.25 * 24), color: 'var(--color-accent)', total: stats.totalRemainingHours / (365.25 * 24), width: 15 },
    ];

    const arc = d3.arc<any>()
      .innerRadius((d, i) => innerRadius + i * 40)
      .outerRadius((d, i) => innerRadius + i * 40 + d.width)
      .startAngle(0)
      .endAngle(d => (d.value / d.total) * 2 * Math.PI)
      .cornerRadius(2);

    const backgroundArc = d3.arc<any>()
      .innerRadius((d, i) => innerRadius + i * 40)
      .outerRadius((d, i) => innerRadius + i * 40 + d.width)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    // Background tracks
    svg.selectAll('.track')
      .data(data)
      .enter()
      .append('path')
      .attr('class', 'track')
      .attr('d', backgroundArc)
      .style('fill', 'var(--color-line)')
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .style('opacity', 0.2);

    // Progress arcs
    svg.selectAll('.progress')
      .data(data)
      .enter()
      .append('path')
      .attr('class', 'progress')
      .attr('d', arc)
      .style('fill', d => d.color)
      .attr('opacity', 0)
      .transition()
      .duration(2000)
      .ease(d3.easeCubicOut)
      .delay((d, i) => i * 300)
      .attr('opacity', 1);

    // Labels
    svg.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => innerRadius + data.indexOf(d) * 40 + d.width / 2)
      .attr('y', 0)
      .attr('dy', '0.35em')
      .attr('transform', d => `rotate(-90)`)
      .style('font-size', '8px')
      .style('font-family', 'var(--font-mono)')
      .style('text-transform', 'uppercase')
      .style('fill', 'var(--color-ink)')
      .style('opacity', 0)
      .text(d => d.label)
      .transition()
      .duration(1000)
      .delay((d, i) => 1000 + i * 200)
      .style('opacity', 0.4);

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
        className="relative aspect-square max-w-[400px] mx-auto w-full"
      >
        <svg ref={svgRef} className="w-full h-full drop-shadow-2xl" />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1 }}
            className="font-mono text-[10px] uppercase tracking-widest"
          >
            Balance
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, type: "spring" }}
            className="text-3xl font-bold tracking-tighter"
          >
            {formatNumber(stats.totalRemainingHours)}
          </motion.span>
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.4 }}
            className="font-mono text-[10px] uppercase tracking-widest"
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
        <motion.div variants={itemVariants} className="space-y-1">
          <h2 className="text-4xl font-black uppercase tracking-tighter italic font-serif">The Inventory</h2>
          <p className="font-mono text-[10px] opacity-50 uppercase tracking-widest">Reality Check Phase 01</p>
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
        
        <motion.div variants={itemVariants} className="p-4 border-l-2 border-[var(--color-accent)] bg-[var(--color-accent)] bg-opacity-5">
           <p className="text-xs font-mono text-[var(--color-ink)] opacity-70 leading-relaxed italic">
            "You have {formatNumber(stats.freeRemainingHours)} hours of true freedom left. Every hour you spend on distractions is a withdrawal from a finite bank account."
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
        "p-4 border border-[var(--color-line)] group hover:border-[var(--color-ink)] transition-colors",
        highlight && "bg-white",
        accent && "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
      )}
    >
      <div className="flex items-center gap-2 mb-2 opacity-40 group-hover:opacity-100 transition-opacity">
        {icon}
        <span className="font-mono text-[9px] uppercase tracking-widest font-semibold">{label}</span>
      </div>
      <div className={cn("text-2xl font-bold tracking-tighter mb-1", accent && "text-[var(--color-accent)]")}>
        {value}
      </div>
      <div className="font-mono text-[8px] opacity-40 uppercase tracking-widest">{sub}</div>
    </motion.div>
  );
}
