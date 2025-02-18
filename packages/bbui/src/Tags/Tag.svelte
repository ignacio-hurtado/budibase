<script>
  import { createEventDispatcher } from 'svelte';

  import "@spectrum-css/tags/dist/index-vars.css"
  import Avatar from "../Avatar/Avatar.svelte"
  import ClearButton from "../ClearButton/ClearButton.svelte"

  const dispatch = createEventDispatcher();

  export let icon = ""
  export let avatar = ""
  export let invalid = false
  export let disabled = false
  export let closable = false

  function handleClose() {
    // Dispatch an event named "close" that parent components can listen for
    dispatch("close");

</script>

<div
  class:is-invalid={invalid}
  class:is-disabled={disabled}
  class="spectrum-Tags-item"
  role="listitem"
>
  {#if avatar}
    <Avatar url={avatar} />
  {/if}
  {#if icon}
    <svg
      class="spectrum-Icon spectrum-Icon--sizeS"
      focusable="false"
      aria-hidden="true"
      aria-label="Tag"
    >
      <use xlink:href="#spectrum-icon-24-{icon}" />
    </svg>
  {/if}
  <span class="spectrum-Tags-itemLabel"><slot /></span>
  {#if closable}
    <ClearButton
    icon="close"
    aria-label="Close"
    on:click={handleClose}
    />
  {/if}
</div>

<style>
  .spectrum-Tags-item {
    margin-bottom: 0;
    margin-top: 0;
  }
</style>
