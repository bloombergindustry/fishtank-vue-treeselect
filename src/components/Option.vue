<script>
  import {
    CheckboxSelectedO24 as CheckboxSelectedOpen,
    CheckboxUnselected24 as CheckboxUnselected,
    CheckboxSelected24 as CheckboxSelected,
    CheckboxPartial24 as CheckboxSelectedPartial,
    CaretDown24 as ArrowIcon,
  } from '@fishtank/icons-vue'
  import { UNCHECKED, INDETERMINATE, CHECKED } from '../constants'
  import { onLeftClick } from '../utils'
  import Tip from './Tip'
  // import ArrowIcon from './icons/Arrow'

  let arrowPlaceholder, checkMark
  // minusMark, openMark

  const Option = {
    name: 'vue-treeselect--option',
    inject: [ 'instance' ],

    props: {
      node: {
        type: Object,
        required: true,
      },
    },

    computed: {
      shouldExpand() {
        const { instance, node } = this

        return node.isBranch && instance.shouldExpand(node)
      },
    },

    methods: {
      renderOption() {
        const { instance, node } = this
        const optionClass = {
          'vue-treeselect__option': true,
          'vue-treeselect__option--disabled': node.isDisabled,
          'vue-treeselect__option--selected': instance.isSelected(node),
          'vue-treeselect__option--highlight': node.isHighlighted,
          'vue-treeselect__option--matched': instance.localSearch.active && node.isMatched,
          'vue-treeselect__option--hide': !instance.shouldShowOptionInMenu(node),
        }

        if (instance.disableAncestorsOnSearch && instance.localSearch.active && !node.isMatched) {
          return null
        }

        return (
          <div class={optionClass} onMouseenter={this.handleMouseEnterOption} data-id={node.id}>
            {this.renderArrow()}
            {this.renderLabelContainer([
              this.renderCheckboxContainer([
                this.renderCheckbox(),
              ]),
              this.renderLabel(),
            ])}
          </div>
        )
      },

      renderSubOptionsList() {
        if (!this.shouldExpand) return null

        return (
          <div class="vue-treeselect__list">
            {this.renderSubOptions()}
            {this.renderNoChildrenTip()}
            {this.renderLoadingChildrenTip()}
            {this.renderLoadingChildrenErrorTip()}
          </div>
        )
      },

      renderArrow() {
        const { instance, node } = this

        if (node.isBranch) {
          const transitionProps = {
            props: {
              name: 'vue-treeselect__option-arrow--prepare',
              appear: true,
            },
          }
          const arrowClass = {
            'vue-treeselect__option-arrow': true,
            'vue-treeselect__option-arrow--rotated': this.shouldExpand,
          }

          return (
            <div class="vue-treeselect__option-arrow-container" onMousedown={this.handleMouseDownOnArrow}>
              <transition {...transitionProps}>
                <ArrowIcon class={arrowClass} />
              </transition>
            </div>
          )
        }

        // For leaf nodes, we render a placeholder to keep its label aligned to
        // branch nodes. Unless there is no branch nodes at all (a normal
        // non-tree select).
        if (/*node.isLeaf && */instance.hasBranchNodes) {
          if (!arrowPlaceholder) arrowPlaceholder = (
            <div class="vue-treeselect__option-arrow-placeholder">&nbsp;</div>
          )

          return arrowPlaceholder
        }

        return null
      },

      renderLabelContainer(children) {
        return (
          <div class="vue-treeselect__label-container" onMousedown={this.handleMouseDownOnLabelContainer}>
            {children}
          </div>
        )
      },

      renderCheckboxContainer(children) {
        const { instance, node } = this

        if (instance.single) return null
        if (instance.disableBranchNodes && node.isBranch) return null

        return (
          <div class="vue-treeselect__checkbox-container">
            {children}
          </div>
        )
      },

      renderCheckbox() {
        const { instance, node } = this
        let hasChildren = false
        let allVisibleIsSelected = []
        const selectedNodeIds = []

        instance.selectedNodes.forEach(sNode => {
          selectedNodeIds.push(sNode.id)
        })
        allVisibleIsSelected = instance.visibleOptionIds.filter(vOp => {
          return !selectedNodeIds.includes(vOp)
        })

        if (node.children !== undefined) hasChildren = true
        const checkedState = instance.forest.checkedStateMap[node.id]

        const parentNodeCheckedState = node.parentNode !== null ? instance.forest.checkedStateMap[node.parentNode.id] : 0

        const checkboxClass = {
          'vue-treeselect__checkbox': true,
          'vue-treeselect__checkbox--checked': checkedState === CHECKED,
          'vue-treeselect__checkbox--indeterminate': checkedState === INDETERMINATE,
          'vue-treeselect__checkbox--unchecked': checkedState === UNCHECKED,
          'vue-treeselect__checkbox--disabled': node.isDisabled,
        }
        if (node.level === 0) {
          if (checkedState === 2) checkMark = (
            <span class="vue-treeselect__check-mark"><CheckboxSelected/></span>
          )
          if (checkedState === 1) checkMark = (
            <span class="vue-treeselect__minus-mark"><CheckboxSelectedPartial/></span>
          )
          if (checkedState === 0) checkMark = (
            <span class="vue-treeselect__check-mark__unselected"><CheckboxUnselected/></span>
          )
        } else {
          if (allVisibleIsSelected.length > 0) {
            if (checkedState === 2 && hasChildren) checkMark = (
              <span class="vue-treeselect__check-mark"><CheckboxSelected/></span>
            )
            if (checkedState === 2 && !hasChildren && parentNodeCheckedState === 2) checkMark = (
              <span class="vue-treeselect__check-mark"><CheckboxSelectedOpen/></span>
            )
            if (checkedState === 2 && !hasChildren && parentNodeCheckedState === 1) checkMark = (
              <span class="vue-treeselect__check-mark"><CheckboxSelected/></span>
            )
            if (checkedState === 1) checkMark = (
              <span class="vue-treeselect__minus-mark"><CheckboxSelectedPartial/></span>
            )
            if (checkedState === 0) checkMark = (
              <span class="vue-treeselect__check-mark__unselected"><CheckboxUnselected/></span>
            )
          } else {
            if (checkedState === 2 && hasChildren) checkMark = (
              <span class="vue-treeselect__check-mark"><CheckboxSelectedOpen/></span>
            )
            if (checkedState === 2 && !hasChildren) checkMark = (
              <span class="vue-treeselect__check-mark"><CheckboxSelectedOpen/></span>
            )
            if (checkedState === 1) checkMark = (
              <span class="vue-treeselect__minus-mark"><CheckboxSelectedPartial/></span>
            )
            if (checkedState === 0) checkMark = (
              <span class="vue-treeselect__check-mark__unselected"><CheckboxUnselected/></span>
            )
          }
          ///
          // if (checkedState === 1) checkMark = (
          //   <span class="vue-treeselect__minus-mark"><CheckboxSelectedPartial/></span>
          // )
          // if (checkedState === 0) checkMark = (
          //   <span class="vue-treeselect__check-mark__unselected"><CheckboxUnselected/></span>
          // )
        }

        return (
          <span class={checkboxClass}>
            {checkMark}
          </span>
        )
      },

      renderLabel() {
        const { instance, node } = this
        const shouldShowCount = (
          node.isBranch && (instance.localSearch.active
            ? instance.showCountOnSearchComputed
            : instance.showCount
          )
        )
        const count = shouldShowCount
          ? instance.localSearch.active
            ? instance.localSearch.countMap[node.id][instance.showCountOf]
            : node.count[instance.showCountOf]
          : NaN
        const labelClassName = 'vue-treeselect__label'
        const countClassName = 'vue-treeselect__count'
        const customLabelRenderer = instance.$scopedSlots['option-label']

        if (customLabelRenderer) return customLabelRenderer({
          node,
          shouldShowCount,
          count,
          labelClassName,
          countClassName,
        })

        return (
          <label class={labelClassName} id={node.id ? node.id : null}>
            {node.label}
            {shouldShowCount && (
              <span class={countClassName}>({count})</span>
            )}
          </label>
        )
      },

      renderSubOptions() {
        const { node } = this

        if (!node.childrenStates.isLoaded) return null

        return node.children.map(childNode => (
          <Option node={childNode} key={childNode.id} />
        ))
      },

      renderNoChildrenTip() {
        const { instance, node } = this

        if (!node.childrenStates.isLoaded || node.children.length) return null

        return (
          <Tip type="no-children" icon="warning">{ instance.noChildrenText }</Tip>
        )
      },

      renderLoadingChildrenTip() {
        const { instance, node } = this

        if (!node.childrenStates.isLoading) return null

        return (
          <Tip type="loading" icon="loader">{ instance.loadingText }</Tip>
        )
      },

      renderLoadingChildrenErrorTip() {
        const { instance, node } = this

        if (!node.childrenStates.loadingError) return null

        return (
          <Tip type="error" icon="error">
            { node.childrenStates.loadingError }
            <a class="vue-treeselect__retry" title={instance.retryTitle} onMousedown={this.handleMouseDownOnRetry}>
              { instance.retryText }
            </a>
          </Tip>
        )
      },

      handleMouseEnterOption(evt) {
        const { instance, node } = this

        // Equivalent to `self` modifier.
        // istanbul ignore next
        if (evt.target !== evt.currentTarget) return

        instance.setCurrentHighlightedOption(node, false)
      },

      handleMouseDownOnArrow: onLeftClick(function handleMouseDownOnOptionArrow() {
        const { instance, node } = this

        instance.toggleExpanded(node)
      }),

      handleMouseDownOnLabelContainer: onLeftClick(function handleMouseDownOnLabelContainer() {
        const { instance, node } = this

        if (node.isBranch && instance.disableBranchNodes) {
          instance.toggleExpanded(node)
        } else {
          instance.select(node)
        }
      }),

      handleMouseDownOnRetry: onLeftClick(function handleMouseDownOnRetry() {
        const { instance, node } = this

        instance.loadChildrenOptions(node)
      }),
    },

    render() {
      const { node } = this
      const transitionProps = {
        props: {
          name: 'vue-treeselect__list--transition',
        },
      }

      return (
        <div class={`vue-treeselect__list-item vue-treeselect__indent-level-${node.level}`}>
          {this.renderOption()}
          <transition {...transitionProps}>
            {this.renderSubOptionsList()}
          </transition>
        </div>
      )
    },
  }

  export default Option
</script>
