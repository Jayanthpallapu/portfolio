/**
 * API client for communicating with the FastAPI backend.
 * All requests go through the Caddy gateway using XTransformPort.
 */

const API_PORT = 8000;

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `/api${endpoint}?XTransformPort=${API_PORT}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `API Error: ${response.status}`);
  }

  return response.json();
}

// ── Contact API ──

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  subject?: string;
  source?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

export async function submitContact(data: ContactPayload): Promise<ApiResponse> {
  return apiFetch<ApiResponse>('/contacts/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Visitor API ──

export interface VisitorPayload {
  session_id?: string;
  page?: string;
  referrer?: string;
  user_agent?: string;
  country?: string;
  city?: string;
  time_on_page?: number;
}

export async function trackVisitor(data: VisitorPayload): Promise<void> {
  try {
    await apiFetch('/visitors/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch {
    // Visitor tracking should fail silently
  }
}

// ── Newsletter API ──

export interface NewsletterPayload {
  email: string;
  source?: string;
}

export async function subscribeNewsletter(data: NewsletterPayload): Promise<ApiResponse> {
  return apiFetch<ApiResponse>('/newsletter/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Projects API ──

export interface ProjectData {
  id: number;
  title: string;
  description: string;
  tech_stack: string | null;
  category: string | null;
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export async function getProjects(): Promise<ProjectData[]> {
  return apiFetch<ProjectData[]>('/projects/');
}

export async function getFeaturedProjects(): Promise<ProjectData[]> {
  return apiFetch<ProjectData[]>('/projects/featured');
}

// ── Analytics API ──

export interface AnalyticsData {
  total_contacts: number;
  unread_contacts: number;
  total_visitors: number;
  total_subscribers: number;
  total_projects: number;
  recent_contacts: Array<{
    id: number;
    name: string;
    email: string;
    message: string;
    is_read: boolean;
    created_at: string;
  }>;
  pinecone_status: {
    initialized: boolean;
    api_key_set: boolean;
    index_name: string;
    region: string;
  };
}

export async function getAnalytics(): Promise<AnalyticsData> {
  return apiFetch<AnalyticsData>('/analytics/');
}

// ── Search API (Pinecone) ──

export async function semanticSearch(query: string, topK: number = 5): Promise<unknown> {
  return apiFetch(`/search/?q=${encodeURIComponent(query)}&top_k=${topK}`);
}

export async function getPineconeStatus(): Promise<{
  initialized: boolean;
  api_key_set: boolean;
  index_name: string;
  region: string;
}> {
  return apiFetch('/search/status');
}
