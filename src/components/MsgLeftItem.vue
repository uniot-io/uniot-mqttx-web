<template>
  <div class="msg-left-item">
    <span class="topic-color" :style="{ background: color }"></span>
    <div ref="leftPayload" class="left-payload payload" @contextmenu.prevent="customMenu($event)">
      <p class="left-info">
        <span class="qos">QoS: {{ qos }}</span>
        <span class="encoding"><strike v-if="encodingType.length > 1">{{ encodingType[1] }}</strike> {{ encodingType[0] }}</span>
        <br>
        <span class="topic">Topic: {{ topic }}</span>
        <span v-if="retain" class="retain">Retain</span>
      </p>
      <div class="meta">
        <p v-if="properties.subscriptionIdentifier" class="properties left">
          <span>{{ $t('connections.subscriptionIdentifier') }}: {{ properties.subscriptionIdentifier }}</span>
        </p>
        <p v-if="properties.contentType" class="properties left">
          <span>{{ $t('connections.contentType') }}: {{ properties.contentType }}</span>
        </p>
        <p v-if="properties.topicAlias" class="properties left">
          <span>{{ $t('connections.topicAlias') }}: {{ properties.topicAlias }}</span>
        </p>
        <p v-if="properties.responseTopic" class="properties left">
          <span>{{ $t('connections.responseTopic') }}: {{ properties.responseTopic }}</span>
        </p>
        <p v-if="properties.correlationData" class="properties left">
          <span>{{ $t('connections.correlationData') }}: {{ properties.correlationData }}</span>
        </p>
        <p v-if="properties.userProperties" class="user-properties properties left">
          <KeyValueEditor
            class="msg-item-props"
            :title="$t('connections.userProperties')"
            :disabled="true"
            :value="properties.userProperties"
          />
        </p>
      </div>
      <pre>{{ payload }}</pre>
    </div>
    <p class="left-time time">{{ createAt }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import KeyValueEditor from './KeyValueEditor.vue'

@Component({
  components: {
    KeyValueEditor,
  },
})
export default class MsgLeftItem extends Vue {
  @Prop({ required: true }) public topic!: string
  @Prop({ required: true }) public qos!: number
  @Prop({ required: true }) public payload!: string
  @Prop({ required: true }) public createAt!: string
  @Prop({ required: true }) public encoding!: string
  @Prop({ required: false, default: false }) public retain!: boolean
  @Prop({ required: false, default: () => ({}) }) public properties!: PushPropertiesModel
  @Prop({ required: false, default: '' }) public color!: string

  get encodingType () {
    return this.encoding.split(';')
  }

  private customMenu(event: MouseEvent) {
    this.$emit('showmenu', this.payload, event)
  }
}
</script>

<style lang="scss">
@import '~@/assets/scss/mixins.scss';

.msg-left-item {
  @include msg-item;
  text-align: left;
  position: relative;
  .topic-color {
    height: calc(100% - 44px);
    display: inline-block;
    width: 4px;
    position: absolute;
    top: 11px;
    border-radius: 8px;
    left: -4px;
  }
  .left-payload {
    background: var(--color-main-grey);
    border-radius: 0px 10px 10px 10px;
    position: relative;
  }
  .left-payload,
  .left-time {
    position: relative;
    right: 0px;
    animation: leftMsg 0.3s ease-in-out;
  }
}
</style>
