<script setup lang="ts">
import { Ref, ref } from "vue";
import HeaderComponent from "../components/HeaderComponent.vue";
import { CircleCheckFilled, CircleCloseFilled } from "@element-plus/icons-vue";

const node = ref("https://community.organic-meatballs.duckdns.org:443");
const nodeWorks: Ref<null | boolean> = ref(null);

const testNode = async () => {
  const response = await fetch(`${node.value}/json_rpc`, {
    headers: {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Content-type": "text/plain",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      Origin: "https://example.com:444",
      "Sec-Fetch-Site": "cross-site",
      "Sec-GPC": "1",
    },
    referrer: "https://sunny-malabi-a3b5ff.netlify.app/",
    body: '{"id":"0","jsonrpc":"2.0","method":"get_version"}',
    method: "POST",
    mode: "cors",
  }).catch((err) => {
    console.log("error!", err);
    nodeWorks.value = false;
  });

  if (response) {
    if ((await response.json()).result.status === "OK") {
      nodeWorks.value = true;
    }
  }
};
</script>

<template>
  <HeaderComponent />
  <h3>Node Compatibility Checker</h3>
  <p>
    HotShop, along with other browser-based Monero webapps that communicate
    directly with public Monero nodes can't use just *any* public node. Webapps
    require a couple specific Monerod configuration options to be set to
    communicate properly and without errors.
  </p>
  <p>The public node must:</p>
  <ol>
    <li>
      Be HTTPS with a valid certificate or a Tor Hidden Service (.onion). HTTP
      nodes will not work.
    </li>
    <li>
      Have this flag set in the Monerod config:
      <code>--rpc-access-control-origins=*</code>
    </li>
  </ol>
  <el-row justify="center">
    <el-input v-model="node" placeholder="ex. https://mynode.com:18081">
      <template #append>
        <el-button @click="testNode">Test</el-button>
      </template>
    </el-input>
  </el-row>
  <el-row>
    <div v-if="nodeWorks !== null">
      <p v-if="nodeWorks">
        <el-icon>
          <CircleCheckFilled />
        </el-icon>
        This node is Browser Compatible!
      </p>
      <p v-if="!nodeWorks">
        <el-icon>
          <CircleCloseFilled />
        </el-icon>
        This node is NOT browser compatible. Please review the node config
        instructions above.
      </p>
    </div>
  </el-row>
</template>

<style></style>
