// src/lib/githubStorage.js
// GitHub Repository Database & File Storage Driver for JMES Journal
// Complete Supabase removal - All data & files are stored inside a single GitHub Repository!

function getStoredConfig() {
  try {
    const saved = localStorage.getItem('jmes_github_config');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return {};
}

export function getGitHubConfig() {
  const stored = getStoredConfig();
  return {
    token: stored.token || import.meta.env.VITE_GITHUB_TOKEN || '',
    owner: stored.owner || import.meta.env.VITE_GITHUB_OWNER || '',
    repo: stored.repo || import.meta.env.VITE_GITHUB_REPO || '',
    branch: stored.branch || import.meta.env.VITE_GITHUB_BRANCH || 'main',
  };
}

export function setGitHubConfig(config) {
  const current = getGitHubConfig();
  const updated = { ...current, ...config };
  localStorage.setItem('jmes_github_config', JSON.stringify(updated));
  return updated;
}

export async function testGitHubConnection(customConfig = null) {
  const config = customConfig || getGitHubConfig();
  if (!config.owner || !config.repo) {
    return { success: false, message: 'Repository Owner and Repo Name are required.' };
  }
  try {
    const url = `https://api.github.com/repos/${config.owner}/${config.repo}`;
    const headers = { 'Accept': 'application/vnd.github.v3+json' };
    if (config.token) headers['Authorization'] = `Bearer ${config.token}`;

    const res = await fetch(url, { headers });
    if (!res.ok) {
      if (res.status === 404) return { success: false, message: `Repository ${config.owner}/${config.repo} not found or token has no access.` };
      if (res.status === 401) return { success: false, message: 'Invalid or expired GitHub Personal Access Token.' };
      return { success: false, message: `GitHub API error (Status ${res.status})` };
    }
    const data = await res.json();
    return { success: true, message: `Connected to ${data.full_name} (${data.default_branch} branch)`, repo: data };
  } catch (err) {
    return { success: false, message: err.message || 'Network error reaching GitHub API' };
  }
}

// Initial Seed Data for JMES Manuscripts
const INITIAL_MANUSCRIPTS = [
  {
    id: 'manuscript-seed-1',
    submission_id: 'JMES-2026-0001',
    user_id: 'seed-author-1',
    paper_title: "Spatio-temporal Modeling of PM2.5 Concentrations in Urban Landscapes using Bayesian Hierarchical Models",
    title: "Spatio-temporal Modeling of PM2.5 Concentrations in Urban Landscapes using Bayesian Hierarchical Models",
    running_title: "Bayesian Urban PM2.5 Spatio-temporal Modeling",
    authors: [
      { full_name: "Sarah J. Miller", email: "s.miller@cam.ac.uk", institution: "University of Cambridge", country: "United Kingdom", is_corresponding: true, is_female: true },
      { full_name: "Robert Zhang", email: "rzhang@tsinghua.edu.cn", institution: "Tsinghua University", country: "China", is_corresponding: false },
      { full_name: "Elena Petrov", email: "e.petrov@ethz.ch", institution: "ETH Zurich", country: "Switzerland", is_corresponding: false }
    ],
    corresponding_author: "Sarah J. Miller",
    corresponding_email: "s.miller@cam.ac.uk",
    corresponding_phone: "+44 1223 337733",
    institution: "University of Cambridge",
    department: "Department of Pure Mathematics and Mathematical Statistics",
    country: "United Kingdom",
    abstract: "This paper presents a novel Bayesian hierarchical framework for modeling fine particulate matter (PM2.5) concentrations. By integrating satellite-derived aerosol optical depth with ground-level monitoring data, we demonstrate improved predictive accuracy in regions with sparse monitoring networks.",
    keywords: "Bayesian Modeling, PM2.5, Spatial Statistics, Air Quality, Satellite Analytics",
    subject_area: "Environmental Statistics",
    article_type: "Research Article",
    research_area: "Mathematical & Spatial Statistics",
    status: "Published",
    volume: 12,
    issue: 2,
    pages: "101-125",
    doi: "10.5555/jmes.2026.0001",
    manuscript_file: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    apc_status: "PAYMENT VERIFIED",
    apc_amount: 100,
    apc_currency: "USD",
    created_at: "2026-06-15T10:00:00.000Z",
    updated_at: "2026-06-20T10:00:00.000Z"
  },
  {
    id: 'manuscript-seed-2',
    submission_id: 'JMES-2026-0002',
    user_id: 'seed-author-2',
    paper_title: "The Economic Impact of Carbon Pricing on Agriculture: A Cross-Country Panel Data Analysis",
    title: "The Economic Impact of Carbon Pricing on Agriculture: A Cross-Country Panel Data Analysis",
    running_title: "Carbon Pricing and Agricultural Economics",
    authors: [
      { full_name: "David Kumar", email: "d.kumar@anu.edu.au", institution: "Australian National University", country: "Australia", is_corresponding: true },
      { full_name: "Aisha Al-Fayed", email: "a.alfayed@aucegypt.edu", institution: "American University in Cairo", country: "Egypt", is_corresponding: false, is_female: true }
    ],
    corresponding_author: "David Kumar",
    corresponding_email: "d.kumar@anu.edu.au",
    corresponding_phone: "+61 2 6125 5111",
    institution: "Australian National University",
    department: "School of Economics and Mathematical Sciences",
    country: "Australia",
    abstract: "We examine the effects of carbon pricing mechanisms on agricultural productivity across 45 countries. Using a dynamic panel data approach, the study finds that while initial adjustment costs are significant, long-term efficiency gains and green technology adoption offset these costs.",
    keywords: "Carbon Pricing, Agricultural Econometrics, Panel Data, Sustainable Development",
    subject_area: "Environmental Econometrics",
    article_type: "Research Article",
    research_area: "Quantitative Econometrics",
    status: "Published",
    volume: 12,
    issue: 2,
    pages: "126-148",
    doi: "10.5555/jmes.2026.0002",
    manuscript_file: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    apc_status: "PAYMENT VERIFIED",
    apc_amount: 150,
    apc_currency: "USD",
    created_at: "2026-05-18T10:00:00.000Z",
    updated_at: "2026-05-24T10:00:00.000Z"
  },
  {
    id: 'manuscript-seed-3',
    submission_id: 'JMES-2026-0003',
    user_id: 'seed-author-3',
    paper_title: "AI-Driven Predictions of Biodiversity Loss in Tropical Rainforests Using Stochastic Differential Equations",
    title: "AI-Driven Predictions of Biodiversity Loss in Tropical Rainforests Using Stochastic Differential Equations",
    running_title: "Stochastic AI Models for Rainforest Biodiversity",
    authors: [
      { full_name: "Dr. Marcus Thorne", email: "m.thorne@ox.ac.uk", institution: "University of Oxford", country: "United Kingdom", is_corresponding: true },
      { full_name: "Sophie Williams", email: "s.williams@inpa.gov.br", institution: "National Institute of Amazonian Research", country: "Brazil", is_corresponding: false, is_female: true }
    ],
    corresponding_author: "Dr. Marcus Thorne",
    corresponding_email: "m.thorne@ox.ac.uk",
    corresponding_phone: "+44 1865 270000",
    institution: "University of Oxford",
    department: "Mathematical Institute",
    country: "United Kingdom",
    abstract: "Leveraging deep learning architectures combined with stochastic differential equations on multi-spectral satellite imagery, this research quantifies biodiversity loss with unprecedented resolution. The findings highlight the critical role of ecological corridors in maintaining genetic diversity in fragmented habitats.",
    keywords: "Artificial Intelligence, Biodiversity Loss, Stochastic Differential Equations, Remote Sensing",
    subject_area: "Emerging Technologies",
    article_type: "Research Article",
    research_area: "Mathematical Modeling & AI",
    status: "Accepted",
    volume: 12,
    issue: 2,
    pages: "149-170",
    doi: "10.5555/jmes.2026.0003",
    manuscript_file: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    apc_status: "PAYMENT PENDING",
    apc_amount: 100,
    apc_currency: "USD",
    created_at: "2026-04-12T10:00:00.000Z",
    updated_at: "2026-04-20T10:00:00.000Z"
  }
];

// Initial Seed Users
const INITIAL_USERS = [
  {
    id: 'admin-editorial-01',
    email: 'admin@jmes.org',
    password: 'admin123',
    full_name: 'JMES Chief Editor (Admin)',
    role: 'admin',
    department: 'Editorial Directorate',
    institution: 'Journal of Mathematics and Environmental Statistics',
    country: 'India',
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'staff-reviewer-01',
    email: 'staff@jmes.org',
    password: 'staff123',
    full_name: 'Dr. Ramesh Kumar (Review Editor)',
    role: 'staff',
    department: 'School of Mathematics',
    institution: 'Vel Tech Rangarajan Dr. Sagunthala R&D Institute',
    country: 'India',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'author-test-01',
    email: 'author@jmes.org',
    password: 'author123',
    full_name: 'Dr. Sarah J. Miller',
    role: 'user',
    department: 'Department of Statistics',
    institution: 'University of Cambridge',
    country: 'United Kingdom',
    phone: '+44 1223 337733',
    created_at: '2026-01-01T00:00:00.000Z'
  }
];

// Initial Settings
const INITIAL_SETTINGS = {
  global_publication_visible: true,
  apc_rates: {
    india: { amount: 4500, currency: 'INR' },
    south_asia: { amount: 100, currency: 'USD' },
    female_authorship: { amount: 100, currency: 'USD' },
    rest_of_world: { amount: 150, currency: 'USD' }
  },
  overlap_priority: 'female_first',
  upi_details: {
    upi_id: 'jmesjournal@upi',
    account_name: 'Journal of Mathematics and Environmental Statistics',
    qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=jmesjournal@upi%26pn=JMES%20Journal%26cu=INR',
    instructions: 'Scan the QR code or use the UPI ID above to complete the transaction. After payment, enter your 12-digit UTR and attach the transaction screenshot.'
  },
  sample_paper_templates: {
    docx_url: '/templates/JMES_Sample_Paper_Template.docx',
    pdf_url: '/templates/JMES_Sample_Paper_Template.pdf'
  }
};

// Initial Subscription Plans
const INITIAL_SUBSCRIPTION_PLANS = [
  {
    id: 'plan-monthly',
    name: 'Monthly Scholar Pass',
    price: 499,
    currency: 'INR',
    duration_days: 30,
    description: 'Unlimited access to read and download all full-text research papers, archives, and mathematical datasets for 30 days.',
    features: ['Full PDF access to all papers', 'Download supplementary datasets', 'Standard citation export', 'Single user license'],
    active: true
  },
  {
    id: 'plan-annual',
    name: 'Annual Institutional / Researcher Pass',
    price: 3999,
    currency: 'INR',
    duration_days: 365,
    description: 'Best value for researchers, universities, and academic departments. Full uninhibited access to all past and upcoming 2026 issues.',
    features: ['Unlimited 365-day access to all issues', 'Early access to accepted articles', 'High-res figure & dataset downloads', 'Priority editorial support'],
    active: true
  },
  {
    id: 'plan-single',
    name: 'Individual Article Pass',
    price: 199,
    currency: 'INR',
    duration_days: 7,
    description: 'Access and download a specific research paper with 7-day extended viewing rights.',
    features: ['Full article PDF download', 'Online reading viewer', 'Perpetual personal copy'],
    active: true
  }
];

// In-memory SHA cache for GitHub repository updates
const fileShaCache = {};

function utf8ToBase64(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode('0x' + p1);
  }));
}

function base64ToUtf8(str) {
  return decodeURIComponent(Array.prototype.map.call(atob(str), (c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Content = reader.result.split(',')[1];
      resolve({ base64: base64Content, dataUrl: reader.result });
    };
    reader.onerror = (error) => reject(error);
  });
}

export async function getGitHubFile(path) {
  const { token, owner, repo, branch } = getGitHubConfig();
  if (!owner || !repo) return null;

  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    const headers = { 'Accept': 'application/vnd.github.v3+json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, { headers });
    if (!res.ok) return null;

    const json = await res.json();
    fileShaCache[path] = json.sha;

    if (json.content) {
      const decoded = base64ToUtf8(json.content.replace(/\n/g, ''));
      return JSON.parse(decoded);
    }
    return null;
  } catch (err) {
    console.warn(`[GitHubStorage] Error reading ${path} from GitHub:`, err);
    return null;
  }
}

export async function saveGitHubFile(path, content, message, isRawBase64 = false) {
  const { token, owner, repo, branch } = getGitHubConfig();
  if (!token || !owner || !repo) {
    return false;
  }

  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    if (!fileShaCache[path]) {
      try {
        const getRes = await fetch(`${url}?ref=${branch}`, { headers });
        if (getRes.ok) {
          const getJson = await getRes.json();
          fileShaCache[path] = getJson.sha;
        }
      } catch (e) {
        // file doesn't exist yet
      }
    }

    const base64Data = isRawBase64 
      ? content 
      : utf8ToBase64(typeof content === 'string' ? content : JSON.stringify(content, null, 2));

    const body = {
      message: message || `Update ${path} [via JMES Journal Web App]`,
      content: base64Data,
      branch: branch
    };

    if (fileShaCache[path]) {
      body.sha = fileShaCache[path];
    }

    const res = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    });

    if (res.ok) {
      const result = await res.json();
      fileShaCache[path] = result.content?.sha;
      return true;
    } else {
      const err = await res.json();
      console.warn(`[GitHubStorage] Commit failed for ${path}:`, err);
      return false;
    }
  } catch (err) {
    console.warn(`[GitHubStorage] Network error writing ${path}:`, err);
    return false;
  }
}

class GitHubDB {
  constructor() {
    this.localKeyPrefix = 'jmes_storage_';
    this.initLocalCollections();
  }

  initLocalCollections() {
    if (!localStorage.getItem(this.localKeyPrefix + 'manuscripts')) {
      localStorage.setItem(this.localKeyPrefix + 'manuscripts', JSON.stringify(INITIAL_MANUSCRIPTS));
    }
    if (!localStorage.getItem(this.localKeyPrefix + 'users')) {
      localStorage.setItem(this.localKeyPrefix + 'users', JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(this.localKeyPrefix + 'profiles')) {
      localStorage.setItem(this.localKeyPrefix + 'profiles', JSON.stringify(INITIAL_USERS.map(u => ({ ...u, password: undefined }))));
    }
    if (!localStorage.getItem(this.localKeyPrefix + 'settings')) {
      localStorage.setItem(this.localKeyPrefix + 'settings', JSON.stringify(INITIAL_SETTINGS));
    }
    if (!localStorage.getItem(this.localKeyPrefix + 'subscription_plans')) {
      localStorage.setItem(this.localKeyPrefix + 'subscription_plans', JSON.stringify(INITIAL_SUBSCRIPTION_PLANS));
    }
    if (!localStorage.getItem(this.localKeyPrefix + 'subscriptions')) {
      localStorage.setItem(this.localKeyPrefix + 'subscriptions', JSON.stringify([]));
    }
    if (!localStorage.getItem(this.localKeyPrefix + 'payments')) {
      localStorage.setItem(this.localKeyPrefix + 'payments', JSON.stringify([]));
    }
    if (!localStorage.getItem(this.localKeyPrefix + 'fee_waivers')) {
      localStorage.setItem(this.localKeyPrefix + 'fee_waivers', JSON.stringify([]));
    }
    if (!localStorage.getItem(this.localKeyPrefix + 'notifications')) {
      localStorage.setItem(this.localKeyPrefix + 'notifications', JSON.stringify([]));
    }
    if (!localStorage.getItem(this.localKeyPrefix + 'contact_messages')) {
      localStorage.setItem(this.localKeyPrefix + 'contact_messages', JSON.stringify([]));
    }
  }

  async getCollection(table) {
    const filePath = `data/${table}.json`;
    const remoteData = await getGitHubFile(filePath);
    if (remoteData && (Array.isArray(remoteData) || typeof remoteData === 'object')) {
      localStorage.setItem(this.localKeyPrefix + table, JSON.stringify(remoteData));
      return remoteData;
    }

    const local = localStorage.getItem(this.localKeyPrefix + table);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error(e);
      }
    }
    return Array.isArray(INITIAL_MANUSCRIPTS) ? [] : {};
  }

  async saveCollection(table, data) {
    localStorage.setItem(this.localKeyPrefix + table, JSON.stringify(data));
    const filePath = `data/${table}.json`;
    saveGitHubFile(filePath, data, `Update ${table} records`);
    return data;
  }

  async uploadFileToRepo(bucket, filePath, fileObj) {
    const { owner, repo, branch } = getGitHubConfig();
    const { base64, dataUrl } = await fileToBase64(fileObj);
    const repoFilePath = `uploads/${bucket}/${filePath}`;

    await saveGitHubFile(repoFilePath, base64, `Upload manuscript file: ${filePath}`, true);

    let publicUrl = dataUrl;
    if (owner && repo) {
      publicUrl = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${repoFilePath}`;
    }

    return { publicUrl, repoFilePath };
  }

  // Reliable, collision-free Paper ID Generator (JMES-2026-0001 format)
  async getNextPaperId() {
    const year = new Date().getFullYear();
    const prefix = `JMES-${year}-`;
    const manuscripts = await this.getCollection('manuscripts');
    
    let highestSeq = 0;
    if (Array.isArray(manuscripts)) {
      manuscripts.forEach(m => {
        const sid = m.submission_id || '';
        if (sid.startsWith(prefix)) {
          const numStr = sid.replace(prefix, '');
          const num = parseInt(numStr, 10);
          if (!isNaN(num) && num > highestSeq) {
            highestSeq = num;
          }
        }
      });
    }

    const storedCounter = parseInt(localStorage.getItem('jmes_seq_counter') || '0', 10);
    const maxVal = Math.max(highestSeq, storedCounter);
    const nextSeq = maxVal + 1;
    localStorage.setItem('jmes_seq_counter', nextSeq.toString());
    const padded = String(nextSeq).padStart(4, '0');
    return `${prefix}${padded}`;
  }
}

export const githubDB = new GitHubDB();
