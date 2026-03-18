const getApiUrl = () => {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  // Ensure we have the /api/v1 suffix if it's a domain-only URL from environment
  if (base.startsWith('http') && !base.includes('/api/v')) {
    return base.endsWith('/') ? `${base}api/v1` : `${base}/api/v1`;
  }
  return base;
};

const API_URL = getApiUrl();

const getProviderId = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('nidana_user');
    if (user) {
      try {
        return JSON.parse(user).name;
      } catch (e) {}
    }
  }
  return "Anonymous";
};

export const apiClient = {
  async fetchPatients() {
    const providerId = getProviderId();
    const res = await fetch(`${API_URL}/patients?provider_id=${encodeURIComponent(providerId)}`);
    return res.json();
  },

  async createPatient(data: any) {
    const payload = {
      ...data,
      provider_id: getProviderId()
    };
    
    const res = await fetch(`${API_URL}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async submitSymptoms(caseId: string, symptoms: any) {
    const res = await fetch(`${API_URL}/symptoms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ case_id: caseId, symptoms }),
    });
    return res.json();
  },

  async getDiagnosis(caseId: string) {
    const res = await fetch(`${API_URL}/diagnosis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ case_id: caseId }),
    });
    return res.json();
  },

  async queryGuidelines(query: string) {
    const res = await fetch(`${API_URL}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    return res.json();
  },

  async archiveCase(caseId: string) {
    const res = await fetch(`${API_URL}/cases/${caseId}/archive`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
  },

  async ping() {
    const res = await fetch(`${API_URL}/ping`);
    return res.json();
  }
};
