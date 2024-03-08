import { logger, fileAsyncTransport } from "react-native-logs";
import RNFS from "react-native-fs";

export default class LogWriter {

    constructor() {
        let today = new Date();
        let date = today.getDate();
        let month = today.getMonth() + 1;
        let year = today.getFullYear();

        this.config = {
            severity:"debug",
            transport: fileAsyncTransport,
            transportOptions: {
              FS: RNFS,
              filePath:RNFS.DownloadDirectoryPath,
              /* EXPO:
               * FS: FileSystem,
               */
              fileName: `log_${year}_${month}_${date}.txt`, // Create a new file every day
            },
        }
    } 

    writeLog(str) {
        let log = logger.createLogger(this.config);

        let today = new Date();
        let date = today.getDate();
        let month = today.getMonth() + 1;
        let year = today.getFullYear();
        
        log.debug(`${today}>>>`,str);

    }
}

