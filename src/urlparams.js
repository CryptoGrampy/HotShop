export default {
    get(param) {
        const urlParams = new URLSearchParams(window.location.search)
        if (urlParams.has(param)) {
            return urlParams.get(param)
        }
        return null
    },

    set(param, value) {
        const urlParams = new URLSearchParams(window.location.search)
        urlParams.set(param, value)
        history.replaceState(null, "", "?"+urlParams.toString()+window.location.hash)
    },

    getRestoreHeight() {
        const restoreHeight = this.get("h")
        if (restoreHeight == null) {
            return null
        }
        return parseInt(restoreHeight)
    },

    setRestoreHeight(restoreHeight) {
        this.set("h", restoreHeight)
    },

    getNetworkType() {
        const networkType = this.get("n")
        if (networkType == null) {
            return null
        }
        return parseInt(networkType)
    },
}
