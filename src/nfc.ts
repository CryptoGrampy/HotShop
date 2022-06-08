import { ref } from "vue";

export const nfc = ref(false)
export const nfcPermissionState = ref("")

export const requestNfcPermission = async () => {
    //@ts-ignore
    nfcPermissionState.value = await (await navigator.permissions.query({ name: "nfc" })).state
}

export const broadcastNfcMessage = async (moneroUri: string) => {
    //@ts-ignore
    if (nfcPermissionState.value === "granted") {
        // NFC access was previously granted, so we can start NFC scanning now
        if ("NDEFReader" in window) {
            console.log('nfc supported')
            nfc.value = true
            const ndef = new NDEFReader();
            try {
                await ndef.write({
                    records: [
                        {
                            recordType: "url",
                            data: moneroUri
                        },
                    ]
                })
            } catch (error) {
                console.log(error);
            }
        } else {
            nfc.value = false

            console.log("Web NFC is not supported.");
        }
    }
}
