'use client'
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Combobox} from "@/components/Combobox";
import {Input} from "@/components/ui/input";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {console} from "next/dist/compiled/@edge-runtime/primitives";

export default function Stocks() {
    const [ticker, setTicker] = useState("");
    const [name, setName] = useState('Empresa exemplo');
    const [currentPrice, setCurrentPrice] = useState('R$ 10.00');
    const [quantity, setQuantity] = useState('2');

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

    const [tickets, setTickets] = useState([]);
    const handleAddTicker = () => {
        setTickets(tickets => [...tickets, {ticker, name, currentPrice, quantity}]);
    };

    const handleTickerChange = (e) => {
        const value = e.target.value;

        if (availableTickers.includes(value)) {
            setTicker(value);
        }
    };

    console.log(availableTickers)

    return (
        <div className="flex min-h-screen bg-slate-50 items-center flex-col gap-2">
            <Card className="w-[800px] h-[100%]">
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
                </CardContent>
            </Card>
            <Card className="w-[800px] h-[150px]">
                <CardHeader>
                    <CardTitle>Histórico do papel:</CardTitle>
                    <CardDescription>Últimas adições para o papel</CardDescription>
                </CardHeader>
                <CardContent>
                    <h1>R$ 15800,00</h1>
                </CardContent>
            </Card>
        </div>
    );
}
