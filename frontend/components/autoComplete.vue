<template>
    <div class="auto-complete relative w-full" ref="autoCompleteRef">
        <input type="text" :placeholder="placeholder" class="input" v-model="search" @input="resolveItems(search)" @focus="open()" @keyup.enter.prevent="resolveItems(search).length === 0 && onEmptySelect ? onEmptySelect(search) : null,resolveItems(''),search=''"/>

        <div class="absolute top-full left-0 w-full" v-if="isOpen">
            <div class="card">
                <div class="card-content">
                    <ul class="list">
                        <li v-for="item in resolveItems(search)" :key="item[indexKey]" class="list-item py-2 rounded-lg bg-transparent hover:bg-orange-300 transition-all duration-300 font-bold font-primary cursor-pointer">
                            <h6 class="list-item-content p-2 px-5" @click="onSelect(item), close();">
                                {{ item[textKey] }}
                            </h6>
                        </li>
                    </ul>

                    <div class="card-footer" v-if="resolveItems(search).length === 0">
                        {{ noResultMessage }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
type IItem = {
    [K: string]: any
}

type IAutoComplete = {
    items: IItem[],
    compareKey: string,
    indexKey: string,
    textKey: string,
    noResultMessage: string,
    placeholder: string,
    onSelect: (item: any) => void,
    onEmptySelect?: (search: string) => void,
}

import { onClickOutside } from '@vueuse/core';

const {items, compareKey} = defineProps<IAutoComplete>();
const search = ref('');
const isOpen = ref(false);
const autoCompleteRef: Ref<HTMLDivElement|null> = ref(null);

onClickOutside(autoCompleteRef, () => {
    close();
})

const open = () => {
    isOpen.value = true;
}

const close = () => {
    isOpen.value = false;
}

const resolveItems = (search: string) => {
    return items.filter(item => item[compareKey].toLowerCase().includes(search.toLowerCase()));
}
</script>