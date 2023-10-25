import NavigationMenu from "@/components/NavigationMenu";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

import React from "react";
export default function About() {
    return (<div className="flex min-h-screen bg-slate-50 items-center flex-col gap-2">
        <NavigationMenu></NavigationMenu>
        <Card className="w-[80%] h-[100%]">
            <CardHeader>
                <CardTitle>Sobre:</CardTitle>
            </CardHeader>
            <CardContent>
                <div>
                    <h1>Trabalho desenvolvido para a disciplina de WEB 2, com o professor André:</h1>
                    <h2>Alunos</h2>
                    <ul>
                        <li>Gabriel Augusto</li>
                        <li>Lucas Reuel</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    </div>);
}