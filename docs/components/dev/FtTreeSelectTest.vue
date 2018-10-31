<template>
  <div>
    <FishTankTreeSelect
      :options="options"
      :max-height="null"
      :hide-control="false"
      :dropdownpopover="false"
      :multiple="true"
      :is-mobile="true"
      :collapse-menu-padding="true"
      :value-consists-of="valueConsistsOf"
      :disable-fuzzy-matching="true"
      :sort-value-by="sortValueBy"
      v-model="value" />
  </div>
</template>

<script>
  /*eslint-disable*/
  import blawData from '../data/blaw-test-data'
  /*eslint-enable*/
  import bgovCommittee from '../data/bgov-committee-search'

  export default {
    data() {
      return {
        value: [ ],
        options: bgovCommittee,
        sortValueBy: 'INDEX',
        valueConsistsOf: 'ALL',
      }
    },
    methods: {
      popEl(index) {
        this.value.splice(index, 1)
      },
    },
  }
</script>
