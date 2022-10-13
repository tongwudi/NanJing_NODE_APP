<template>
	<view class="card" @click.stop="$emit('tapClick')">
		<view class="card-title" v-if="title">
			<text>{{ title }}</text>
			<slot name="icon"></slot>
		</view>
		<view class="card-content" :style="{ padding: renderPadding }">
			<slot></slot>
		</view>
		<slot name="other"></slot>
	</view>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: ''
		},
		padding: {
			type: [Number, String],
			default: 20
		},
		shadow: {
			type: Boolean,
			default: true
		}
	},
	computed: {
		renderPadding() {
			return typeof this.padding === 'string'
				? this.padding
				: this.padding * 2 + 'rpx'
		}
	}
}
</script>

<style lang="scss">
.card {
	margin: 20rpx;
	border-radius: 12rpx;
	border: 1rpx solid #edf0f3;
	background-color: #fff;
	// box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.08);
	position: relative;
	&-title {
		padding: 0 30rpx;
		line-height: 38px;
		border-top-left-radius: 12rpx;
		border-top-right-radius: 12rpx;
		color: #000;
		background-image: linear-gradient(to right, #e3f2ff, #fff);
		overflow: hidden;
	}
}
</style>
