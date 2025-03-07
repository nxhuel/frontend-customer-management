'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import EmailIcon from '@mui/icons-material/Email';

import { useEffect, useState } from "react";
import ClientService from "../service/ClientService";
import Link from "next/link";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const ListClientsComponent = () => {
    const [clientes, setClientes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [detail, setDetail] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [exportFormat, setExportFormat] = useState("csv");
    const [itemsPerPage, setItemsPerPage] = useState(8);

    useEffect(() => {
        const updateItemsPerPage = () => {
            if (window.innerWidth < 768) {
                setItemsPerPage(2); // Celular
            } else {
                setItemsPerPage(8); // Escritorio
            }
        };

        updateItemsPerPage();
        window.addEventListener("resize", updateItemsPerPage); 

        return () => window.removeEventListener("resize", updateItemsPerPage); 
    }, []);

    useEffect(() => {
        listClients();
    }, []);

    const deleteClient = (id, detail) => {
        ClientService.deleteClient(id, detail).then((response) => {
            listClients();
        }).catch(err => {
            console.log(err);
        })
    };

    const listClients = () => {
        ClientService.getAllClients().then(response => {
            setClientes(response.data);
            console.log(response.data);
        }).catch(err => {
            console.log(err);
        })
    }

    const openDeleteModal = (id) => {
        setDeleteId(id);
        setShowModal(true);
    };

    const confirmDelete = () => {
        if (detail.trim() === "") {
            alert("Debe ingresar un motivo.");
            return;
        }
        deleteClient(deleteId, detail);
        setShowModal(false);
        setDetail('');
    };

    const filteredClients = clientes.filter(cliente =>
        cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const clientesPaginated = filteredClients.slice(startIndex, endIndex);

    const exportToCSV = (data, filename = "clientes.csv") => {
        const csvContent =
            "data:text/csv;charset=utf-8," +
            ["ID,Nombre,Apellido,Email"]
                .concat(data.map(cliente =>
                    `${cliente.id},${cliente.name},${cliente.lastname},${cliente.email}`
                ))
                .join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
    };

    const exportToExcel = (data, filename = "clientes.xlsx") => {
        const worksheet = XLSX.utils.json_to_sheet(data.map(cliente => ({
            ID: cliente.id,
            Nombre: cliente.name,
            Apellido: cliente.lastname,
            Email: cliente.email
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");
        XLSX.writeFile(workbook, filename);
    };

    const exportToPDF = (data, filename = "clientes.pdf") => {
        const doc = new jsPDF();
        doc.text("Lista de Clientes", 20, 10);

        autoTable(doc, {
            head: [["ID", "Nombre", "Apellido", "Email"]],
            body: data.map(cliente => [cliente.id, cliente.name, cliente.lastname, cliente.email]),
        });

        doc.save(filename);
    };

    return (
        <>
            <div className="p-4 ">
                <div className=" text-center p-4 font-bold text-black text-3xl">
                    <h1>LISTA DE CLIENTES</h1>
                </div>

                {/* Búsqueda */}
                <div className="flex justify-center ">
                    <input
                        type="text"
                        placeholder="Buscar por nombre, apellido o email..."
                        className="border p-2 w-96 rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className=" overflow-x-auto flex sm:justify-center pt-4 pb-4 sm:pl-72 sm:pr-72 text-center">
                    <table className="min-w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
                        <thead className=" text-white">
                            <tr>
                                <th className="px-2 sm:px-4 border py-2 border-gray-300 text-black">ID</th>
                                <th className="px-2 sm:px-4 border py-2 border-gray-300 text-black">Nombre</th>
                                <th className="px-2 sm:px-4 border py-2 border-gray-300 text-black">Apellido</th>
                                <th className="px-2 sm:px-4 border py-2 border-gray-300 text-black">Email</th>
                                <th className="px-2 sm:px-4 border py-2 border-gray-300 text-black">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {clientesPaginated.map((cliente) => (
                                <tr key={cliente.id} className="hover:bg-gray-100 transition">
                                    <td className="px-4 py-2 border border-gray-300">{cliente.id}</td>
                                    <td className="px-4 py-2 border border-gray-300">{cliente.name}</td>
                                    <td className="px-4 py-2 border border-gray-300">{cliente.lastname}</td>
                                    <td className="px-4 py-2 border border-gray-300">{cliente.email}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center flex justify-evenly">
                                        <Link
                                            href={`/edit-clients/${cliente.id}`}
                                            className="bg-blue-800 text-white py-2 px-2 rounded-md hover:bg-blue-900 transition">
                                            <UpdateIcon />
                                        </Link>
                                        <button
                                            onClick={() => openDeleteModal(cliente.id)}
                                            className="bg-red-800 text-white py-2 px-2 rounded-md hover:bg-red-900 transition">
                                            <DeleteIcon />
                                        </button>
                                        <button
                                            onClick={() => deleteClient(cliente.id)}
                                            className="bg-green-800 text-white py-2 px-2 rounded-md hover:bg-green-900 transition">
                                            <EmailIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {showModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                            <div className="bg-white p-8 rounded-lg shadow-lg">
                                <h2 className="text-lg font-bold mb-4">Eliminar Cliente</h2>
                                <p>Ingrese el motivo de eliminación:</p>
                                <input
                                    type="text"
                                    className="border p-2 w-full mt-2"
                                    value={detail}
                                    onChange={(e) => setDetail(e.target.value)}
                                />
                                <div className="flex justify-end mt-4">
                                    <button
                                        className="bg-gray-400 text-white py-2 px-4 rounded-md mr-2"
                                        onClick={() => setShowModal(false)}>
                                        Cancelar
                                    </button>
                                    <button
                                        className="bg-red-800 text-white py-2 px-4 rounded-md"
                                        onClick={confirmDelete}>
                                        Confirmar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
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

                <div className="pt-4 pr-72 flex sm:justify-end gap-4">
                    <Link href='/add-clients' className=" bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition">Agregar cliente</Link>
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
                            if (exportFormat === "csv") exportToCSV(clientes);
                            else if (exportFormat === "excel") exportToExcel(clientes);
                            else if (exportFormat === "pdf") exportToPDF(clientes);
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