import React, { FC, ReactElement, useState } from "react";
import { Box, Text, useFocus, useFocusManager, useInput } from 'ink';

export type Item = {
    label: string, // The label for the item.
    element: ReactElement, // The actual element to display when the item is selected.
    action?: (id: number) => void, // An optional function to call when the item is selected.
}

const MainMenu: FC<{ items: Item[] }> = ({ items }) => {
    const [ selected, setSelected ] = useState({ id: 0, focused: false });
    const { isFocused } = useFocus({ id: 'main-menu' })
    const { focusNext, focusPrevious } = useFocusManager();

    /**
     * 
     * [ button1, button2, button3,
     *   button4, button5, button6 ]
     * 
     */

    useInput((_, key) => {
        if (!isFocused) return;

        // If we're at the top row, go to the previous focus.
        if (key.upArrow && selected.id <= 2) {
            focusPrevious();
            return;
        }

        // If we're at the bottom row, go to next focus
        if (key.downArrow && selected.id >= items.length-2 ) {
            focusNext();
            return;
        }

        // Go up to the item above the current item.
        if (key.upArrow) {
            if (selected.id - 3 < 0 || selected.focused) return;
            setSelected({ id: selected.id - 3, focused: false });
        }

        // Go down to the item below the current item.
        if (key.downArrow) {
            if (selected.id + 3 >= items.length || selected.focused) return;
            setSelected({ id: selected.id + 3, focused: false });
        }

        // Go to the previous item
        if (key.leftArrow) {
            if (selected.id === 0 || selected.focused) return;
            setSelected({ id: selected.id-1, focused: false });
        }

        // Go to the next item
        if (key.rightArrow) {
            if (selected.id === items.length-1 || selected.focused) return;
            setSelected({ id: selected.id+1, focused: false });
        }

        // Leave the focused item
        if (key.escape) {
            setSelected( { id: selected.id, focused: false } );
        }

        // Enter/leave the focused item.
        if (key.return) {
            if (!selected.focused) items[selected.id].action(selected.id);
            setSelected( { id: selected.id, focused: !selected.focused } );
        }
    });

    // Instead of assigning items to a row, why not map item indexes to a row.
    // Doing this, all logic related to determining which Item is currently selected will be simpler and we won't have to keep track of the row.

    const rowItems: Item[] = [
        { label: 'test1', element: <Text>Test1</Text>, action: (id) =>  console.log(id) },
        { label: 'test2', element: <Text>Test2</Text>, action: (id) =>  console.log(id) },
        { label: 'test3', element: <Text>Test3</Text>, action: (id) =>  console.log(id) },
        { label: 'test4', element: <Text>Test4</Text>, action: (id) =>  console.log(id) },
        { label: 'test5', element: <Text>Test5</Text>, action: (id) =>  console.log(id) }
    ];

    const rowMapping = [
        { row: 0, items: [0, 1, 2] },
        { row: 1, items: [3, 4, 5] },
        { row: 2, items: [6, 7, 8] },
    ];

    // Each row will be an array. The array will then me mapped on render. See above.

    const mapRows = () => {
        const mapped = [];
        items.forEach((item, i) => {
            const row = [];
            if (i%3 === 0) {
                for (let j = i; j < i+3; j++) {
                    row.push(
                        <Box key={i}
                            borderStyle='round'
                            borderColor={selected.id === i ? 'yellow' : 'white'}
                            width={ selected.focused ? '100%' : 21}
                            display={ selected.focused && selected.id !== i ? 'none' : 'flex' }
                            >
                            { selected.focused && selected.id === i ? item.element : <Text>{item.label}</Text> }
                        </Box>
                    )
                }
            }
            mapped.push(row);
        });
        return mapped;
    }

    return (
        <Box borderStyle="round"
             borderColor={isFocused ? 'red' : 'white'}
             width={64}
             justifyContent='center'
             flexBasis={3}
            //  height={32}
             > 
            { items.map((item: Item, i) => {
                return (
                        <Box key={i}
                            borderStyle='round'
                            borderColor={selected.id === i ? 'yellow' : 'white'}
                            width={ selected.focused ? '100%' : 21}
                            display={ selected.focused && selected.id !== i ? 'none' : 'flex' }
                            >
                            { selected.focused && selected.id === i ? item.element : <Text>{item.label}</Text> }
                        </Box>
                    )
                })
            }
        </Box>
    )
}

export default MainMenu;

