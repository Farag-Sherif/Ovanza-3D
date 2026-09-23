import { useQuery } from "@tanstack/react-query";
import {
  fetchSettings, fetchBrands, fetchCategories, fetchProducts,
  fetchSocials, fetchPartners, fetchBlogs,
} from "../api/services";
import { useLanguage } from "../context/LanguageContext";

function useLocalized<Q>(fn: (locale: string) => Promise<Q>) {
  const { language } = useLanguage();
  return useQuery({
    queryKey: [fn.name, language],
    queryFn: () => fn(language),
  });
}

export const useSettings = () => useLocalized(fetchSettings);
export const useBrands = () => useLocalized(fetchBrands);
export const useCategories = () => useLocalized(fetchCategories);
export const useProducts = () => useLocalized(fetchProducts);
export const useBlogs = () => useLocalized(fetchBlogs);

export function useSocials() {
  return useQuery({ queryKey: ["socials"], queryFn: () => fetchSocials(), staleTime: Infinity });
}
export function usePartners() {
  return useQuery({ queryKey: ["partners"], queryFn: () => fetchPartners(), staleTime: Infinity });
}
