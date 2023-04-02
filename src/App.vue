<template>
  <router-view />
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: $color-bg;
}

#app {
  font-family: 'Roboto', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $color-text-secondary;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

input:focus-visible {
  outline-offset: 0px;
}

input,
select,
a {
  border: none;
  text-decoration: none;
  background-color: transparent;
  color: $color-text-hint;
}

:focus-visible {
  outline-width: 0;
}

button {
  border: none;
  cursor: pointer;
  &:focus {
    outline: none;
  }
}

ul {
  list-style-type: none;
}
</style>
