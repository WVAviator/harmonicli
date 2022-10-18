import { useState } from "react";
import ConfigUtils, { Config } from "../utils/ConfigUtility";

const useConfig = () => {
    const config: Config = ConfigUtils.getConfig();
    const [ options, setOptions ] = useState(config);

    // TODO: Update state on config update.

}

export default useConfig;