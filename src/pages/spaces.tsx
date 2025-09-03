// Home pós-login: lista/cadastro de spaces
import React from "react";
import AppLayout from "../components/layout/AppLayout";
import SpaceList from "../components/spaces/SpaceList";
import { useSpaces, useCreateSpace } from "./spaces.query";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function SpacesPage() {
  useAuthGuard();
  const { data: spaces = [], isLoading } = useSpaces();
  const createSpace = useCreateSpace();
  const navigate = useNavigate();

  const [name, setName] = React.useState("");

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const res = await createSpace.mutateAsync(name.trim());
      // Caso backend retorne o novo espaço com _id
      const id = res?._id;
      setName("");
      if (id) navigate(`/spaces/${id}`);
    } catch (err) {
      // erro tratado pelo mutation
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl mb-4">Spaces</h2>
        <form className="flex gap-2 mb-4" onSubmit={onCreate}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Novo espaço"
          />
          <Button type="submit" loading={(createSpace as any).isLoading}>
            Criar
          </Button>
        </form>

        {isLoading ? <div>Carregando...</div> : <SpaceList spaces={spaces} />}
      </div>
    </AppLayout>
  );
}
