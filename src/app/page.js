/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';

export default function Home() {
    const cards = [
        {
            id: 1,
            logo: 'clientes.gif',
            route: '/clients',
            text: "Lista de clientes"
        },
        {
            id: 2,
            logo: 'agregar-cliente.gif',
            route: '/add-clients',
            text: "Agregar clientes"
        }
    ];

    return (
        <>
            <div className=''>
                <div className="flex flex-col items-center py-4 sm:pt-12">
                    <h1 className="font-extrabold text-3xl sm:text-6xl tracking-wide">DASHBOARD</h1>
                    <h3 className="font-semibold sm:text-xl sm:pb-8 sm:pt-8">Gestión de Clientes</h3>

                    <div className="container flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 ">
                        {cards.map((card) => (
                            <div
                                key={card.id}
                                className=" bg-white sm:p-6 sm:w-80 sm:h-80 rounded-2xl shadow-lg flex flex-col items-center transition-transform transform hover:scale-105"
                            >
                                <img src={card.logo} alt={card.text} className="w-full h-44 sm:h-56 object-contain sm:mb-4" />
                                <Link href={card.route}>
                                    <h3 className="sm:text-lg font-semibold text-center cursor-pointer hover:text-blue-400">
                                        {card.text}
                                    </h3>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
