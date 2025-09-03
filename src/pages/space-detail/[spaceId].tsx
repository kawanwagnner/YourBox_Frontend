// Quadro vivo: itens, upload, realtime
import React from "react";
import { useParams } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import ItemList from "../../components/items/ItemList";
import ItemComposer from "../../components/items/ItemComposer";
import { useItems, useDeleteItem } from "../../pages/items.query";
import { useSocketSpace } from "../../hooks/useSocketSpace";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { useQueryClient } from "@tanstack/react-query";

export default function SpaceDetailPage() {
  useAuthGuard();
  const { spaceId } = useParams();
  const qc = useQueryClient();
  const socketRef = useSocketSpace(spaceId || "");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useItems(spaceId || "");

  const deleteItem = useDeleteItem(spaceId || "");

  // flatten pages
  const items = React.useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((p: any) => p.items);
  }, [data]);

  // realtime events
  React.useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const onCreated = (item: any) => {
      if (!item) return; // ignore malformed payloads
      // prepend to cache
      qc.setQueryData(["items", spaceId], (old: any) => {
        if (!old || !old.pages || !Array.isArray(old.pages)) return old;
        const pages = [...old.pages];
        pages[0] = { ...pages[0], items: [item, ...(pages[0]?.items || [])] };
        return { ...old, pages };
      });
    };

    const onDeleted = (payload: any) => {
      // payload may be { id } or a string id or undefined
      const id =
        typeof payload === "string" ? payload : payload?.id ?? payload?._id;
      if (!id) return; // nothing to do
      qc.setQueryData(["items", spaceId], (old: any) => {
        if (!old || !old.pages || !Array.isArray(old.pages)) return old;
        const pages = old.pages.map((p: any) => ({
          ...p,
          items: (p.items || []).filter((it: any) => it._id !== id),
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
  }, [socketRef, qc, spaceId]);

  // infinite scroll observer
  const loadMoreRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!loadMoreRef.current) return;
    const el = loadMoreRef.current;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMoreRef.current, hasNextPage, isFetchingNextPage]);

  const handleDelete = async (id: string) => {
    if (!confirm("Confirma excluir este item?")) return;
    try {
      await deleteItem.mutateAsync(id);
    } catch {}
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-2xl">Espaço</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-yellow-100">
              Renomear
            </button>
            <button className="px-3 py-1 rounded bg-red-100">Excluir</button>
          </div>
        </header>

        <section className="mb-6">
          <ItemComposer spaceId={spaceId || ""} />
        </section>

        <section>
          {status !== "success" ? (
            <div>Carregando items...</div>
          ) : (
            <>
              <ItemList items={items} onDelete={handleDelete} />
              <div
                ref={loadMoreRef}
                className="h-8 flex items-center justify-center"
              >
                {isFetchingNextPage
                  ? "Carregando..."
                  : hasNextPage
                  ? "Carregar mais"
                  : "Fim"}
              </div>
            </>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
