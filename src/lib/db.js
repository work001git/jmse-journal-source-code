// src/lib/db.js
// Pure GitHub Repository Database & Auth Client for JMES Journal
// 100% Free - Stored directly in your single GitHub repository
import { githubDB, getGitHubConfig, setGitHubConfig, testGitHubConnection } from './githubStorage';

const authListeners = new Set();
const SESSION_KEY = 'jmes_auth_session';

class GitHubQueryBuilder {
  constructor(table) {
    this.table = table;
    this.action = 'select';
    this.insertData = null;
    this.updateData = null;
    this.filters = [];
    this.orderConfig = null;
    this.isSingle = false;
  }

  select(columns = '*') {
    this.action = 'select';
    return this;
  }

  insert(rows) {
    this.action = 'insert';
    this.insertData = Array.isArray(rows) ? rows : [rows];
    return this;
  }

  update(fields) {
    this.action = 'update';
    this.updateData = fields;
    return this;
  }

  delete() {
    this.action = 'delete';
    return this;
  }

  eq(column, value) {
    this.filters.push((row) => row && String(row[column]) === String(value));
    return this;
  }

  neq(column, value) {
    this.filters.push((row) => row && String(row[column]) !== String(value));
    return this;
  }

  in(column, values) {
    const valSet = new Set(values.map(v => String(v)));
    this.filters.push((row) => row && valSet.has(String(row[column])));
    return this;
  }

  order(column, { ascending = true } = {}) {
    this.orderConfig = { column, ascending };
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  async then(resolve, reject) {
    try {
      const result = await this.execute();
      resolve(result);
    } catch (err) {
      if (reject) reject(err);
      else resolve({ data: null, error: err });
    }
  }

  async execute() {
    try {
      let collection = await githubDB.getCollection(this.table);

      // Special handling if collection is an object (like settings)
      if (this.table === 'settings' && !Array.isArray(collection)) {
        if (this.action === 'select') {
          return { data: collection, error: null };
        }
        if (this.action === 'update') {
          const updated = { ...collection, ...this.updateData };
          await githubDB.saveCollection('settings', updated);
          return { data: updated, error: null };
        }
      }

      if (!Array.isArray(collection)) {
        collection = [];
      }

      if (this.action === 'insert') {
        const newRecords = this.insertData.map(item => ({
          id: item.id || `${this.table.slice(0, 3)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          created_at: item.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...item
        }));

        collection = [...newRecords, ...collection];
        await githubDB.saveCollection(this.table, collection);
        return { data: newRecords, error: null };
      }

      if (this.action === 'update') {
        let matched = false;
        collection = collection.map(row => {
          let matches = true;
          for (const filter of this.filters) {
            if (!filter(row)) {
              matches = false;
              break;
            }
          }
          if (matches) {
            matched = true;
            return { ...row, ...this.updateData, updated_at: new Date().toISOString() };
          }
          return row;
        });

        // If no rows matched by filter, update entire record or push if single
        if (!matched && this.isSingle && collection.length > 0) {
          collection[0] = { ...collection[0], ...this.updateData, updated_at: new Date().toISOString() };
        }

        await githubDB.saveCollection(this.table, collection);
        return { data: collection, error: null };
      }

      if (this.action === 'delete') {
        collection = collection.filter(row => {
          for (const filter of this.filters) {
            if (filter(row)) return false;
          }
          return true;
        });

        await githubDB.saveCollection(this.table, collection);
        return { data: collection, error: null };
      }

      // SELECT
      let results = [...collection];
      for (const filter of this.filters) {
        results = results.filter(filter);
      }

      if (this.orderConfig) {
        const { column, ascending } = this.orderConfig;
        results.sort((a, b) => {
          const valA = a[column] || '';
          const valB = b[column] || '';
          if (valA < valB) return ascending ? -1 : 1;
          if (valA > valB) return ascending ? -1 : 1;
          return 0;
        });
      }

      if (this.isSingle) {
        return {
          data: results.length > 0 ? results[0] : null,
          error: results.length === 0 ? { message: 'Row not found' } : null
        };
      }

      return { data: results, error: null };
    } catch (err) {
      console.error(`[GitHubDB] Query Error for table ${this.table}:`, err);
      return { data: null, error: err };
    }
  }
}

class GitHubStorageBucket {
  constructor(bucket) {
    this.bucket = bucket;
  }

  async upload(filePath, fileObj, options = {}) {
    try {
      const { publicUrl, repoFilePath } = await githubDB.uploadFileToRepo(this.bucket, filePath, fileObj);
      return { data: { path: repoFilePath, fullPath: repoFilePath, publicUrl }, error: null };
    } catch (err) {
      console.error(`[GitHubStorage] Upload error for ${filePath}:`, err);
      return { data: null, error: err };
    }
  }

  getPublicUrl(filePath) {
    const { owner, repo, branch } = getGitHubConfig();
    const repoFilePath = `uploads/${this.bucket}/${filePath}`;
    let publicUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${repoFilePath}`;
    if (!owner || !repo) {
      // Return a placeholder or object URL
      publicUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    }
    return { data: { publicUrl } };
  }
}

class GitHubAuth {
  constructor() {
    this.currentSession = this._loadSession();
  }

  _loadSession() {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  _saveSession(session) {
    this.currentSession = session;
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  _notify(event, session) {
    this._saveSession(session);
    authListeners.forEach(cb => {
      try {
        cb(event, session);
      } catch (e) {
        console.error(e);
      }
    });
  }

  async getUser() {
    const session = this._loadSession();
    return { data: { user: session?.user || null }, error: null };
  }

  async getSession() {
    return { data: { session: this.currentSession } };
  }

  onAuthStateChange(callback) {
    authListeners.add(callback);
    return {
      data: {
        subscription: {
          unsubscribe: () => authListeners.delete(callback)
        }
      }
    };
  }

  async signInWithPassword({ email, password }) {
    const cleanEmail = (email || '').trim().toLowerCase();

    // 1. Check Default Super Admin (supports admin@jmes.org and admin@jese.org)
    if ((cleanEmail === 'admin@jmes.org' || cleanEmail === 'admin@jese.org') && password === 'admin123') {
      const adminUser = {
        id: 'admin-editorial-01',
        email: cleanEmail,
        full_name: 'JMES Chief Editor (Admin)',
        role: 'admin',
        department: 'Editorial Directorate',
        institution: 'Journal of Mathematics and Environmental Statistics',
        country: 'India'
      };
      const session = { user: adminUser, access_token: 'jmes-admin-token' };
      this._notify('SIGNED_IN', session);
      return { data: { user: adminUser, session }, error: null };
    }

    // 2. Check Database Users & Staff
    const users = await githubDB.getCollection('users');
    const user = Array.isArray(users) ? users.find(u => (u.email || '').toLowerCase() === cleanEmail && u.password === password) : null;

    if (!user) {
      return { data: null, error: { message: 'Invalid credentials. Please verify your email and password.' } };
    }

    // If staff account is deactivated
    if (user.role === 'staff' && user.is_active === false) {
      return { data: null, error: { message: 'Your staff account has been deactivated. Please contact the Chief Editor.' } };
    }

    const profiles = await githubDB.getCollection('profiles');
    const profile = Array.isArray(profiles) ? profiles.find(p => p.id === user.id) || {} : {};

    const fullUser = { ...user, ...profile, role: user.role || 'user' };
    const session = { user: fullUser, access_token: `jmes-token-${user.id}` };
    this._notify('SIGNED_IN', session);
    return { data: { user: fullUser, session }, error: null };
  }

  async signUp({ email, password, options = {} }) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const users = await githubDB.getCollection('users');
    
    if (Array.isArray(users) && users.some(u => (u.email || '').toLowerCase() === cleanEmail)) {
      return { data: null, error: { message: 'An account is already registered with this email address.' } };
    }

    const userId = `author-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const userData = options?.data || {};
    const fullName = userData.full_name || cleanEmail.split('@')[0];

    // STRICT RULE: Self-registration is ALWAYS 'user' (Author) role.
    const newUser = {
      id: userId,
      email: cleanEmail,
      password: password,
      full_name: fullName,
      phone: userData.phone || '',
      country: userData.country || '',
      institution: userData.institution || '',
      department: userData.department || '',
      designation: userData.designation || 'Researcher / Author',
      orcid: userData.orcid || '',
      role: 'user', // NEVER allow self-assigning staff or admin
      created_at: new Date().toISOString()
    };

    const newProfile = {
      id: userId,
      email: cleanEmail,
      full_name: fullName,
      phone: userData.phone || '',
      country: userData.country || '',
      institution: userData.institution || '',
      department: userData.department || '',
      role: 'user',
      created_at: new Date().toISOString()
    };

    const userList = Array.isArray(users) ? users : [];
    userList.push(newUser);
    await githubDB.saveCollection('users', userList);

    const profiles = await githubDB.getCollection('profiles');
    const profileList = Array.isArray(profiles) ? profiles : [];
    profileList.push(newProfile);
    await githubDB.saveCollection('profiles', profileList);

    const session = { user: newUser, access_token: `jmes-user-${userId}` };
    this._notify('SIGNED_IN', session);
    return { data: { user: newUser, session }, error: null };
  }

  async signOut() {
    this._notify('SIGNED_OUT', null);
    return { error: null };
  }

  async resetPasswordForEmail(email) {
    return { error: null };
  }

  async updateUser({ password }) {
    if (this.currentSession?.user) {
      const users = await githubDB.getCollection('users');
      if (Array.isArray(users)) {
        const idx = users.findIndex(u => u.id === this.currentSession.user.id);
        if (idx !== -1) {
          users[idx].password = password;
          await githubDB.saveCollection('users', users);
        }
      }
    }
    return { error: null };
  }
}

export const db = {
  from: (table) => new GitHubQueryBuilder(table),
  storage: {
    from: (bucket) => new GitHubStorageBucket(bucket)
  },
  auth: new GitHubAuth()
};

export const supabase = db;
export default db;
