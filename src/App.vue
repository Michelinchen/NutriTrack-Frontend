<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const { isAuthenticated, user, loginWithRedirect, logout: auth0Logout, isLoading } = useAuth0()
const login = () => loginWithRedirect()
const doLogout = () => auth0Logout({ logoutParams: {returnTo: window.location.origin} })

</script>

<template>
  <header>
    <div v-if="isLoading">Lade...</div>

    <div v-else-if="isAuthenticated && user">
      <p>Logged in as {{ user.email }}</p>

      <h1>User Profile</h1>

      <button @click="doLogout">Logout</button>
    </div>

    <div v-else>
      <button @click="login">Login</button>
    </div>

    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
      </nav>
    </div>
  </header>

  <div v-if="isAuthenticated">
    <RouterView />
  </div>
  <div v-else>
    <p>Bitte einloggen, um deine Mahlzeiten zu sehen.</p>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}


nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
