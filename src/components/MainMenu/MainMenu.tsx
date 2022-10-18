import { Box, useFocus, useInput } from "ink";
import React, { useState } from "react";

const MainMenu = () => {
    const [ selected, setSelected ] = useState({});
    const { isFocused } = useFocus();

    // const selected = {
    //     name: string,
    //     hover: boolean, // Determines which component is in hover
    //     fullySelected: boolean, // Determines which component is fully selected
    // }

    useInput((_, key) => {
        if (!isFocused) return;

    });

    const view = () => {

    }

    return (
        <Box flexDirection="row">

        </Box>
    );
}