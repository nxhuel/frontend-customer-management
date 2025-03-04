'use client';
import { useEffect, useState } from "react";
import HistoryService from "../service/HistoryService";

export const ListHistoryComponent = () => {
    const [history, setHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        listHistory();
    }, []);

    const listHistory = () => {
        HistoryService.getAllHistory().then(response => {
            setHistory(response.data);
            console.log(response.data);
        }).catch(err => {
            console.log(err);
        })
    }

    const totalPages = Math.ceil(history.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const historyPaginated = history.slice(startIndex, endIndex);

    return (
        <>
        <div className="p-4">
            <div className="text-center p-4 font-bold text-black text-3xl">
                <h1>HISTORIAL DE CLIENTES</h1>
            </div>
            <div className="flex justify-center pt-4 pb-4 pl-72 pr-72 text-center">
                <table className="min-w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
                    <thead className="text-white">
                        <tr>
                            <th className="px-4 border py-2 border-gray-300 text-black">Fecha/Hora</th>
                            <th className="px-4 border py-2 border-gray-300 text-black">Acción</th>
                            <th className="px-4 border py-2 border-gray-300 text-black">Cliente</th>
                            <th className="px-4 border py-2 border-gray-300 text-black">Detalles</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {historyPaginated.map((h) => (
                            <tr key={h.id} className="hover:bg-gray-100 transition">
                                <td className="px-4 py-2 border border-gray-300">{h.date}</td>
                                <td className="px-4 py-2 border border-gray-300">{h.action}</td>
                                <td className="px-4 py-2 border border-gray-300">
                                    {h.client ? `${h.client.name} ${h.client.lastname}` : `${h.clientName} ${h.clientLastname}`}
                                </td>
                                <td className="px-4 py-2 border border-gray-300">{h.detail}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Controles de paginación */}
            <div className="flex justify-center items-center gap-4 pt-4">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 disabled:opacity-50"
                >
                    Anterior
                </button>
                <span className="text-black font-bold">Página {currentPage} de {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>

            {/* Botón de exportar */}
            <div className="pt-4 pr-72 flex justify-end gap-4">
                <a href='#' className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">Exportar datos</a>
            </div>
        </div>
    </>
    );
}