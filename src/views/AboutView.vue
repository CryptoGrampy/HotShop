<script setup lang="ts">
import HeaderComponent from "@/components/HeaderComponent.vue";
import QrCode from "@/components/QrCode.vue";
</script>
<template>
  <HeaderComponent />
  <el-row>
    <h3>About</h3>
  </el-row>

  <h4>What is HotShop</h4>
  <p>
    HotShop is an ephemeral, browser-based Monero point of sale. Accept and
    Validate Monero payments using a bookmarkable, sharable web URL without
    having to download any apps or browser extensions, without losing your
    privacy and without putting your private spend keys in danger.
  </p>
  <h4>Warnings:</h4>
  <p>
    HotShop is in alpha state. Only use with tiny amounts and test wallets for
    now. Always use at your own risk; I am writing this software as a service to
    the Monero community but I will *never* be responsible for your loss of
    income, HotShop bugs, issues receiving payment, and I will *never* provide
    24/7 urgent support. If you need that, you are welcome to hire a developer
    to provide bug fixes that I will happily review and merge.
  </p>
  <h4>Dangers of 0Conf transactions</h4>
  <p>
    0 Confirmation transactions are essentially instant payments on the Monero
    network. They are transactions that are in the mempool that your Monero node
    detects, but they haven't yet been mined into a block.
  </p>

  <p>
    The danger in using them, is that a nefarious customer who knows which
    public Monero node you're using can broadcast a transaction directly to your
    HotShop Point of Sale's Monero node, but also broadcast the very same
    transaction (but to a different recipient... i.e. themselves) to 1000 other
    nodes in the network. Your HotShop will think payment occurred, but the rest
    of the network will think your customer paid to someone else. You will not
    get your money and your nefarious customer could walk out of your store with
    a free item.
  </p>
  <p>
    For 20$ in-person USD transactions, this is probably not a big deal. But if
    you do want to truly safely accept larger 0conf tx's, you should Ideally use
    your own private web-compatible Monero node- perhaps on your HotShop's local
    network or on the same device HotShop is running on, that no one else can
    access remotely. Otherwise, you can simply bump up the confirmations
    according to your need (note that this will take much longer for payments to
    process)
  </p>
  <h4>How do I use it?</h4>
  <ol>
    <li>
      Open the generic <a href="https://hotshop.onrender.com">HotShop link.</a>
    </li>
    <li>Navigate to the settings page on the top right</li>
    <li>
      Customize the shop using the settings- changing the Primary and View
      Address to your own is *mandatory*.
    </li>
    <li>Tap the 'Save Settings' button.</li>
    <li>
      Bookmark the Admin and Kiosk URLs at the top of the settings page- these
      are how you can return to your custom HotShop settings.
    </li>
    <li>
      The Kiosk link should be used in a customer facing setting- it prevents
      them from accessing your settings page.
    </li>
    <li>
      If you ever update your settings again, you'll need to re-bookmark your
      Admin and Kiosk URL's
    </li>
    <li>That's it!</li>
  </ol>
  <h4>Why do I need this?</h4>
  <ul>
    <li>
      - The physical Point of Sale situation is very lacking in Monero; they all
      require either you to run a backend server or to provide your view key to
      someone else's server (Note- your view key in HotShop NEVER gets sent to
      *any* servers)
    </li>
    <li>- No existing wallets have good Point of Sale tech or UI.</li>
    <li>
      - Your wife is at a garage sale and needs to accept and validate payments
      for you - just send her your custom HotShop link and she can begin
      collecting Moneroj FOR YOU. You could share your HotShop link to all of
      the servers at your restaurant as well.
    </li>
    <li>
      - Most Point of Sale solutions require you to self-host something like
      BTCPayServer on a server you need to maintain.
    </li>

    <li>
      - Perhaps you're in a situation where you can't have a wallet app on your
      phone/desktop but want to easily receive and VALIDATE a payment
    </li>

    <li>
      - Perhaps you're in a situation where you want to be able to accept
      payments, but are worried about someone stealing your device or - spend
      key wallet
    </li>
    <li>
      - An ephemeral point of sale that sort of lives on a QR code or bookmark
      in your phone sounds really cool
    </li>
    <li>
      - Maybe your mobile wallet is 1000000 blocks behind and want to
      IMMEDIATELY accept and verify a payment - HotShop loads quite quickly and
      requires no sync time.
    </li>
    <li>
      - Don't you want to make 100% sure your buddy at the bar actually sent
      those funds? It's better than a static payment address.
    </li>
  </ul>
  <h4>What technology powers this? How does it work?</h4>
  <p>
    HotShop is a dumb static site made of html, css, javascript and webassembly
    files that can be hosted on nearly any (free) static hosting provider
    (Github Pages, Netlify, etc); there are no servers involved outside of a
    public Monero node that provides your HotShop with latest blockchain data
    and the static site host.
  </p>

  <p>
    You don't need to host your own HotShop, either. The site itself is dumb and
    anyone can use the same HotShop site, but once downloaded to your browser,
    it applies your custom information via Hash Fragments- the secret sauce- and
    makes it your own custom experience.
  </p>

  <p>Rough Idea of what happens when you use HotShop:</p>
  <ol>
    <li>
      Your browser hits the HotShop website and downloads the static content
      (HTML, CSS, etc) and sends NOTHING to the website host outside of typical
      browser request information (browser info, ip address, etc- this is
      typical), however, your public key, view key and any custom settings of
      your HotShop do not get sent as part of ANY outgoing http reqeusts- they
      remain in your browser.
    </li>
    <li>
      Your browser renders the HotShop site for you locally, and then applies
      your custom settings, which are saved as Hash Fragments in the big scary
      looking URL.
    </li>
    <li>
      Using your custom settings, your browser creates a full Monero view wallet
      IN THE BROWSER (Thanks to @Woodser and the Monero-Javascript WASM wallet),
      using your Primary and View key that you've specified. These keys allow
      HotShop to generate fresh and unique payment addresses's as well as allow
      it to listen for and validate payments that happen at these generated
      addresses.
    </li>
    <li>
      Your browser then makes a direct connection to whatever Web-Compatible
      Monero node you've specified as the provider of the blockchain data for
      your HotShop. HotShop doesn't disclose any of your wallet information to
      Monero nodes, however the nodes do know the ip of the machine trying to
      connect; use your own node.
    </li>
    <li>
      At this point HotShop should be loaded. You can type in a value, Press
      Request, and HotShop begins listening for payments that happen.
    </li>

    <li>
      If you make changes to HotShop settings, you need to resave your bookmark-
      rather than storing all of your private information in a server database
      somewhere, HotShop saves your custom user settings right in the URL using
      HashFragments:
      www.myhotshopsite.com/#primaryKey=4abcd&viewKey=awefaewf&shopName=GrampyShop
    </li>
  </ol>
  <h4>How do I use HotShop super privately?</h4>
  <ul>
    <li>
      Self-Host the HotShop static site on your own server, or better yet, serve
      the site on the same device that HotShop will run on.
    </li>
    <li>
      Use your own node that no one else has access to, ideally on the same
      device HotShop is running on.
    </li>
    <li>Run HotShop over Tor</li>
    <li>
      Turn off the exchange currency feature (this makes a periodic API request
      to CoinGecko)
    </li>
  </ul>

  <h4>What does HotShop NOT do??</h4>
  <p>Wow it sure sounds like HotShop can do anything, right?</p>
  <p>There are a couple big things that HotShop can't do:</p>

  <ul>
    <li>
      It's for in-person use only- it's not an e-commerce solution. Though you
      CAN use HotShop in an iFrame, you can't put this on your online
      electronics store and accept payment. It's just not going to work for that
      purpose. Don't try. You WILL need a more comprehensive solution for that
      (See: Woocommerce Monero extension, MoneroPay, BTCPayServer)
    </li>
    <li>
      No Payment History- HotShop is NOT going to keep track of payments that
      occurred before you load HotShop. I may add a way to list in-session
      successful payments down the road, but if you refresh the page, everything
      you did in the previous session will be gone. Part of the reason HotShop
      loads (somewhat) quickly is that it begins syncing at the latest Monero
      blockheight so that it can immediately begin accepting and watching for
      payments.
    </li>
    <li>
      It's not going to store your items for sale and their prices. HotShop is a
      simple interface to collect and verify payments. That's it. If you want to
      add in complex shop functionality that allows you to create a coffee-shop
      like experience with items, amounts, and shopping cart that can be used
      for in-person stuff, please feel free to fork and add that stuff in :)
    </li>
  </ul>
  <h4>Who made this thing?</h4>
  <p>
    HotShop was built by
    <u><a href="https://twitter.com/CryptoGrampy">CryptoGrampy</a></u>
  </p>
  <p>
    Donations (tap for address):
  </p>
  <el-row justify="center">
      <QrCode
      address="85AYtbBMpiu3DQUwejMeM4b9HSRuN6u8adAJTM2AfxKv3rwEnCg9HQtagZ6W2iaGK1gzPXVRpgGgg9dJtdLmgBP7VMDVKXe"
    />
  </el-row>
</template>

<style></style>
