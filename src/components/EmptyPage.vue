<template>
  <div class="empty-page right-content">
    <div class="empty-page__block">
      <div>
        <img :src="imageSrc" alt="new connection" />
      </div>
      <el-button class="primary-btn" icon="el-icon-plus" @click="clickMethod(false)">
        {{ btnTitle }}
      </el-button>
      <p>
        Add a new MQTT connection to get started. Click the '+' to connect to a broker.
      <br>
        Once connected, you will be able to publish and subscribe to topics.
      <br>
        Enjoy messaging!
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class EmptyPage extends Vue {
  @Prop({ required: true }) public btnTitle!: 'connections'
  @Prop({ required: true }) public name!: string
  @Prop() public clickMethod!: <T>() => T | void

  get imageSrc(): string {
    return require(`../assets/images/${this.name}.svg`)
  }
}
</script>

<style lang="scss" scoped>
.empty-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  .empty-page__block {
    text-align: center;
    img {
      width: 397px;
      height: 177px;
      margin-bottom: 20px;
    }
    .primary-btn {
      background: var(--color-main-green);
      color: #fff;
      border: 1px solid var(--color-main-green);
      &:hover {
        background: var(--color-minor-green);
      }
    }
    p {
      margin: 32px auto;
      max-width: 650px;
    }
  }
}
</style>
