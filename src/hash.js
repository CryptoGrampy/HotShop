export default {
    get() {
        return window.location.hash.substring(1)
    },

    set(hash) {
        window.location.hash = hash
    }
}