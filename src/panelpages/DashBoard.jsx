import { PanelCard } from "../panel-components/layout/PanelCard";
import { PanelCardSkeleton } from "../panel-components/layout/PanelCardSkeleton";
import { useState, useEffect } from "react";
import { userService } from "../data/userService";

export default function DashBoard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(false);

      const data = await userService.getProfile();

      const mappedUser = {
        name: data.name,
      };
      setUser(mappedUser);
    } catch (err) {
      setError("Error al cargar la información: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <PanelCardSkeleton type="stats" />
          <PanelCardSkeleton type="list" />
          <PanelCardSkeleton type="actions" />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/*Contenedor principal*/}
      <div className="grid md:grid-cols-[auto_1fr] gap-6 p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/**Informacion Personal */}
          <PanelCard>
            <h1 className="text-4xl mb-4 font-bold">Bienvenido {user?.name}</h1>
            <h2 className="text-xl text-center font-semibold">
              Total Publicaciones
            </h2>
            <p className="text-5xl font-extrabold text-rose-600">3</p>
          </PanelCard>
          <PanelCard>
            <h2 className="font-semibold text-start text-xl mb-2">
              Últimas Publicaciones
            </h2>
            <div className="grid grid-cols-[2fr_1fr_auto] gap-4 items-center border-b py-2">
              {/**Titulo de la Entrada */}
              <p className="truncate">Titulo cualquiera de la entrada</p>
              {/**Fecha de creación */}
              <p className="text-sm text-gray-700">20 de Junio de 2025</p>
              <div className="flex gap-2">
                <button
                  className="ml-2 px-2 rounded-md  border border-gray-300 bg-gray-100 hover:bg-gray-200
                            cursor-pointer shadow-md transition font-semibold text-sm"
                >
                  Editar
                </button>
                <button
                  className="ml-2 px-2 rounded-md  border border-gray-200 bg-rose-500 hover:bg-rose-600
                            cursor-pointer text-white shadow-md transition font-semibold text-sm"
                >
                  Ver
                </button>
              </div>
            </div>
          </PanelCard>
          <PanelCard>
            <h2 className="font-semibold text-start text-xl mb-2">
              Accesos rápidos
            </h2>
          </PanelCard>
        </div>
      </div>
    </div>
  );
}
