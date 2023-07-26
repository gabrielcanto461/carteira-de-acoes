import React from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import Link from 'next/link'
import {Header} from "@/components/NavigationMenu";

export default function NavigationMenu() {
    return (
        <Card className="w-[80%] h-[75px] flex items-center justify-between bg-gray-800">
            <CardHeader className="flex items-center">
                <Link className="ml-2" href="/">
                    <img className="w-40 h-10 rounded-sm" src="../../next.svg" alt="Logo"/>
                </Link>
            </CardHeader>
            <CardContent className="flex items-center gap-8 mr-16 mt-4">
                <Link href="/">
                    <span className="cursor-pointer text-lg font-extrabold text-white hover:text-blue-500 transition-all duration-200 transform hover:scale-110">Inicio</span>
                </Link>
                <Link href="/stocks">
                    <span className="cursor-pointer text-lg font-extrabold text-white hover:text-blue-500 transition-all duration-200 transform hover:scale-110">Posições</span>
                </Link>
                <Link href="/about">
                    <span className="cursor-pointer text-lg font-extrabold text-white hover:text-blue-500 transition-all duration-200 transform hover:scale-110">Sobre</span>
                </Link>
            </CardContent>
        </Card>
    );
}
