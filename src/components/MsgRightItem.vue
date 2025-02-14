<template>
  <div class="msg-right-item">
    <div class="right-payload payload" @contextmenu.prevent="customMenu($event)">
      <p class="right-info">
        <span class="qos">QoS: {{ qos }}</span>
        <span class="encoding"><strike v-if="encodingType.length > 1">{{ encodingType[1] }}</strike> {{ encodingType[0] }}</span>
        <br>
        <span class="topic">Topic: {{ topic }}</span>
        <span v-if="retain" class="retain">Retain</span>
      </p>
      <div class="meta">
        <p v-if="properties.subscriptionIdentifier" class="properties right">
          <span>{{ $t('connections.subscriptionIdentifier') }}: {{ properties.subscriptionIdentifier }}</span>
        </p>
        <p v-if="properties.contentType" class="properties right">
          <span>{{ $t('connections.contentType') }}: {{ properties.contentType }}</span>
        </p>
        <p v-if="properties.topicAlias" class="properties right">
          <span>{{ $t('connections.topicAlias') }}: {{ properties.topicAlias }}</span>
        </p>
        <p v-if="properties.responseTopic" class="properties right">
          <span>{{ $t('connections.responseTopic') }}: {{ properties.responseTopic }}</span>
        </p>
        <p v-if="properties.correlationData" class="properties right">
          <span>{{ $t('connections.correlationData') }}: {{ properties.correlationData }}</span>
        </p>
        <p v-if="properties.userProperties" class="user-properties properties right">
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
    <p class="right-time time">{{ createAt }}</p>
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
export default class MsgrightItem extends Vue {
  @Prop({ required: true }) public topic!: string
  @Prop({ required: true }) public qos!: number
  @Prop({ required: true }) public payload!: string
  @Prop({ required: true }) public createAt!: string
  @Prop({ required: true }) public encoding!: string
  @Prop({ required: false, default: false }) public retain!: boolean
  @Prop({ required: false, default: () => ({}) }) public properties!: PushPropertiesModel

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

.msg-right-item {
  text-align: right;
  @include msg-item;
  .right-payload {
    color: var(--color-text-active);
    background: var(--color-text-right_block);
    border-radius: 10px 0 10px 10px;
    text-align: left;
  }
  .right-payload,
  .right-time {
    position: relative;
    left: 0px;
    animation: rightMsg 0.3s ease-in-out;
  }
  .retain {
    color: var(--color-text-active);
    background-color: var(--color-minor-green);
  }
}
</style>
