import axiosInstance, { cdnUrl } from "./client";

/* ------------------------------------------------------------------
   API → ENTITY MAP (existing backend contract — read-only)
   /settings  → company profile, counters, about, hero video, contact
   /cafes     → BRANDS (each cafe = one brand) with translations
   /sub-cafes → PRODUCT CATEGORIES (belong to a brand via cafe_id)
   /items     → PRODUCTS (cafe_id = brand, sub_cafe_id = category)
   /socails   → SOCIAL LINKS
   /partners  → PARTNER LOGOS
   /blogs     → NEWS / EVENTS POSTS
   POST /contact → contact form (multipart: name,email,subject,message)
------------------------------------------------------------------- */

export interface Translation {
  id?: number;
  locale: string;
  name?: string;
  description?: string | null;
  keywords?: string | null;
  meta_description?: string | null;
  specialization?: string | null;
  address?: string | null;
  notes?: string | null;
}

export interface RawBrand {
  id: number;
  slug: string;
  logo: string | null;
  cover: string | null;
  url: string | null;
  name: string;
  logo_path?: string | null;
  translations?: Translation[];
  created_at?: string;
}

export interface RawCategory {
  id: number;
  slug: string;
  name: string;
  logo: string | null;
  icon: string | null;
  cover: string | null;
  cafe_id: number;
  logo_path?: string | null;
  icon_path?: string | null;
  translations?: Translation[];
}

export interface RawProduct {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  image_path?: string | null;
  weight: string | null;
  country_origin: string | null;
  is_available: number;
  cafe_id: number;
  sub_cafe_id: number | null;
  category?: RawBrand;
  media?: { id: number; image: string; image_path?: string }[];
  translations?: Translation[];
}

export interface RawSettings {
  image_logo_path: string | null;
  main_image_path: string | null;
  about_image_path: string | null;
  about_logo_path: string | null;
  about_file_path: string | null;
  logos_back_path: string | null;
  banner_image_path?: string | null;
  phone: string;
  email: string;
  addresse: string;
  title: string;
  description: string;
  copyright: string;
  about_us: string;
  experience_count: number;
  employees_count: number;
  vehicles_count: number;
  translations?: Translation[];
}

export interface RawSocial {
  id: number;
  url: string;
  icon: string | null;
  icon_path?: string | null;
}

export interface RawPartner {
  id: number;
  image_path: string | null;
}

export interface RawBlog {
  id: number;
  title: string;
  content: string;
  image_path: string | null;
  created_at: string;
}

/* ---------------- Adapter helpers ---------------- */

function tr(list: Translation[] | undefined, field: keyof Translation, locale: string): string | null {
  if (!list?.length) return null;
  const match = list.find((t) => t.locale === locale) || list.find((t) => t.locale === "en");
  const value = match?.[field];
  return typeof value === "string" && value.trim() ? value : null;
}

/* ---------------- Services ---------------- */

export async function fetchSettings(locale: string): Promise<RawSettings | null> {
  const { data } = await axiosInstance.get("/settings");
  const s = data?.settings ?? data;
  if (!s) return null;
  // @ts-ignore (ignoring that about_us is not in the Translation interface to fix the mapping)
  return { ...s, about_us: tr(s.translations, "about_us", locale) || s.about_us };
}

export async function fetchBrands(locale: string): Promise<RawBrand[]> {
  const { data } = await axiosInstance.get("/cafes");
  const list = Array.isArray(data) ? data : [];
  return list.map((b: RawBrand) => ({
    ...b,
    name: tr(b.translations, "name", locale) || b.name,
    logo_path: cdnUrl(b.logo) || b.logo_path,
    cover: cdnUrl(b.cover),
  }));
}

export async function fetchBrandBySlug(slug: string, locale: string): Promise<RawBrand | null> {
  const brands = await fetchBrands(locale);
  return brands.find((b) => b.slug === slug) || null;
}

export async function fetchCategories(locale: string): Promise<RawCategory[]> {
  const { data } = await axiosInstance.get("/sub-cafes");
  const list = Array.isArray(data) ? data : [];
  return list.map((c: RawCategory) => ({
    ...c,
    name: tr(c.translations, "name", locale) || c.name,
    logo_path: cdnUrl(c.logo) || c.logo_path,
    icon_path: c.icon && c.icon !== c.logo ? cdnUrl(c.icon) : null,
    cover: cdnUrl(c.cover),
  }));
}

export async function fetchProducts(locale: string): Promise<RawProduct[]> {
  const { data } = await axiosInstance.get("/items");
  const list = Array.isArray(data) ? data : [];
  return list
    .filter((p: RawProduct) => p.is_available !== 0)
    .map((p: RawProduct) => {
      const name = tr(p.translations, "name", locale) || p.name;
      const description = tr(p.translations, "description", locale) || p.description || "";
      return {
        ...p,
        name,
        description,
        image_path: cdnUrl(p.image) || p.image_path,
        media: p.media?.map((m) => ({ ...m, image_path: cdnUrl(m.image) || m.image_path })),
        category: p.category
          ? { ...p.category, name: tr(p.category.translations, "name", locale) || p.category.name, logo_path: cdnUrl(p.category.logo) || p.category.logo_path }
          : undefined,
      };
    });
}

export async function fetchSocials(): Promise<RawSocial[]> {
  const { data } = await axiosInstance.get("/socails");
  return Array.isArray(data) ? data : [];
}

export async function fetchPartners(): Promise<RawPartner[]> {
  const { data } = await axiosInstance.get("/partners");
  return Array.isArray(data) ? data : [];
}

export async function fetchBlogs(locale: string): Promise<RawBlog[]> {
  const { data } = await axiosInstance.get("/blogs");
  const list = Array.isArray(data) ? data : (data?.data ?? []);
  return list.map((b: any) => ({
    ...b,
    title: tr(b.translations, "title", locale) || b.title,
    content: tr(b.translations, "content", locale) || b.content,
  }));
}

/* Existing contact endpoint — payload contract preserved exactly */
export async function submitContact(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}, language = "en") {
  const payload = new FormData();
  payload.append("name", formData.name);
  payload.append("email", formData.email);
  payload.append("subject", formData.subject);
  payload.append("message", formData.message);
  const { data } = await axiosInstance.post("/contact", payload, {
    headers: { "X-localization": language },
  });
  return data;
}
