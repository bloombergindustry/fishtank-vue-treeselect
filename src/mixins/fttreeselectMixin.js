export default {
  provide() {
    return {
      props: {
        maxHeight: {
          type: [ Number, null ],
          default: 300,
        },
      },
    }
  },
}
