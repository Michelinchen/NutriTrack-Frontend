<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const { isAuthenticated, user, loginWithRedirect, logout: auth0Logout, isLoading } = useAuth0()
const login = () => loginWithRedirect()
const doLogout = () => auth0Logout({ logoutParams: {returnTo: window.location.origin} })

</script>

<template>
  <header class="navbar navbar-expand navbar-dark bg-success px-3">
    <span class="navbar-brand mb-0 h1">🥗 NutriTrack</span>
    <div class="navbar-nav me-auto">
      <RouterLink to="/" class="nav-link">Home</RouterLink>
    </div>
    <div class="d-flex align-items-center">
      <span v-if="isLoading" class="text-white me-2">Lade...</span>
      <template v-else-if="isAuthenticated && user">
        <span class="me-3 text-white">{{ user.email }}</span>
        <button @click="doLogout" class="btn btn-light btn-sm">Logout</button>
      </template>
      <button v-else @click="login" class="btn btn-light btn-sm">Login</button>
    </div>
  </header>

  <main class="container my-4">
    <div v-if="isAuthenticated">
      <RouterView />
    </div>
    <div v-else class="alert alert-info">
      Bitte einloggen, um deine Mahlzeiten zu sehen.
    </div>
  </main>
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
