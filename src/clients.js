window.authApi = location.protocol === "file:" ? null : {
  async _request(path, options = {}) {
    const res = await fetch(path, {
      cache: "no-store",
      credentials: "same-origin",
      ...options,
      headers: options.body ? { "Content-Type": "application/json; charset=utf-8", ...(options.headers || {}) } : options.headers
    });
    let payload = {};
    try { payload = await res.json(); } catch {}
    if (!res.ok) {
      if (res.status === 404 && path.startsWith("/api/auth/")) this.unsupported = true;
      const error = new Error(payload.error || (res.status === 401 ? "Session expirée" : "Opération refusée"));
      error.status = res.status;
      throw error;
    }
    return payload;
  },
  login(trigram, password) {
    return this._request("/api/auth/login", { method: "POST", body: JSON.stringify({ trigram, password }) }).then(r => r.user);
  },
  session() {
    return this._request("/api/auth/session").then(r => r.user);
  },
  logout() {
    return this._request("/api/auth/logout", { method: "POST", body: "{}" });
  },
  changePassword(currentPassword, newPassword) {
    return this._request("/api/auth/change-password", {
      method: "POST", body: JSON.stringify({ currentPassword, newPassword })
    }).then(r => r.user);
  },
  saveProfile(profile) {
    return this._request("/api/auth/profile", { method: "POST", body: JSON.stringify(profile) }).then(r => r.user);
  },
  users() {
    return this._request("/api/admin/users").then(r => r.users);
  },
  saveUser(user, password) {
    return this._request("/api/admin/users/" + encodeURIComponent(user.trigram), {
      method: "PUT", body: JSON.stringify({ ...user, password: password || "" })
    });
  },
  importUsers(users) {
    return this._request("/api/admin/users/import", { method: "POST", body: JSON.stringify({ users }) });
  },
  resetPassword(trigram) {
    return this._request("/api/admin/users/" + encodeURIComponent(trigram) + "/reset-password", {
      method: "POST", body: "{}"
    });
  },
  deleteUser(trigram) {
    return this._request("/api/admin/users/" + encodeURIComponent(trigram), { method: "DELETE" });
  }
};
window.storage = {
  apiBase: "/api/storage/",
  _versions: new Map(),
  _writes: new Map(),
  async _failure(res) {
    if (res.status === 401) window.dispatchEvent(new CustomEvent("sp-f001-session-expired"));
    const message = res.status === 409
      ? "Sauvegarde refusée : ces données ont changé ou la page doit être actualisée. Rechargez le dossier avant de recommencer. Votre modification n'est pas enregistrée."
      : "Le serveur n'a pas enregistré les données. Vérifiez la connexion avant de recommencer.";
    window.alert(message);
    throw new Error(message);
  },
  async _queue(key, action) {
    const previous = this._writes.get(key) || Promise.resolve();
    const next = previous.catch(() => {}).then(action);
    this._writes.set(key, next);
    try { return await next; }
    finally { if (this._writes.get(key) === next) this._writes.delete(key); }
  },
  async _conditions(key) {
    if (!this._versions.has(key)) {
      try { await this.get(key, true); }
      catch (err) { if (err.message !== "not found") throw err; }
    }
    const version = this._versions.get(key);
    return version ? { "If-Match": version } : { "If-None-Match": "*" };
  },
  _store(persistent) {
    return persistent ? window.localStorage : window.sessionStorage;
  },
  _key(key, persistent) {
    return `${persistent ? "p" : "s"}:${key}`;
  },
  _useApi(persistent) {
    return persistent && location.protocol !== "file:";
  },
  _url(key) {
    return this.apiBase + encodeURIComponent(key);
  },
  async get(key, persistent = true) {
    if (this._useApi(persistent)) {
      const res = await fetch(this._url(key), { cache: "no-store" });
      if (res.status === 404) {
        this._versions.set(key, null);
        throw new Error("not found");
      }
      if (!res.ok) throw new Error("Lecture serveur impossible");
      this._versions.set(key, res.headers.get("ETag"));
      this.relational = !!res.headers.get("ETag");
      return { value: await res.text() };
    }
    const value = this._store(persistent).getItem(this._key(key, persistent));
    if (value === null) throw new Error("not found");
    return { value };
  },
  async set(key, value, persistent = true) {
    if (this._useApi(persistent)) {
      return this._queue(key, async () => {
      const conditions = await this._conditions(key);
      const res = await fetch(this._url(key), {
        method: "PUT",
        headers: { "Content-Type": "application/json; charset=utf-8", ...conditions },
        body: value
      });
      if (!res.ok) return this._failure(res);
      this._versions.set(key, res.headers.get("ETag"));
      });
    }
    this._store(persistent).setItem(this._key(key, persistent), value);
  },
  async delete(key, persistent = true) {
    if (this._useApi(persistent)) {
      return this._queue(key, async () => {
        const res = await fetch(this._url(key), { method: "DELETE", headers: await this._conditions(key) });
        if (!res.ok && res.status !== 404) return this._failure(res);
        this._versions.set(key, null);
      });
    }
    this._store(persistent).removeItem(this._key(key, persistent));
  },
  async list(persistent = true) {
    if (this._useApi(persistent)) {
      const res = await fetch(this.apiBase, { cache: "no-store" });
      if (!res.ok) throw new Error("Liste serveur indisponible");
      return (await res.json()).keys || [];
    }
    const prefix = `${persistent ? "p" : "s"}:`;
    return Object.keys(this._store(persistent))
      .filter(k => k.startsWith(prefix))
      .map(k => k.slice(prefix.length));
  },
  async homeDocuments() {
    if (location.protocol === "file:") return null;
    const res = await fetch("/api/home-summary", { cache: "no-store", credentials: "same-origin" });
    if (res.status === 404) return null;
    if (res.status === 401) window.dispatchEvent(new CustomEvent("sp-f001-session-expired"));
    if (!res.ok) throw new Error("Résumé de l'accueil indisponible");
    return (await res.json()).documents || {};
  }
};
