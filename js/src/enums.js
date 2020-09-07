/**
 * Enum for the transput type of sockets (in or out)
 * @readonly
 * @enum {number}
 */
const TransputType = {
    NONE: -1,
    /** Input socket */
    INPUT: 0,
    /** Output socket */
    OUTPUT: 1,
};

const SocketColors = {
    NONE: "#EBDED4",
    MINION: "#e82117",
    INTEGER: "#1d09f6",
    FLOAT: "#1acb24",
};

export { TransputType, SocketColors };
