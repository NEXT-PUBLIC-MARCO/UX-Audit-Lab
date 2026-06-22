import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Audit } from "@/types";
import { loadAudits, saveAudits, resetAudits } from "@/lib/storage";

interface AuditCtx {
  audits: Audit[];
  getAudit: (id: string) => Audit | undefined;
  addAudit: (audit: Audit) => void;
  removeAudit: (id: string) => void;
  resetHistory: () => void;
  /** Transient preview images keyed by audit id (kept in-memory only). */
  previewImages: Record<string, string>;
  setPreviewImage: (id: string, dataUrl: string) => void;
}

const Ctx = createContext<AuditCtx | null>(null);

export function AuditProvider({ children }: { children: ReactNode }) {
  const [audits, setAudits] = useState<Audit[]>(() => loadAudits());
  const [previewImages, setPreviewImages] = useState<Record<string, string>>({});

  useEffect(() => {
    saveAudits(audits);
  }, [audits]);

  const value = useMemo<AuditCtx>(
    () => ({
      audits,
      getAudit: (id) => audits.find((a) => a.id === id),
      addAudit: (audit) => setAudits((prev) => [audit, ...prev.filter((a) => a.id !== audit.id)]),
      removeAudit: (id) => setAudits((prev) => prev.filter((a) => a.id !== id)),
      resetHistory: () => setAudits(resetAudits()),
      previewImages,
      setPreviewImage: (id, dataUrl) =>
        setPreviewImages((prev) => ({ ...prev, [id]: dataUrl })),
    }),
    [audits, previewImages],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAudits(): AuditCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudits must be used within AuditProvider");
  return ctx;
}
