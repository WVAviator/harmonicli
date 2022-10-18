import React, { useState } from "react";
import { Box, useFocus, useFocusManager } from 'ink';
import ConfigUtils, { Config } from "../../utils/ConfigUtility";

const Options = () => {
    const config = ConfigUtils.getConfig();
    const { isFocused } = useFocus();
    const { focusNext, focusPrevious } = useFocusManager();
    
    // Will re-write this a little later.
    const [ menuOptions, setMenuOptions ] = useState(Object.keys(config).map(item => { return { label: item, value: () => subMenuOptions(config[item]) } }));

    // const defaultConfig: Config = {
    //     'colors': {
    //       textColor: 'white',
    //       focusColor: 'yellow',
    //       unfocusedColor: 'white',
    //       gradient: 'summer',
    //     },
    //     'defaultPlayer': 'YTMusic',
    //   }
    
    const subMenuOptions = (item) => {
        setMenuOptions(Object.entries(item).map(item => { return { label: item[0], value: () => console.log(item[1]) } }));
    }


    return (
        <Box>

        </Box>
    );
}