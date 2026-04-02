import API from './config';

const getSessionId = () => {
  let id = sessionStorage.getItem('_ptSess');
  if (!id) { id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`; sessionStorage.setItem('_ptSess', id); }
  return id;
};

const pageEnter = {};

export const trackPageVisit = (page) => {
  pageEnter[page] = Date.now();
  fetch(`${API}/analytics/visit`, { method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ sessionId: getSessionId(), page, referrer: document.referrer, userAgent: navigator.userAgent }) }).catch(()=>{});
};

export const trackPageLeave = (page) => {
  const duration = pageEnter[page] ? Math.round((Date.now()-pageEnter[page])/1000) : 0;
  delete pageEnter[page];
  if (duration < 1) return;
  fetch(`${API}/analytics/visit`, { method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ sessionId: getSessionId(), page, duration }) }).catch(()=>{});
};

export const trackEvent = (type, target='') => {
  fetch(`${API}/analytics/visit`, { method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ sessionId: getSessionId(), page: window.location.pathname, events: [{type,target,timestamp:new Date().toISOString()}] }) }).catch(()=>{});
};

export const trackProject = (projectId, eventType, duration) => {
  if (!projectId) return;
  fetch(`${API}/projects/${projectId}/track`, { method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ eventType, duration }) }).catch(()=>{});
};
