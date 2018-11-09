export default {
  provide() {
    return {
      props: {
        maxHeight: {
          type: [ Number, null ],
          default: 300,
        },
        focusOnLoad: {
          type: Boolean,
          default: false,
        },
      },
    }
  },
}
