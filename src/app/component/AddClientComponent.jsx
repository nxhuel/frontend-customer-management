'use client';

import { useEffect, useState } from "react";
import ClientService from "../service/ClientService";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const AddClientComponent = ({ id }) => {
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [detail, setDetail] = useState('');
    const router = useRouter();

    const saveOrUpdateClient = (e) => {
        e.preventDefault();
        const cliente = {
            client: { name, lastname, email },
            detail
        };

        if (id) {
            ClientService.updateClient(id, cliente).then((response) => {
                console.log(response.data);
                router.push("/clients");
            }).catch(err => {
                console.log(err);
            });
        } else {
            ClientService.createClient(cliente).then((response) => {
                console.log(response.data);
                router.push("/clients");
            }).catch(err => {
                console.log(err);
            });
        }
    }

    useEffect(() => {
        ClientService.getClientById(id).then((response) => {
            setName(response.data.name);
            setLastname(response.data.lastname);
            setEmail(response.data.email);
        }).catch(err => {
            console.log(err);
        });
    }, [])

    return (
        <>
            <div>
                <div className="flex flex-col items-center p-4">
                    <h1 className=" font-bold text-4xl p-12">
                        {id ? "Actualizar Cliente" : "Registrar Cliente"}
                    </h1>
                    <form action="#" method="POST" className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <label className="block text-gray-700 font-medium">Nombre:</label>
                        <input
                            type="text"
                            placeholder="Digite nombre del cliente"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <label className="block text-gray-700 font-medium">Apellido:</label>
                        <input
                            type="text"
                            placeholder="Digite apellido del cliente"
                            name="lastname"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <label className="block text-gray-700 font-medium">Email:</label>
                        <input
                            type="email"
                            placeholder="Digite email del cliente"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <label className="block text-gray-700 font-medium">Detalles:</label>
                        <input
                            type="text"
                            placeholder="Digite detalles"
                            name="detail"
                            value={detail}
                            onChange={(e) => setDetail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            onClick={(e) => saveOrUpdateClient(e)}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                        >
                            Guardar
                        </button>
                        &nbsp;
                        <Link href="/clients">
                            <button className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition">
                                Cancelar
                            </button>
                        </Link>
                    </form>
                </div>
            </div>
        </>
    );

}