<template>
	<view
		class="card"
		:style="{
			boxShadow: shadow && '0px 0px 3px 1px rgba(0, 0, 0, 0.08)'
		}"
		@tap.stop="$emit('tapClick')"
	>
		<view class="card-title" v-if="title">
			<text>{{ title }}</text>
			<slot name="icon"></slot>
			<uni-icons class="fr" :type="rightIcon" size="15" v-if="rightIcon"></uni-icons>
		</view>
		<view
			class="card-content"
			:style="{
				padding: typeof padding === 'string' ? padding : padding + 'px'
			}"
		>
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
		rightIcon: {
			type: String,
			default: 'plusempty'
		},
		padding: {
			type: [Number, String],
			default: 20
		},
		shadow: {
			type: Boolean,
			default: true
		}
	}
}
</script>

<style lang="scss">
.card {
	margin: 10px;
	border-radius: 6px;
	border: 1px solid #edf0f3;
	background-color: #fff;
	position: relative;

	&-title {
		padding: 0 15px;
		line-height: 38px;
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
		color: #000;
		background-image: linear-gradient(to right, #e3f2ff, #fff);
		overflow: hidden;
	}
}
</style>
