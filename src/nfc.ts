import { ref } from "vue";

export const nfc = ref(false)
export const nfcPermissionState = ref("")
export const nfcLog = ref('')

export const requestNfcPermission = async () => {
  //@ts-ignore
  const permissions = await navigator.permissions.query({ name: "nfc" })
  nfcPermissionState.value = permissions.state
}

export const broadcastNfcMessage = async () => {
  console.log("User clicked write button");
  // await requestNfcPermission()
  nfcLog.value += "User clicked write button"
  try {
    const ndef = new NDEFReader();
    await ndef.write("Hello world!");
    console.log("> Message written");
    nfcLog.value += ('message writter')
  } catch (error) {
    console.log("Argh! " + error);
    nfcLog.value += String(error)
  }
}

// export const broadcastNfcMessage = async (moneroUri: string) => {
//     //@ts-ignore
//     if (nfcPermissionState.value === "granted") {
//         // NFC access was previously granted, so we can start NFC scanning now
//         if ("NDEFReader" in window) {
//             console.log('nfc supported')
//             nfc.value = true
//             const ndef = new NDEFReader();
//             try {
//                 await ndef.write({
//                     records: [
//                         {
//                             recordType: "url",
//                             data: moneroUri
//                         },
//                     ]
//                 })
//             } catch (error) {
//                 console.log(error);
//             }
//         } else {
//             nfc.value = false

//             console.log("Web NFC is not supported.");
//         }
//     }
// }


