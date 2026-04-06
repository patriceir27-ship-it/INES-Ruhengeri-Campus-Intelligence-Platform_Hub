/* ===================================================
   INES-Ruhengeri Campus Intelligence Platform
   js/api.js — Fetch helpers for the REST API
   =================================================== */
"use strict";

const API = {
  async get(endpoint) {
    const res = await fetch(`/api/${endpoint}`);
    if (!res.ok) throw new Error(`API ${endpoint} failed: ${res.status}`);
    return res.json();
  },

  // Cache per page so navigating back is instant
  _cache: {},
  async cached(endpoint) {
    if (this._cache[endpoint]) return this._cache[endpoint];
    const data = await this.get(endpoint);
    this._cache[endpoint] = data;
    return data;
  },
  bust(endpoint) { delete this._cache[endpoint]; }
};

window.INES_API = API;
