'use client';
import { useState } from 'react';
import { Menu, X } from "lucide-react";

export const HeaderComponent = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div>
                <header>
                    <nav className=" bg-cyan-700 p-2 sm:p-5 text-white font-bold text-3xl sm:text-4xl">
                        <div className='flex justify-between'>

                            <button
                                className="p-4 bg-cyan-700 text-white"
                                onClick={toggleMenu}
                            >
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                            <a className='flex items-center' href="/">GC</a>
                        </div>
                    </nav>
                    <div className={`z-10 bg-cyan-700 sm:w-64 h-full fixed transition-transform duration-300   ${isOpen ? "translate-x-0" : "-translate-x-72"}`}>
                        <div className="flex flex-col p-5 space-y-4">
                            <a href="/" className="text-white text-lg font-semibold hover:bg-cyan-800 p-2 rounded">Inicio</a>
                            <a href="/clients" className="text-white text-lg font-semibold hover:bg-cyan-800 p-2 rounded">Lista de clientes</a>
                            <a href="/add-clients" className="text-white text-lg font-semibold hover:bg-cyan-800 p-2 rounded">Registrar clientes</a>
                            <a href="/history" className="text-white text-lg font-semibold hover:bg-cyan-800 p-2 rounded">Historial de clientes</a>
                            <a href="mailto:nahueltisera03@gmail.com" className="text-white text-lg font-semibold hover:bg-cyan-800 p-2 rounded" target='_blank'>Contáctame</a>
                        </div>
                    </div>
                </header>
            </div>
        </>
    );
}