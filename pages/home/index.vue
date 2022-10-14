<template>
	<view></view>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
	data() {
		return {}
	},
	onShow() {
		this.REVISE_TABBAR()
	},
	methods: {
		...mapMutations(['REVISE_TABBAR'])
	}
}
</script>

<style></style>
