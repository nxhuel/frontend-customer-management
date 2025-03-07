'use client';
import { useEffect, useState } from "react";
import HistoryService from "../service/HistoryService";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const ListHistoryComponent = () => {
    const [history, setHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [searchTerm, setSearchTerm] = useState("");
    const [exportFormat, setExportFormat] = useState("csv");


    useEffect(() => {
        const updateItemsPerPage = () => {
            if (window.innerWidth < 768) {
                setItemsPerPage(1); // Celular
            } else {
                setItemsPerPage(8); // Escritorio
            }
        };

        updateItemsPerPage();
        window.addEventListener("resize", updateItemsPerPage); 

        return () => window.removeEventListener("resize", updateItemsPerPage); 
    }, []);

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

    const filteredHistory = history.filter(h =>
        (h.action?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (h.detail?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (h.date?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        ((h.client?.name || h.clientName || '').toLowerCase().includes(searchTerm.toLowerCase())) ||
        ((h.client?.lastname || h.clientLastname || '').toLowerCase().includes(searchTerm.toLowerCase()))
    );


    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const historyPaginated = filteredHistory.slice(startIndex, endIndex);

    const exportToCSV = (data, filename = "historial_clientes.csv") => {
        const csvHeader = ["Fecha/Hora", "Accion", "Cliente", "Detalles"].join(",") + "\n";
    
        const csvRows = data.map(history => 
            [
                history.date, 
                history.action,
                history.client 
                    ? `${history.client.name} ${history.client.lastname}` 
                    : `${history.clientName} ${history.clientLastname}`,
                history.detail
            ].join(",")
        );
    
        const csvContent = "data:text/csv;charset=utf-8," + csvHeader + csvRows.join("\n");
    
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
    };
    

    const exportToExcel = (data, filename = "historial_clientes.xlsx") => {
        const worksheet = XLSX.utils.json_to_sheet(data.map(history => ({
            Fecha: history.date,
            Acción: history.action,
            Cliente: history.client
                ? `${history.client.name} ${history.client.lastname}`
                : `${history.clientName} ${history.clientLastname}`,
            Detalle: history.detail
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");
        XLSX.writeFile(workbook, filename);
    };

    const exportToPDF = (data, filename = "historial_clientes.pdf") => {
        const doc = new jsPDF();
        doc.text("Historial de Clientes", 20, 10);

        autoTable(doc, {
            head: [["Fecha/Hora", "Acción", "Cliente", "Detalles"]],
            body: data.map(history => [
                history.date,
                history.action,
                history.client
                    ? `${history.client.name} ${history.client.lastname}`
                    : `${history.clientName} ${history.clientLastname}`,
                history.detail
            ]),
        });

        doc.save(filename);
    };

    return (
        <>
            <div className="p-4">
                <div className="text-center p-4 font-bold text-black text-3xl">
                    <h1>HISTORIAL DE CLIENTES</h1>
                </div>

                {/* Búsqueda */}
                <div className="flex justify-center ">
                    <input
                        type="text"
                        placeholder="Buscar por fecha/hora, acción, cliente o detalles..."
                        className="border p-2 w-96 rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto flex sm:justify-center pt-4 pb-4 sm:pl-72 sm:pr-72 text-center">
                    <table className="min-w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
                        <thead className="text-white">
                            <tr>
                                <th className="px-2 sm:px-4 border py-2 border-gray-300 text-black">Fecha/Hora</th>
                                <th className="px-2 sm:px-4 border py-2 border-gray-300 text-black">Acción</th>
                                <th className="px-2 sm:px-4 border py-2 border-gray-300 text-black">Cliente</th>
                                <th className="px-2 sm:px-4 border py-2 border-gray-300 text-black">Detalles</th>
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
                <div className="pt-4 sm:pr-72 flex justify-end gap-4">
                    <select
                        className="border p-2 rounded-md"
                        onChange={(e) => setExportFormat(e.target.value)}
                        value={exportFormat}
                    >
                        <option value="csv">CSV</option>
                        <option value="excel">Excel</option>
                        <option value="pdf">PDF</option>
                    </select>

                    <button
                        onClick={() => {
                            if (exportFormat === "csv") exportToCSV(history);
                            else if (exportFormat === "excel") exportToExcel(history);
                            else if (exportFormat === "pdf") exportToPDF(history);
                        }}
                        className="bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition"
                    >
                        Exportar datos
                    </button>
                </div>
            </div>
        </>
    );
}