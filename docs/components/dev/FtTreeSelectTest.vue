<template>
  <div>
    <treeselect
      :options="options"
      :max-height="null"
      :hide-control="true"
      :dropdownpopover="false"
      :multiple="true"
      :collapse-menu-padding="true"
      v-model="value" />
  </div>
</template>

<script>
  import blawData from '../data/blaw-test-data'

  export default {
    data() {
      return {
        value: [ ],
        options: blawData,
      }
    },
  }
</script>
