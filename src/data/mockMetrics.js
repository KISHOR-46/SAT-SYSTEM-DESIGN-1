export const generateMockMetrics = (trafficLevel = 'normal') => {
  const baseTraffic = {
    low: {
      rps: 50,
      activeUsers: 1200,
      responseTime: 120,
      successRate: 99.9,
      cacheHitRatio: 95,
      queueLength: 0
    },
    normal: {
      rps: 500,
      activeUsers: 15000,
      responseTime: 250,
      successRate: 99.5,
      cacheHitRatio: 90,
      queueLength: 50
    },
    peak: {
      rps: 5000,
      activeUsers: 150000,
      responseTime: 850,
      successRate: 97.2,
      cacheHitRatio: 85,
      queueLength: 1200
    }
  };

  const base = baseTraffic[trafficLevel];
  
  // Add some randomness
  const randomize = (val, variance = 0.05) => {
    return val * (1 + (Math.random() * variance * 2 - variance));
  };

  return {
    rps: Math.round(randomize(base.rps)),
    activeUsers: Math.round(randomize(base.activeUsers)),
    responseTime: Math.round(randomize(base.responseTime, 0.1)),
    successRate: Number(randomize(base.successRate, 0.01).toFixed(1)),
    cacheHitRatio: Number(randomize(base.cacheHitRatio, 0.02).toFixed(1)),
    queueLength: Math.max(0, Math.round(randomize(base.queueLength, 0.2)))
  };
};

export const generateTrafficData = (points = 20) => {
  const data = [];
  let currentRps = 400;
  
  for (let i = 0; i < points; i++) {
    currentRps = currentRps * (1 + (Math.random() * 0.4 - 0.2));
    data.push({
      time: new Date(Date.now() - (points - i) * 60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      requests: Math.round(currentRps)
    });
  }
  return data;
};
