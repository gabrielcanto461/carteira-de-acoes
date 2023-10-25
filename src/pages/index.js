import React, {useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import Link from 'next/link'
import axios from "axios";
import NavigationMenu, {Header} from "@/components/NavigationMenu";
import {ClipboardEdit, Loader2, Trash} from 'lucide-react';
import {ProgressBar} from "@/components/ProgressBar";
import {useRouter} from "next/router";

const backendHost = "http://localhost:8080/api";

export const Icons = {
    spinner: Loader2,
};
export default function Home() {
    const [loading, setLoading] = useState(false);
    const [tickets, setTickets] = useState([]);
    const router = useRouter();
    const getCurrentDate = () => {
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];

        let current_datetime = new Date();
        return current_datetime.getDate() + " " + monthNames[current_datetime.getMonth()] + " " + current_datetime.getFullYear();
    }

    useEffect(() => {
        const searchForAllPositions = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${backendHost}/positions/grouped`);
                console.log(res.data);
                setTickets(res.data);
            } catch (error) {
                console.error("Erro ao buscar todas as posições: ", error);
            } finally {
                setLoading(false);
            }
        }
        searchForAllPositions();
    }, [])

    const handleEditButton = (ticker) => {
        // Navegar para a página Stocks e passar o ticker como parâmetro

        router.push(`/stocks?ticker=${ticker}`);
    }

    const handleDeleteButton = (ticker) => {
        // Navegar para a página Stocks e passar o ticker como parâmetro

        router.push(`/stocks?ticker=${ticker}`);
    }

    return (
        <div className="flex min-h-screen bg-slate-50 items-center flex-col gap-2">
            <NavigationMenu></NavigationMenu>
            {
                loading ? (<ProgressBar></ProgressBar>) :
                    (<>
                        <Card className="w-[80%] h-[150px]">
                            <CardHeader>
                                <CardTitle>Saldo Atual:</CardTitle>
                                <CardDescription>{getCurrentDate()}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <h1>
                                    R$ {tickets.reduce((acc, ticket) => acc + (ticket.totalInvested), 0).toFixed(2)}
                                </h1>
                            </CardContent>
                        </Card>
                        <Card className="w-[80%] h-[100%]">
                            <CardHeader className="w-[100%] h-[75px] justify-between flex-row items-center">
                                <CardTitle>Principais ativos:</CardTitle>
                                <Button asChild>
                                    <Link href="/stocks" className="mr-16" >
                                        Adicionar nova ação</Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[55vh] w-[100%] rounded-md border p-4">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead></TableHead>
                                                <TableHead>Qtd.</TableHead>
                                                <TableHead className="w-[100px]">Ticker</TableHead>
                                                <TableHead>Preço Atual</TableHead>
                                                <TableHead>Total investido</TableHead>
                                                <TableHead>Rendimento</TableHead>
                                                <TableHead></TableHead>
                                                <TableHead></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {tickets.map((ticket, index) => (

                                                <TableRow key={index}>
                                                    <TableCell><img className="w-10 h-10 rounded-sm"
                                                                    src={ticket.logo} alt=""/></TableCell>
                                                    <TableCell>{ticket.quantity}</TableCell>
                                                    <TableCell
                                                        className="font-medium">{ticket.ticker}</TableCell>
                                                    <TableCell>{`R$ ${ticket.currentPrice.toFixed(2)}`}</TableCell>
                                                    <TableCell>R$ {ticket.totalInvested.toFixed(2)}</TableCell>
                                                    <TableCell
                                                        className={`font-bold ${ticket.netAmount >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                        R$ {Math.abs(ticket.netAmount).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            onClick={() => handleEditButton(ticket.ticker)}
                                                            size='default'
                                                            variant='outline'
                                                            className="items-center gap-4"><ClipboardEdit className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            onClick={() => handleDeleteButton(ticket.ticker)}
                                                            variant='outline'
                                                            size='default'
                                                            className="items-center gap-4"><Trash className="h-4 w-4"/>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>

                                    </Table>
                                </ScrollArea>
                            </CardContent>
                            <CardFooter className="flex justify-end">

                            </CardFooter>
                        </Card>
                    </>)}
        </div>
    );
}
