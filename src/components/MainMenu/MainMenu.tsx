import React, { Children, createContext, FC, ReactElement, ReactNode, useState } from "react";
import { Box, Text, useFocus, useFocusManager, useInput } from 'ink';

export type Item = {
    label: string, // The label for the item.
    element: ReactElement, // The actual element to display when the item is selected.
    action?: (id: number) => void, // An optional function to call when the item is selected.
}

const MainMenu: FC<{ items: Item[], children?: any }> = ({ items, children }) => {
    const [ selected, setSelected ] = useState({ id: 0, focused: false, childrenSelected: false });
    const { isFocused } = useFocus({ id: 'main-menu' })
    const { focus, focusNext, focusPrevious } = useFocusManager();

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
            setSelected({ id: selected.id - 3, focused: false, childrenSelected: false, });
        }

        // Go down to the item below the current item.
        if (key.downArrow) {
            if (selected.id + 3 >= items.length || selected.focused) return;
            setSelected({ id: selected.id + 3, focused: false, childrenSelected: false, });
        }

        // Go to the previous item
        if (key.leftArrow) {
            if (selected.id === 0 || selected.focused) return;
            setSelected({ id: selected.id-1, focused: false, childrenSelected: false, });
        }

        // Go to the next item
        if (key.rightArrow) {
            if (selected.id === items.length-1 || selected.focused) return;
            setSelected({ id: selected.id+1, focused: false, childrenSelected: false, });
        }

        // Leave the focused item
        if (key.escape && selected.focused) {
            setSelected( { id: selected.id, focused: false, childrenSelected: false, } );
            // Sometimes this component gets unfocused when pressing escape. That's what this is for.
            focus('main-menu');
        }

        // Enter/leave the focused item.
        if (key.return && !selected.focused) {
            items[selected.id].action(selected.id);
            setSelected( { id: selected.id, focused: !selected.focused, childrenSelected: false } );
        }
    });

    // TODO: refactor. This is jank
    const mapRows = (items) => {
        const mapped = [];
        for (let i = 0; i < items.length; i+=3) {
            const row = [];
            for (let j = i; j < i+3; j++) {
                if (items[j] === undefined) continue;
                row.push(
                    <Box key={`box-${j}`}
                         borderStyle='round'
                         borderColor={selected.id === j && isFocused ? 'yellow' : 'white'}
                         width={ selected.focused ? '100%' : 21}
                         display={ selected.focused && selected.id !== j ? 'none' : 'flex' }
                         flexDirection='row'
                        >
                        { selected.focused && selected.id === j ? items[j].element : <Text>{`${items[j].label}`}</Text> }
                    </Box>
                );
            }
            mapped.push(
                <Box width='100%'
                     key={`row-${i}`} 
                     justifyContent='center'
                     >
                    {row}
                </Box>
            );
        }
        return mapped;
    }

    return (
        <Box width='100%' flexDirection="column">
            {/* Children components (aka stuff you do not want inside the button rows) */}
            <Box flexDirection='column'>
                { children }
            </Box>

            {/* mapped items */}
            <Box // borderStyle="round"
                //  borderColor={isFocused ? 'red' : 'white'}
                width={64}
                flexDirection="column"
                > 
                { mapRows(items) }
            </Box>
        </Box>
    )
}

export default MainMenu;

