<template>
  <div
    ref="messageListBox"
    :class="['message-list', 'messages-display', isScrolling ? 'scrolling' : 'still']"
    :style="{ height: `${height}px`, marginTop: `${marginTop}px` }"
  >
    <span v-show="showLoadingIcon" class="loading-icon"><i class="el-icon-loading"></i></span>
    <template>
      <DynamicScroller v-if="showMessages.length" :items="showMessages" :min-item-size="40" class="scroller">
        <template v-slot="{ item, active }">
          <DynamicScrollerItem :item="item" :active="active" :data-index="item.id">
            <MsgLeftItem v-if="!item.out" v-bind="item" @showmenu="handleShowContextMenu(arguments, item)" />
            <MsgRightItem v-else v-bind="item" @showmenu="handleShowContextMenu(arguments, item)" />
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </template>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import MsgRightItem from '@/components/MsgRightItem.vue'
import MsgLeftItem from '@/components/MsgLeftItem.vue'
import { DynamicScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { matchTopicMethod } from '@/utils/topicMatch'

@Component({
  components: {
    MsgRightItem,
    MsgLeftItem,
    DynamicScroller,
  },
})
export default class MessageList extends Vue {
  @Prop({ required: true }) messages!: MessageModel[]
  @Prop({ required: true }) height!: number
  @Prop({ required: true }) subscriptions!: SubscriptionModel[]
  @Prop({ required: true }) marginTop!: number
  @Prop({ required: true }) addNewMsg!: boolean

  public showMessages: MessageModel[] = []
  private scrollTop: number = -1
  private showLoadingIcon: boolean = false
  private onceAddMessagesMaxNum: number = 20
  private isScrolling = false
  private timeout: undefined | number = undefined

  @Watch('messages')
  private handleMessagesChanged(val: MessageModel[]) {
    if (val.length) {
      const allMessages = _.cloneDeep(val)
      const maxShowMessages =
        allMessages.length >= this.onceAddMessagesMaxNum ? allMessages.slice(-this.onceAddMessagesMaxNum) : allMessages
      const newMessages = this.getNewMessages(maxShowMessages, this.showMessages)

      // sentOneMessage or receivedOneMessage
      if (this.addNewMsg && newMessages.length === 1) {
        const newMessages = allMessages.slice(-1)
        this.showMessages = this.getMessageMatchColor(this.showMessages.concat(newMessages))
        return
      }
      this.showMessages = this.getMessageMatchColor(maxShowMessages)
    } else {
      this.showMessages = []
    }
  }

  @Watch('scrollTop')
  private handleScrollTopChanged(val: number) {
    if (val === 0) {
      const allMessages = _.cloneDeep(this.messages)
      const [...showMessages] = this.showMessages
      const newMessages = this.getNewMessages(allMessages, showMessages)
      const addMessages =
        newMessages.length >= this.onceAddMessagesMaxNum ? newMessages.slice(-this.onceAddMessagesMaxNum) : newMessages

      if (addMessages.length > 0) {
        this.showLoadingIcon = true
        const timer = setTimeout(() => {
          this.showMessages = this.getMessageMatchColor(addMessages.concat(this.showMessages))
          this.$nextTick(() => {
            if (addMessages.length > 0) {
              const id = addMessages[addMessages.length - 1].id
              if (id) {
                const idBox = document.getElementById(id.toString() as string)
                if (idBox) {
                  idBox.scrollIntoView(true)
                }
                this.showLoadingIcon = false
              }
            }
          })
          window.clearTimeout(timer)
        }, 1000)
      }
    }
  }

  private getNewMessages(newMessageList: MessageModel[], oldMessageList: MessageModel[]) {
    const newMessages = newMessageList.filter((item) => oldMessageList.every((one) => one.id !== item.id))
    return newMessages
  }

  private handleShowContextMenu(msgItemInfo: IArguments, message: MessageModel) {
    this.$emit('showContextMenu', msgItemInfo, message)
  }

  private getMessageMatchColor(messages: MessageModel[]): MessageModel[] {
    return messages.map((msg) => {
      const topic: SubscriptionModel | undefined = this.subscriptions.find((sub: SubscriptionModel) =>
        matchTopicMethod(sub.topic, msg.topic),
      )
      if (topic && topic.color) {
        return { ...msg, color: topic.color } as MessageModel
      }
      return { ...msg, color: '' } as MessageModel
    })
  }

  private getScrollBox() {
    return this.$refs.messageListBox as Element
  }

  private getScrollOffsetToTop() {
    this.isScrolling = true
    window.clearTimeout(this.timeout)
    this.timeout = undefined
    const { scrollTop } = this.getScrollBox()
    this.scrollTop = scrollTop
    if (this.timeout === undefined) {
      this.timeout = window.setTimeout(() => {
        if (this.getScrollBox().scrollTop === this.scrollTop) {
          this.isScrolling = false
          window.clearTimeout(this.timeout)
          this.timeout = undefined
        }
      }, 3000)
    }
  }

  private mounted() {
    this.$nextTick(() => {
      const scrollRef = this.getScrollBox()
      scrollRef.addEventListener('scroll', this.getScrollOffsetToTop)
    })
  }

  private beforeDestroy() {
    this.getScrollBox().removeEventListener('scroll', this.getScrollOffsetToTop)
    window.clearTimeout(this.timeout)
  }
}
</script>

<style lang="scss">
.message-list {
  padding: 0 16px;
  overflow-x: hidden;
  overflow-y: overlay;
  .vue-recycle-scroller.scroller.ready.direction-vertical {
    overflow-y: visible;
    .vue-recycle-scroller__item-wrapper {
      overflow: visible;
    }
  }
  &.scrolling {
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-track {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: var(--color-bg-scrollbar);
      width: 8px;
    }
  }
  &.still {
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-track {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: var(--color-bg-scrollbar-inactive);
      width: 8px;
    }
  }

  .loading-icon {
    display: inline-block;
    width: 100%;
    margin-top: 6px;
    text-align: center;
    font-size: 14px;
    color: var(--color-main-green);
  }
}
</style>
