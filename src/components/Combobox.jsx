"use client"

import * as React from "react"
import {Check, ChevronsUpDown} from "lucide-react"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {ScrollArea} from "@/components/ui/scroll-area";

export function Combobox({availableTickers, selectedTicker, setSelectedTicker, className}) {
    const [open, setOpen] = React.useState(false)

    const [buttonWidth, setButtonWidth] = React.useState(0);
    const buttonRef = React.useRef();

    const handleSelect = (ticker) => {
        setSelectedTicker(ticker)
        setOpen(false)
    }

    React.useEffect(() => {
        if (buttonRef.current) {
            setButtonWidth(buttonRef.current.getBoundingClientRect().width);
        }
    }, []);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`w-full justify-between ${className}`}
                    ref={buttonRef} // ref para o botão
                >
                    {selectedTicker || "Escolha o ticker..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" style={{width: `${buttonWidth}px`}}>
                <Command>
                    <CommandInput placeholder="Escolha o ticker..."/>
                    <CommandEmpty>Nenhum ticker encontrado.</CommandEmpty>
                    <div className="min-h-[100%] max-h-[50vh] overflow-auto">
                        <ScrollArea className="rounded-md border p-0">
                            <CommandGroup>
                                {availableTickers.map((ticker) => (
                                    <CommandItem
                                        key={ticker}
                                        onSelect={() => {
                                            handleSelect(ticker);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedTicker === ticker ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {ticker}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </ScrollArea>
                    </div>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
