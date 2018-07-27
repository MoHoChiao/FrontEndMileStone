<template>
  <div v-if="pageCount > 1">
    <div class="w3-row-padding">
      <div class="w3-col m1">
        <a @click="prevPage" @keyup.enter="prevPage" 
            :class="[prevLinkClass, 'w3-left', firstPageSelected()]" 
            tabindex="0">
                <i class="fa fa-arrow-left" title="pre page" aria-hidden="true"></i>
        </a>
      </div>
      <div class="w3-col m10 w3-center">
        <template v-for="page in pages">
          <a @click="handlePageSelected($event, page.index)" @keyup.enter="handlePageSelected($event, page.index)" 
                :class="[pageLinkClass, page.selected ? activeClass : '']" 
                tabindex="0">
                {{ page.content }}
          </a>
        </template>
      </div>
      <div class="w3-col m1">
        <a @click="nextPage" @keyup.enter="nextPage" 
            :class="[nextLinkClass, 'w3-right', lastPageSelected()]" 
            tabindex="0">
                <i class="fa fa-arrow-right" title="next page" aria-hidden="true"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pageCount: {
      type: Number,
      required: true
    },
    initialPage: {
      type: Number,
      default: 0
    },
    forcePage: {
      type: Number
    },
    clickHandler: {
      type: Function,
      default: () => { }
    },
    pageRange: {
      type: Number,
      default: 6
    },
    marginPages: {
      type: Number,
      default: 1
    },
    containerClass: {
      type: String,
      default: 'w3-row'
    },
    pageLinkClass: {
      type: String,
      default: 'w3-bar-item w3-button w3-round-small'
    },
    prevLinkClass: {
      type: String,
      default: 'w3-bar-item w3-button w3-hover-none'
    },
    nextLinkClass: {
      type: String,
      default: 'w3-bar-item w3-button w3-hover-none'
    },
    activeClass: {
      type: String,
      default: 'w3-blue-grey'
    }
  },
  data() {
    return {
      selected: this.initialPage
    }
  },
  beforeUpdate() {
    if (this.forcePage === undefined) return
    if (this.forcePage !== this.selected) {
      this.selected = this.forcePage
    }
  },
  computed: {
    pages: function () {
      let items = {}
      if (this.pageCount <= this.pageRange) {
        for (let index = 0; index < this.pageCount; index++) {
          let page = {
            index: index,
            content: index + 1,
            selected: index === this.selected
          }
          items[index] = page
        }
      } else {
        let leftPart = this.pageRange / 2
        let rightPart = this.pageRange - leftPart

        if (this.selected < leftPart) {
          leftPart = this.selected
          rightPart = this.pageRange - leftPart
        } else if (this.selected > this.pageCount - this.pageRange / 2) {
          rightPart = this.pageCount - this.selected
          leftPart = this.pageRange - rightPart
        }

        let setPageItem = index => {
          let page = {
            index: index,
            content: index + 1,
            selected: index === this.selected
          }

          items[index] = page
        }

        let setBreakView = index => {
          let breakView = {
            content: '...',
            disabled: true
          }

          items[index] = breakView
        }

        // 1st - loop thru low end of margin pages
        for (let i = 0; i < this.marginPages; i++) {
          setPageItem(i);
        }

        // 2nd - loop thru selected range
        let selectedRangeLow = 0;
        if (this.selected - this.pageRange > 0) {
          selectedRangeLow = this.selected - this.pageRange;
        }

        // 3rd - loop thru high end of margin pages
        let selectedRangeHigh = this.pageCount;
        if (this.selected + this.pageRange < this.pageCount) {
          selectedRangeHigh = this.selected + this.pageRange;
        }

        for (let i = selectedRangeLow; i <= selectedRangeHigh && i <= this.pageCount - 1; i++) {
          setPageItem(i);
        }

        // Check if there is breakView in the left of selected range
        if (selectedRangeLow > this.marginPages) {
          setBreakView(selectedRangeLow - 1)
        }

        // Check if there is breakView in the right of selected range
        if (selectedRangeHigh + 1 < this.pageCount - this.marginPages) {
          setBreakView(selectedRangeHigh + 1)
        }
        // 2nd - loop thru high end of margin pages
        for (let i = this.pageCount - 1; i >= this.pageCount - this.marginPages; i--) {
          setPageItem(i);
        }
      }
      return items
    }
  },
  methods: {
    handlePageSelected(e, selected) {
      if (this.selected === selected) return

      this.selected = selected

      this.clickHandler(e, this.selected + 1)
    },
    prevPage(e) {
      if (this.selected <= 0) return

      this.selected--

      this.clickHandler(e, this.selected + 1)
    },
    nextPage(e) {
      if (this.selected >= this.pageCount - 1) return

      this.selected++

      this.clickHandler(e, this.selected + 1)
    },
    firstPageSelected() {
      if(this.selected === 0)
        return 'w3-disabled'
      else 
        return ''
    },
    lastPageSelected() {
      if((this.selected === this.pageCount - 1) || (this.pageCount === 0))
        return 'w3-disabled'
      else
        return ''
    }
  }
}
</script>
<style scoped>
    a {
        margin-bottom: 0px;
        padding: 6px 6px 6px 6px;
    }
</style>