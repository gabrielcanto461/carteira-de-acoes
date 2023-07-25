'use client'
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Combobox} from "@/components/Combobox";
import {Input} from "@/components/ui/input";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

export default function Stocks() {
    const [ticker, setTicker] = useState(null);
    const [name, setName] = useState('Nome da empresa');
    const [price, setPrice] = useState('R$ 10.00');
    const [quantity, setQuantity] = useState('2');
    const [positions, setPositions] = useState([]);
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

    useEffect(() => {
        const searchForTicker = async (ticker) => {
            try {
                const res = await axios.get(`https://brapi.dev/api/quote/${ticker}?range=1d&interval=1d`);
                const stock = res.data.results.at(0);

                setName(stock.longName);
                setPrice(`R$ ${stock.regularMarketPrice}`); // Supondo que 'regularMarketPrice' seja o valor atual.
            } catch (error) {
                console.error(`Erro ao buscar informações sobre a ação: ${ticker} error: [${error}]`)
            }
        }

        const loadAllPositions = async (ticker) => {
            try {
                const res = await axios.get(`http://localhost:8080/position/all/${ticker}?currentPrice=0`);

                const positionInfo = res.data;

                setPositions(positionInfo.positions);
            } catch (error) {
                console.error(`Erro ao buscar informações sobre a ação: ${ticker} error: [${error}]`)
            }
        }
        searchForTicker(ticker);
        loadAllPositions(ticker)
    }, [ticker]);


    const [suggestions, setSuggestions] = useState([]);

    const [tickets, setTickets] = useState([]);
    const handleAddTicker = () => {
        setTickets(tickets => [...tickets, {ticker, name, currentPrice: price, quantity}]);
    };

    const handleTickerChange = (e) => {
        const value = e.target.value;

        if (availableTickers.includes(value)) {
            setTicker(value);
        }
    };

    const handleConfirmPosition = async () => {
        try {
            const newPosition = {
                ticker,
                quantity: parseInt(quantity),
                name,
                price: parseFloat(price.substring(3)),
                currency: "BRL"
            };

            const res = await axios.post("http://localhost:8080/position/new", newPosition);
            handleNewPosition(res.data);
        } catch (error) {
            console.error(`Erro ao adicionar nova posição: ${error}`);
        }
    };

    const handleNewPosition = (position) => {
        setPositions(positions => [...positions, position]);
    }


    return (<div className="flex min-h-screen bg-slate-50 items-center flex-col gap-2">
            <Card className="w-[1000px] h-[100%]">
                <CardHeader>
                    <CardTitle>Adicionar novo papel:</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="ticker">Ticker</Label>
                                <div className="col-span-2">
                                    <Combobox
                                        selectedTicker={ticker}
                                        setSelectedTicker={setTicker}
                                        availableTickers={availableTickers}
                                        className="h-8 w-full"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="name">Nome</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="col-span-2 h-8"
                                />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="price">Preço Atual </Label>
                                <Input
                                    id="price"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
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
                                <div className="col-start-2 col-end-4 justify-self-end">
                                    {ticker !== null && <Button
                                        onClick={() => handleConfirmPosition()}
                                        variant='default'
                                        size='default'
                                        className="items-center gap-4">Confirmar
                                    </Button>}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {ticker && <Card className="w-[800px] h-[100%]">
                <CardHeader>
                    <CardTitle>Sua posição em {ticker}:</CardTitle>
                    <CardDescription>Últimas adições para o papel</CardDescription>
                </CardHeader>
                <CardContent>
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
                            {positions.map((position, index) => {
                                const priceStr = typeof position.price === 'string' ? position.price.substring(3) : '0';
                                const priceNumber = Number(priceStr);
                                const total = isNaN(priceNumber) ? 0 : priceNumber * position.quantity;

                                return (<TableRow key={index}>
                                        <TableCell className="font-medium">{position.ticker}</TableCell>
                                        <TableCell>{position.name}</TableCell>
                                        <TableCell>{position.price}</TableCell>
                                        <TableCell className="text-green-700">{position.quantity}</TableCell>
                                        <TableCell>R$ {total.toFixed(2)}</TableCell>
                                    </TableRow>);
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>}
        </div>);
}
