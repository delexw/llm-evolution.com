import { ALL_FLAT } from './data.js';

export function initCharts() {
  const isDark = window.matchMedia('(prefers-color-scheme:dark)').matches;
  const grid = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  Chart.defaults.font.family = "'Inter', system-ui";
  Chart.defaults.color = isDark ? '#8b949e' : '#6b7280';

  initProviderChart(grid, isDark);
  initVelocityChart(grid);
  initContextChart(grid);
  initSizeChart(grid);
  initTierChart();
  initStackedChart(grid, isDark);
}

function initProviderChart(grid, isDark) {
  const provData = [
    {p:'OpenAI', c:18, col:'#10a37f'},
    {p:'Google', c:20, col:'#1a73e8'},
    {p:'Anthropic', c:12, col:'#c77c2c'},
    {p:'Alibaba', c:13, col:'#e04b00'},
    {p:'Mistral AI', c:19, col:'#e8520b'},
    {p:'DeepSeek', c:18, col:'#5b5fc7'},
    {p:'Meta', c:13, col:'#0866ff'},
    {p:'xAI', c:9, col:isDark?'#f0f6ff':'#333333'},
    {p:'Microsoft', c:8, col:'#00a3d1'},
    {p:'Nvidia', c:5, col:'#76b900'},
    {p:'Amazon', c:4, col:'#e08a00'},
    {p:'Cohere', c:6, col:'#39d353'},
    {p:'Moonshot', c:7, col:'#6d28d9'},
  ].sort((a,b) => b.c - a.c);

  new Chart(document.getElementById('provChart'), {
    type:'bar',
    data:{
      labels:provData.map(d=>d.p),
      datasets:[{data:provData.map(d=>d.c),backgroundColor:provData.map(d=>d.col+'cc'),borderColor:provData.map(d=>d.col),borderWidth:1.5,borderRadius:5}]
    },
    options:{responsive:true,plugins:{legend:{display:false}},scales:{x:{grid:{color:grid},ticks:{font:{size:11}}},y:{grid:{color:grid},ticks:{font:{size:11},stepSize:2},beginAtZero:true}}}
  });
}

function initVelocityChart(grid) {
  const quarters = {};
  ALL_FLAT.forEach(m => {
    const d = new Date(m.date);
    if(isNaN(d)) return;
    const q = `${d.getFullYear()} Q${Math.ceil((d.getMonth()+1)/3)}`;
    quarters[q] = (quarters[q]||0) + 1;
  });
  const qk = Object.keys(quarters).sort();

  new Chart(document.getElementById('velChart'), {
    type:'line',
    data:{
      labels:qk,
      datasets:[{label:'Releases',data:qk.map(k=>quarters[k]),borderColor:'#1a73e8',backgroundColor:'rgba(26,115,232,0.08)',fill:true,tension:0.4,pointBackgroundColor:'#1a73e8',pointRadius:5,borderWidth:2}]
    },
    options:{responsive:true,plugins:{legend:{display:false}},scales:{x:{grid:{color:grid},ticks:{font:{size:10},maxRotation:50}},y:{grid:{color:grid},ticks:{font:{size:11}},beginAtZero:true}}}
  });
}

function initContextChart(grid) {
  const ctxData = [
    {m:'Llama 3 (Apr 2024)',v:8192,c:'#0866ff'},
    {m:'GPT-4o (May 2024)',v:131072,c:'#10a37f'},
    {m:'Gemini 1.5 (May 2024)',v:1048576,c:'#1a73e8'},
    {m:'Llama 3.1 (Jul 2024)',v:131072,c:'#0866ff'},
    {m:'o1 (Dec 2024)',v:204800,c:'#10a37f'},
    {m:'Gemini 2.0 (Dec 2024)',v:1048576,c:'#1a73e8'},
    {m:'DeepSeek R1 (Jan 2025)',v:131072,c:'#5b5fc7'},
    {m:'GPT-4.1 (Apr 2025)',v:1048576,c:'#10a37f'},
    {m:'Llama 4 (Apr 2025)',v:10485760,c:'#0866ff'},
    {m:'Gemini 2.5 (Mar 2025)',v:1048576,c:'#1a73e8'},
    {m:'Claude Opus 4.6 (Feb 2026)',v:1048576,c:'#c77c2c'},
    {m:'Gemini 3.1 (Mar 2026)',v:2097152,c:'#1a73e8'},
    {m:'GPT-5.4 (Mar 2026)',v:1048576,c:'#10a37f'},
  ];

  new Chart(document.getElementById('ctxChart'), {
    type:'bar',
    data:{
      labels:ctxData.map(d=>d.m),
      datasets:[{data:ctxData.map(d=>d.v),backgroundColor:ctxData.map(d=>d.c+'bb'),borderColor:ctxData.map(d=>d.c),borderWidth:1.5,borderRadius:4}]
    },
    options:{
      responsive:true,
      plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>{const v=ctx.raw;if(v>=1048576)return `${(v/1048576).toFixed(1)}M tokens`;if(v>=1024)return `${Math.round(v/1024)}K tokens`;return `${v} tokens`;}}}},
      scales:{
        x:{grid:{color:grid},ticks:{font:{size:10},maxRotation:45}},
        y:{type:'logarithmic',grid:{color:grid},ticks:{font:{size:11},callback:v=>{const log=Math.log10(v);if(Math.abs(log-Math.round(log))>0.01)return null;if(v>=1000000)return Math.round(v/1000000)+'M';if(v>=1000)return Math.round(v/1000)+'K';return Math.round(v);}}}
      }
    }
  });
}

function initSizeChart(grid) {
  new Chart(document.getElementById('sizeChart'), {
    type:'bar',
    data:{
      labels:['<1B','1B–3B','3B–8B','8B–14B','14B–33B','33B–72B','72B–200B','>200B'],
      datasets:[{
        label:'Models',
        data:[8, 12, 28, 18, 22, 16, 12, 18],
        backgroundColor:['#10a37f','#059669','#0891b2','#2563eb','#7c3aed','#c026d3','#e11d48','#dc2626'],
        borderRadius:5,
      }]
    },
    options:{responsive:true,plugins:{legend:{display:false}},scales:{x:{grid:{color:grid},ticks:{font:{size:11}}},y:{grid:{color:grid},ticks:{font:{size:11}},beginAtZero:true}}}
  });
}

function initTierChart() {
  const tierCounts = {};
  ALL_FLAT.forEach(m => { tierCounts[m.tier] = (tierCounts[m.tier]||0)+1; });
  const sortedTiers = Object.entries(tierCounts).sort((a,b)=>b[1]-a[1]).slice(0,12);
  const tierColors2 = {
    'frontier':'#dc2626','reasoning':'#7c3aed','efficient':'#059669',
    'open-source':'#2563eb','coding':'#0d9488','nano':'#64748b','edge':'#64748b',
    'multimodal':'#e11d48','video':'#d97706','image':'#f59e0b','audio':'#ec4899',
    'small':'#94a3b8','agent':'#f59e0b','balanced':'#6b7280','reasoning-efficient':'#a78bfa',
  };

  new Chart(document.getElementById('tierChart'), {
    type:'doughnut',
    data:{
      labels:sortedTiers.map(d=>d[0]),
      datasets:[{data:sortedTiers.map(d=>d[1]),backgroundColor:sortedTiers.map(d=>(tierColors2[d[0]]||'#94a3b8')+'cc'),borderColor:sortedTiers.map(d=>tierColors2[d[0]]||'#94a3b8'),borderWidth:1.5}]
    },
    options:{responsive:true,plugins:{legend:{position:'right',labels:{font:{size:11},boxWidth:12,padding:8}}}}
  });
}

function initStackedChart(grid, isDark) {
  const providers = ['OpenAI','Anthropic','Google','Meta','Mistral AI','DeepSeek','Alibaba','xAI','Moonshot'];
  const provColors = {
    'OpenAI':'#10a37f','Anthropic':'#c77c2c','Google':'#1a73e8','Meta':'#0866ff',
    'Mistral AI':'#e8520b','DeepSeek':'#5b5fc7','Alibaba':'#e04b00','xAI': isDark?'#ccc':'#333',
    'Moonshot':'#6d28d9'
  };

  const qSet = new Set(ALL_FLAT.map(m => {
    const d = new Date(m.date);
    if(isNaN(d)) return null;
    return `${d.getFullYear()} Q${Math.ceil((d.getMonth()+1)/3)}`;
  }).filter(Boolean));
  const allQ = [...qSet].sort();

  const stackDatasets = providers.map(p => ({
    label: p,
    data: allQ.map(q => {
      return ALL_FLAT.filter(m => {
        const d = new Date(m.date);
        if(isNaN(d)) return false;
        const mq = `${d.getFullYear()} Q${Math.ceil((d.getMonth()+1)/3)}`;
        return m.provider === p && mq === q;
      }).length;
    }),
    backgroundColor: (provColors[p]||'#94a3b8') + 'cc',
    borderColor: provColors[p]||'#94a3b8',
    borderWidth: 1,
  }));

  new Chart(document.getElementById('stackChart'), {
    type:'bar',
    data:{labels:allQ, datasets:stackDatasets},
    options:{
      responsive:true,
      plugins:{legend:{position:'bottom',labels:{font:{size:11},boxWidth:12,padding:10}}},
      scales:{
        x:{stacked:true,grid:{color:grid},ticks:{font:{size:10},maxRotation:50}},
        y:{stacked:true,grid:{color:grid},ticks:{font:{size:11}},beginAtZero:true}
      }
    }
  });
}
