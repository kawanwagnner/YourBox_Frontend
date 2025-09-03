// Lista de espaços
import { useNavigate } from "react-router-dom";

export default function SpaceList({ spaces }: { spaces: any[] }) {
  const navigate = useNavigate();
  return (
    <div className="space-list grid gap-4">
      {spaces.map((space) => (
        <div
          key={space._id}
          className="flex items-center justify-between p-4 bg-white rounded-2xl shadow"
        >
          <div>
            <h3 className="font-medium">{space.name}</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/spaces/${space._id}`)}
              className="text-sm px-3 py-1 rounded bg-blue-50"
            >
              Abrir
            </button>
            {/* ações: renomear / deletar - to implement */}
          </div>
        </div>
      ))}
    </div>
  );
}
