// Quadro vivo: itens, upload, realtime — versão polida
import React from "react";
import { useParams } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import ItemList from "../../components/items/ItemList";
import ItemComposer from "../../components/items/ItemComposer";
import { useItems, useDeleteItem } from "../../pages/items.query";
import { useSocketSpace } from "../../hooks/useSocketSpace";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { useQueryClient } from "@tanstack/react-query";

type Item = {
  _id: string;
  type: string;
  content?: string;
  createdAt?: string;
  [key: string]: any;
};

export default function SpaceDetailPage() {
  useAuthGuard();
  const { spaceId } = useParams();
  const sid = spaceId || "";
  const qc = useQueryClient();
  const socketRef = useSocketSpace(sid);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useItems(sid);

  const deleteItem = useDeleteItem(sid);

  // flatten pages
  const items: Item[] = React.useMemo(() => {
    if (!data?.pages?.length) return [];
    return data.pages.flatMap((p: any) => p.items || []);
  }, [data]);

  // realtime events
  React.useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const onCreated = (item: Item | null) => {
      if (!item) return;
      qc.setQueryData(["items", sid], (old: any) => {
        if (!old?.pages || !Array.isArray(old.pages)) return old;
        const pages = [...old.pages];
        const first = pages[0] ?? { items: [] };
        pages[0] = { ...first, items: [item, ...(first.items || [])] };
        return { ...old, pages };
      });
    };

    const onDeleted = (payload: any) => {
      const id =
        typeof payload === "string" ? payload : payload?.id ?? payload?._id;
      if (!id) return;
      qc.setQueryData(["items", sid], (old: any) => {
        if (!old?.pages || !Array.isArray(old.pages)) return old;
        const pages = old.pages.map((p: any) => ({
          ...p,
          items: (p.items || []).filter((it: Item) => it._id !== id),
        }));
        return { ...old, pages };
      });
    };

    socket.on("item:created", onCreated);
    socket.on("item:deleted", onDeleted);
    return () => {
      socket.off("item:created", onCreated);
      socket.off("item:deleted", onDeleted);
    };
  }, [socketRef, qc, sid]);

  // infinite scroll observer
  const loadMoreRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "320px 0px 0px 0px", threshold: 0.1 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleDelete = React.useCallback(
    async (id: string) => {
      if (!confirm("Confirmar exclusão deste item?")) return;
      try {
        await deleteItem.mutateAsync(id);
      } catch {
        // poderia exibir um toast aqui se tiver seu sistema de notificação
        console.error("Falha ao excluir item");
      }
    },
    [deleteItem]
  );

  const total = items.length;

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-5xl px-4 py-6">
        {/* Header */}
        <header className="mb-6">
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white shadow-lg">
            <div className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <nav
                  aria-label="Breadcrumb"
                  className="text-xs/5 text-white/70"
                >
                  <ol className="flex items-center gap-2">
                    <li className="hover:text-white transition-colors">
                      YourBox
                    </li>
                    <li aria-hidden="true">/</li>
                    <li className="hover:text-white transition-colors">
                      Espaços
                    </li>
                    <li aria-hidden="true">/</li>
                    <li className="text-white font-semibold">Detalhe</li>
                  </ol>
                </nav>
                <h1 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
                  Espaço
                </h1>
                <p className="mt-1 text-sm text-white/80">
                  Quadro vivo com upload e sincronização em tempo real
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  aria-label="Renomear espaço"
                  // onClick={}
                >
                  Renomear
                </button>
                <button
                  type="button"
                  className="rounded-xl bg-red-500/90 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  aria-label="Excluir espaço"
                  // onClick={}
                >
                  Excluir
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-xs text-white/70">
              <span>
                ID: <code className="text-white/90">{sid}</code>
              </span>
              <span>
                Itens: <span className="font-semibold text-white">{total}</span>
              </span>
            </div>
          </div>
        </header>

        {/* Composer fixo com card clean */}
        <section className="sticky top-2 z-10 mb-6">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-sm">
            <ItemComposer spaceId={sid} />
          </div>
        </section>

        {/* Conteúdo */}
        <section>
          {status !== "success" && (
            <div className="space-y-3">
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          )}

          {status === "error" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
              <p className="font-semibold">
                Não foi possível carregar os itens.
              </p>
              <p className="text-sm opacity-90">
                {String(
                  (error as any)?.message || "Tente novamente mais tarde."
                )}
              </p>
            </div>
          )}

          {status === "success" && (
            <>
              {items.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  <div className="rounded-2xl border border-slate-200 bg-white p-2 md:p-3">
                    <ItemList items={items} onDelete={handleDelete} />
                  </div>

                  <div
                    ref={loadMoreRef}
                    className="mt-4 h-10 rounded-xl border border-dashed border-slate-300/70 bg-slate-50 text-slate-600 flex items-center justify-center text-sm"
                  >
                    {isFetchingNextPage
                      ? "Carregando..."
                      : hasNextPage
                      ? "Desça para carregar mais"
                      : "Você chegou ao fim 🎉"}
                  </div>
                </>
              )}
            </>
          )}
        </section>
      </div>
    </AppLayout>
  );
}

/* --- UI helpers --- */

function SkeletonRow() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded bg-slate-200" />
          <div className="h-3 w-2/3 rounded bg-slate-200" />
        </div>
        <div className="h-8 w-16 rounded-lg bg-slate-200" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
      <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-slate-100" />
      <h3 className="text-lg font-bold text-slate-900">Sem itens por aqui</h3>
      <p className="mt-1 text-sm text-slate-600">
        Envie um arquivo, cole um texto ou crie um link para começar.
      </p>
      <p className="mt-2 text-xs text-slate-500">
        Tudo aparece instantaneamente em todos os seus dispositivos.
      </p>
    </div>
  );
}
