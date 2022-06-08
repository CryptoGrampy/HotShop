import { ref } from "vue";
import { nfc } from './main'
export const nfcPermissionState = ref("")
export const nfcLog = ref('')

export const requestNfcPermission = async () => {
  try {
    //@ts-ignore
    const permissions = await navigator.permissions.query({ name: "nfc" })
    nfcPermissionState.value = permissions.state
  } catch (error) {
    nfcLog.value += String(`Cant add permission ${error}`)
  }
}

export const broadcastNfcMessage = async (moneroUri: string) => {
  if (nfc) {
    console.log("User clicked write button");
    await requestNfcPermission()
    nfcLog.value += "User clicked write button"
    try {
      await nfc.write({
        records: [
          {
            recordType: "URL",
            data: moneroUri
          },
        ]
      }, {
        overwrite: true
      })
      console.log("> Message written");
      nfcLog.value += ('message writter')
    } catch (error) {
      console.log("Argh! " + error);
      nfcLog.value += String(error)
    }
  } else {
    nfcLog.value+='No NFC detected'
  }
}
