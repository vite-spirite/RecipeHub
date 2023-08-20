<template>
    <button class="px-5 py-3 rounded-lg" :class="{'bg-slate-200': !checked, 'bg-orange-300': checked}" @click.prevent="handleChange(value)">{{ label }}</button>
</template>

<script setup lang="ts">
import {useField} from 'vee-validate'

const {name, value} = defineProps<{
    modelValue?: null|number|number[],
    label: string,
    name: string,
    value: number,
}>()

const {checked, handleChange} = useField(name, undefined, {
    type: 'checkbox',
    checkedValue: value,
})
</script>
