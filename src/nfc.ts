import { ref } from "vue";
import { nfc } from './main'
export const nfcPermissionState = ref("")
export const nfcLog = ref('')

export const requestNfcPermission = async () => {
  try {
    //@ts-ignore
    const permissions = await navigator.permissions.query({ name: "nfc" })
    nfcPermissionState.value = permissions.state
  } catch(error) {
    nfcLog.value+=String(`Cant add permission ${error}`)
  }
}

export const broadcastNfcMessage = async (moneroUri: string) => {
  console.log("User clicked write button");
  await requestNfcPermission()
  nfcLog.value += "User clicked write button"
  try {
    await nfc.write({
      records: [
          {
              recordType: "url",
              data: moneroUri
          },
      ]
  })    
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


