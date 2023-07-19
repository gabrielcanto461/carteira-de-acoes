'use client'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
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
        let formatted_date = current_datetime.getDate() + " " + monthNames[current_datetime.getMonth()] + " " + current_datetime.getFullYear();
        return formatted_date;
    }

    const [tickets, setTickets] = useState([]);
    const handleAddTicker = () => {
        setTickets(tickets => [...tickets, {ticker, name, currentPrice, quantity}]);
    };

    const [availableTickers, setAvailableTickers] = useState([]);

    useEffect(() => {
        const searchForAvailableTickers = async () => {
            try {
                const res = await axios.get('https://brapi.dev/api/available');
                setAvailableTickers(res.data.stocks);
            } catch (error) {
                console.error("Erro ao buscar os dados:", error);
            }
        };
        searchForAvailableTickers();
    }, []);

    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        setSuggestions(availableTickers.filter(ticket => ticket.includes(ticker)));
    }, [ticker]);

    const handleTickerChange = (e) => {
        const value = e.target.value;

        if (availableTickers.includes(value)) {
            setTicker(value);
        }
    };


    console.log(availableTickers)
    return (
        <div className="flex min-h-screen bg-slate-50 items-center flex-col gap-2">
            <Card className="w-[800px] h-[150px]">
                <CardHeader>
                    <CardTitle>Saldo Atual:</CardTitle>
                    <CardDescription>{getCurrentDate()}</CardDescription>
                </CardHeader>
                <CardContent>
                    <h1>R$ 15800,00</h1>
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
                                        <TableCell>{ticket.name}</TableCell>
                                        <TableCell>{ticket.currentPrice}</TableCell>
                                        <TableCell className="text-green-700">{ticket.quantity}</TableCell>
                                        <TableCell>R$ {(ticket.currentPrice.substring(3)*ticket.quantity).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">Open popover</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-500">
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="ticker">Ticker</Label>
                                        <Input
                                            id="ticker"
                                            defaultValue={ticker}
                                            onChange={handleTickerChange}
                                            className="col-span-2 h-8"
                                        />
                                        <datalist id="tickers-sugestoes">
                                            {suggestions.map((suggestion, index) => (
                                                <option key={index} value={suggestion} />
                                            ))}
                                        </datalist>
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="name">Nome</Label>
                                        <Input
                                            id="name"
                                            defaultValue={name}
                                            onChange={e => setName(e.target.value)}
                                            className="col-span-2 h-8"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="price">Preço Atual </Label>
                                        <Input
                                            id="price"
                                            defaultValue={currentPrice}
                                            onChange={e => setCurrentPrice(e.target.value)}
                                            className="col-span-2 h-8"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="quantity">Quantidade</Label>
                                        <Input
                                            id="quantity"
                                            defaultValue={quantity}
                                            onChange={e => setQuantity(e.target.value)}
                                            className="col-span-2 h-8"
                                        />
                                    </div>
                                    <Button onClick={() => handleAddTicker()} variant='default' size='default'
                                            className="items-center gap-4">Confirmar</Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </CardFooter>
            </Card>
        </div>
    )
}
