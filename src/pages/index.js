'use client'

import React, {useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import Link from 'next/link'
import axios from "axios";

export default function Home() {

    const [ticker, setTicker] = useState('EXPL44');
    const [name, setName] = useState('Empresa exemplo');
    const [currentPrice, setCurrentPrice] = useState('R$ 10.00');
    const [quantity, setQuantity] = useState('2');

    const getCurrentDate = () => {
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];

        let current_datetime = new Date();
        return current_datetime.getDate() + " " + monthNames[current_datetime.getMonth()] + " " + current_datetime.getFullYear();
    }

    const [tickets, setTickets] = useState([]);


    useEffect(() => {
        const searchForAllPositions = async () => {
            try {
                const res = await axios.get("http://localhost:8080/position/all");
                setTickets(res.data);
            } catch (error) {
                console.error("Erro ao buscar todas as posições: ", error);
            }
        }
        searchForAllPositions();
    }, [])

    return (
        <div className="flex min-h-screen bg-slate-50 items-center flex-col gap-2">
            <Card className="w-[800px] h-[150px]">
                <CardHeader>
                    <CardTitle>Saldo Atual:</CardTitle>
                    <CardDescription>{getCurrentDate()}</CardDescription>
                </CardHeader>
                <CardContent>
                    <h1>
                        R$ {tickets.reduce((acc, ticket) => acc + (ticket.price * ticket.quantity), 0).toFixed(2)}
                    </h1>
                </CardContent>
            </Card>
            <Card className="w-[800px] h-[100%]">
                <CardHeader>
                    <CardTitle>Principais ativos:</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[55vh] w-[100%] rounded-md border p-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Ticker</TableHead>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Preço Atual</TableHead>
                                    <TableHead>Quantidade</TableHead>
                                    <TableHead>Posição</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.map((ticket, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{ticket.ticker}</TableCell>
                                        <TableCell>Nome da empresa</TableCell> {/* Substitua por uma propriedade real quando disponível */}
                                        <TableCell>{`R$ ${ticket.price.toFixed(2)}`}</TableCell>
                                        <TableCell className="text-green-700">{ticket.quantity}</TableCell>
                                        <TableCell>R$ {(ticket.price * ticket.quantity).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button asChild>
                        <Link href="/stocks">
                            Adicionar nova ação</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
