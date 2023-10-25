'use client'
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Combobox} from "@/components/Combobox";
import {Input} from "@/components/ui/input";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import NavigationMenu from "@/components/NavigationMenu";
import {useRouter} from "next/router";
import {EditIcon, Trash} from "lucide-react";
import {FcCancel, FcCheckmark} from "react-icons/fc";


const backendHost = "http://localhost:8080/api";

export default function Stocks() {
    const router = useRouter();

    const urlTicker = router.query.ticker;

    const [ticker, setTicker] = useState(urlTicker || null);
    const [tempPrice, setTempPrice] = useState(null);
    const [tempQuantity, setTempQuantity] = useState(null);

    const [name, setName] = useState('Nome da empresa');
    const [price, setPrice] = useState('R$ 10.00');
    const [quantity, setQuantity] = useState('1');
    const [positions, setPositions] = useState([]);
    const [logo, setLogo] = useState('');
    const [availableTickers, setAvailableTickers] = useState([]);
    const [editingPositionId, setEditingPositionId] = useState(null);

    useEffect(() => {
        const searchForAvailableTickers = async () => {
            try {
                const res = await axios.get(backendHost.concat("/stocks"));
                console.log(res.data)
                setAvailableTickers(res.data);
            } catch (error) {
                console.error("Erro ao buscar os dados:", error);
            }
        };
        searchForAvailableTickers();
    }, []);

    useEffect(() => {
        const searchForTicker = async (ticker) => {
            if (ticker != null) {
                try {
                    const res = await axios.get(`${backendHost}/stocks/${ticker}`);
                    const stock = res.data;

                    console.log(stock);

                    setName(stock.name);
                    setPrice(`R$ ${stock.price}`);
                    setLogo(stock.logo);
                } catch (error) {
                    console.error(`Erro ao buscar informações sobre a ação: ${ticker} error: [${error}]`)
                }
            }
        }

        const loadAllPositions = async (ticker) => {
            if (ticker != null) {
                try {
                    const res = await axios.get(`${backendHost}/positions?ticker=${ticker}`);

                    const positionInfo = res.data;
                    console.log(positionInfo);
                    setPositions(positionInfo.positions);
                } catch (error) {
                    console.error(`Erro ao buscar informações sobre a ação: ${ticker} error: [${error}]`)
                }
            }
        }
        searchForTicker(ticker);
        loadAllPositions(ticker)
    }, [ticker]);


    const handleConfirmPosition = async () => {
        try {
            const newPosition = {
                quantity: parseInt(quantity),
                name,
                price: parseFloat(price.substring(3)),
                currency: "BRL",
                ticker,
                logo
            };

            console.log(newPosition)

            const res = await axios.post(backendHost.concat("/positions"), newPosition);

            newPosition._id = res.data;
            handleNewPosition(newPosition);
        } catch (error) {
            console.error(`Erro ao adicionar nova posição: ${error}`);
        }
    };

    const handleNewPosition = (position) => {
        console.log(position);
        setPositions(positions => [...positions, position]);
    }

    const handleEditAction = async (position) => {
        try {
            const res = await axios.put(`${backendHost}/positions/${position._id}`, position); // Certifique-se de enviar os dados atualizados para o backend aqui, se necessário

            if (res.status === 200) {
                setPositions(prevPositions => {
                    return prevPositions.map(pos => {
                        if (pos._id === position._id) {
                            return {...position}; // Retorne a posição atualizada
                        }
                        return pos; // Retorne as outras posições inalteradas
                    });
                });
            }
        } catch (error) {
            console.error(`Erro ao editar a posição: ${error}`);
        }
    };

    const handleDeleteAction = async (position) => {
        try {
            const res = await axios.delete(`${backendHost}/positions/${position._id}`);

            if (res.status === 200) {
                setPositions(prevPositions => prevPositions.filter(pos => pos._id !== position._id));
            }
        } catch (error) {
            console.error(`Erro ao deletar a posição: ${error}`);
        }
    };

    return (<div className="flex min-h-screen bg-slate-50 items-center flex-col gap-2">
        <NavigationMenu></NavigationMenu>
        <Card className="w-[80%] h-[100%]">
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
                            <Label htmlFor="name">Nome:</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="price">Preço:</Label>
                            <Input
                                id="price"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="quantity">Quantidade:</Label>
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
        {ticker && <Card className="w-[80%] h-[100%]">
            <CardHeader>
                <CardTitle>Sua posição em {ticker}:</CardTitle>
                <CardDescription>Últimas adições para o papel</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Preço</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead>Posição</TableHead>
                            <TableHead></TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {positions.map((position) => {
                            const total = isNaN(position.price) ? 0 : position.price * position.quantity;
                            const isEditing = position._id === editingPositionId;
                            return (<TableRow key={position._id}>
                                <TableCell>
                                    {isEditing ? (
                                        <Input
                                            value={tempPrice || `R$ ${position.price}`}
                                            onChange={e => setTempPrice(e.target.value)}
                                        />
                                    ) : (
                                        `R$ ${position.price}`
                                    )}
                                </TableCell>
                                <TableCell>
                                    {isEditing ? (
                                        <Input
                                            value={tempQuantity || position.quantity.toString()}
                                            onChange={e => setTempQuantity(e.target.value)}
                                        />
                                    ) : (
                                        position.quantity
                                    )}
                                </TableCell>
                                <TableCell>R$ {total.toFixed(2)}</TableCell>
                                <TableCell>
                                    {isEditing ? (
                                        <>
                                            <Button variant='outline' onClick={() => {
                                                const updatedPosition = {
                                                    ...position,
                                                    price: parseFloat(tempPrice.replace('R$', '').trim()),
                                                    quantity: parseInt(tempQuantity),
                                                    date: new Date()
                                                };
                                                handleEditAction(updatedPosition); // 3. Chame handleEditAction
                                                setEditingPositionId(null); // Sai do modo de edição após confirmar
                                                setTempPrice(null); // Limpe os valores temporários
                                                setTempQuantity(null);
                                            }}>
                                                <FcCheckmark className={'h-4 w-4'}/>
                                            </Button>
                                            <Button variant='outline' onClick={() => {
                                                setEditingPositionId(null); // Sai do modo de edição após confirmar
                                                setTempPrice(null); // Limpe os valores temporários
                                                setTempQuantity(null);
                                            }}><FcCancel className={'h-4 w-4'}/>
                                            </Button>

                                        </>
                                    ) : (
                                        <Button variant='outline' onClick={() => {
                                            setEditingPositionId(position._id);
                                            setTempPrice(`R$ ${position.price}`);
                                            setTempQuantity(position.quantity.toString());
                                        }}>
                                            <EditIcon className='h-4 w-4'/>
                                        </Button>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => handleDeleteAction(position)}
                                        variant='outline'
                                        size='default'
                                        className="items-center gap-4"><Trash className="h-4 w-4"/>
                                    </Button>
                                </TableCell>
                            </TableRow>);
                        })}
                        <TableRow className="font-bold bg-gray-200">
                            <TableCell>Total</TableCell>
                            <TableCell></TableCell>
                            <TableCell>{positions.reduce((sum, position) => sum + position.quantity, 0)}</TableCell>
                            <TableCell>R$ {positions.reduce((sum, position) => sum + (isNaN(position.price) ? 0 : position.price * position.quantity), 0).toFixed(2)}</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>}
    </div>);
}
